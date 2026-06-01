<?php
declare(strict_types=1);

// PayPal IPN listener.
// PayPal will POST here after checkout if `notify_url` is set.
// We verify by POSTing back with `cmd=_notify-validate`.

require_once __DIR__ . '/db.php';

function ipn_log(string $msg): void {
    // Best-effort logging; avoid throwing if filesystem is read-only.
    try {
        $line = '[' . gmdate('c') . '] ' . $msg . "\n";
        @file_put_contents(__DIR__ . '/../data/paypal-ipn.log', $line, FILE_APPEND);
    } catch (Throwable $ignored) {
    }
}

function ipn_log_sold_item(array $entry): void {
    // JSONL (one JSON object per line) for easy grep/parsing.
    try {
        $entry['ts_utc'] = gmdate('c');
        $line = json_encode($entry, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . "\n";
        @file_put_contents(__DIR__ . '/../data/sold-items.jsonl', $line, FILE_APPEND);
    } catch (Throwable $ignored) {
    }
}

function post_back_to_paypal(array $post, bool $sandbox = false): string {
    $endpoint = $sandbox
        ? 'https://ipnpb.sandbox.paypal.com/cgi-bin/webscr'
        : 'https://ipnpb.paypal.com/cgi-bin/webscr';

    $payload = 'cmd=_notify-validate';
    foreach ($post as $k => $v) {
        if (is_array($v)) continue;
        $payload .= '&' . urlencode((string)$k) . '=' . urlencode((string)$v);
    }

    // Prefer cURL when available.
    if (function_exists('curl_init')) {
        $ch = curl_init($endpoint);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Connection: close',
            'Content-Type: application/x-www-form-urlencoded',
        ]);
        curl_setopt($ch, CURLOPT_TIMEOUT, 15);
        $resp = curl_exec($ch);
        $err = curl_error($ch);
        curl_close($ch);
        if ($resp === false) {
            throw new RuntimeException('IPN verify request failed: ' . $err);
        }
        return (string)$resp;
    }

    $ctx = stream_context_create([
        'http' => [
            'method' => 'POST',
            'header' => "Content-Type: application/x-www-form-urlencoded\r\nConnection: close\r\n",
            'content' => $payload,
            'timeout' => 15,
        ],
    ]);

    $resp = @file_get_contents($endpoint, false, $ctx);
    if ($resp === false) {
        throw new RuntimeException('IPN verify request failed (no response).');
    }

    return (string)$resp;
}

function extract_item_ids(array $post): array {
    $ids = [];

    // Cart uploads include item_number_1..N.
    foreach ($post as $k => $v) {
        if (!is_string($k)) continue;
        if (!preg_match('/^item_number_(\d+)$/', $k)) continue;
        $id = (int)$v;
        if ($id > 0) $ids[] = $id;
    }

    // De-dupe.
    $ids = array_values(array_unique($ids));
    sort($ids);
    return $ids;
}

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        header('Content-Type: text/plain; charset=utf-8');
        echo "Method Not Allowed";
        exit;
    }

    $post = $_POST;
    if (!is_array($post) || !$post) {
        http_response_code(400);
        header('Content-Type: text/plain; charset=utf-8');
        echo "Missing POST";
        exit;
    }

    // Optional: set PAYPAL_IPN_SANDBOX=1 in environment for sandbox testing.
    $sandbox = false;
    $sandboxEnv = getenv('PAYPAL_IPN_SANDBOX');
    if ($sandboxEnv !== false) {
        $v = strtolower(trim((string)$sandboxEnv));
        $sandbox = !($v === '' || $v === '0' || $v === 'false' || $v === 'no');
    }

    $verify = post_back_to_paypal($post, $sandbox);
    $verifyTrim = strtoupper(trim($verify));

    if ($verifyTrim !== 'VERIFIED') {
        ipn_log('IPN INVALID: ' . $verifyTrim);
        http_response_code(400);
        header('Content-Type: text/plain; charset=utf-8');
        echo "INVALID";
        exit;
    }

    $paymentStatus = isset($post['payment_status']) ? trim((string)$post['payment_status']) : '';
    if (strcasecmp($paymentStatus, 'Completed') !== 0) {
        ipn_log('IPN VERIFIED but not completed: status=' . $paymentStatus);
        http_response_code(200);
        header('Content-Type: text/plain; charset=utf-8');
        echo "OK";
        exit;
    }

    // Basic receiver check (best-effort).
    // We use merchant ID in checkout.php (`business`), which PayPal may report as receiver_id.
    $expectedReceiverId = 'BSB86CSLZFYL2';
    $receiverId = isset($post['receiver_id']) ? trim((string)$post['receiver_id']) : '';
    if ($receiverId !== '' && strcasecmp($receiverId, $expectedReceiverId) !== 0) {
        ipn_log('IPN VERIFIED but receiver_id mismatch: ' . $receiverId);
        http_response_code(200);
        header('Content-Type: text/plain; charset=utf-8');
        echo "OK";
        exit;
    }

    $ids = extract_item_ids($post);
    if (!$ids) {
        ipn_log('IPN VERIFIED completed but no item ids');
        http_response_code(200);
        header('Content-Type: text/plain; charset=utf-8');
        echo "OK";
        exit;
    }

    $pdo = api_pdo();
    $tableInfo = api_db_table_resolved($pdo);
    $tableName = $tableInfo['used'];
    $table = '`' . $tableName . '`';
    $hasLocation = api_db_has_column($pdo, $tableName, 'location');

    $txnId = isset($post['txn_id']) ? trim((string)$post['txn_id']) : '';
    $gross = isset($post['mc_gross']) ? trim((string)$post['mc_gross']) : '';
    $currency = isset($post['mc_currency']) ? trim((string)$post['mc_currency']) : '';

    $pdo->beginTransaction();
    $deleted = 0;
    $sold = [];

    $select = $hasLocation
        ? $pdo->prepare('SELECT `location` FROM ' . $table . ' WHERE id = :id')
        : null;
    $stmt = $pdo->prepare('DELETE FROM ' . $table . ' WHERE id = :id');
    foreach ($ids as $id) {
        $stampLocation = null;
        if ($select) {
            $select->execute([':id' => $id]);
            $row = $select->fetch(PDO::FETCH_ASSOC);
            if (is_array($row) && array_key_exists('location', $row)) {
                $stampLocation = (string)$row['location'];
            }
        }

        $stmt->execute([':id' => $id]);
        $didDelete = $stmt->rowCount() > 0;
        if ($didDelete) $deleted += 1;

        $sold[] = [
            'id' => $id,
            'location' => $stampLocation,
            'deleted' => $didDelete,
        ];

        ipn_log_sold_item([
            'event' => 'sold',
            'payment_status' => $paymentStatus,
            'receiver_id' => $receiverId,
            'txn_id' => $txnId,
            'stamp_id' => $id,
            'stamp_location' => $stampLocation,
            'deleted' => $didDelete,
            'mc_gross' => $gross,
            'mc_currency' => $currency,
        ]);
    }

    $pdo->commit();

    $soldParts = array_map(function (array $s): string {
        $id = (int)($s['id'] ?? 0);
        $loc = isset($s['location']) && $s['location'] !== null ? trim((string)$s['location']) : '';
        $deleted = !empty($s['deleted']);
        $suffix = $loc !== '' ? ('@' . $loc) : '';
        return $id . $suffix . ($deleted ? '' : '(not_deleted)');
    }, $sold);

    ipn_log('IPN VERIFIED completed; deleted=' . $deleted . '; items=' . implode(',', $soldParts));

    http_response_code(200);
    header('Content-Type: text/plain; charset=utf-8');
    echo "OK";
} catch (Throwable $e) {
    try {
        if (isset($pdo) && $pdo instanceof PDO && $pdo->inTransaction()) {
            $pdo->rollBack();
        }
    } catch (Throwable $ignored) {
    }

    ipn_log('IPN ERROR: ' . $e->getMessage());
    http_response_code(500);
    header('Content-Type: text/plain; charset=utf-8');
    echo "ERROR";
}
