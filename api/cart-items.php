<?php
declare(strict_types=1);

require_once __DIR__ . '/db.php';

function api_parse_ids(string $raw, int $max = 50): array {
    $raw = trim($raw);
    if ($raw === '') return [];

    $parts = preg_split('/\s*,\s*/', $raw);
    if (!is_array($parts)) return [];

    $ids = [];
    foreach ($parts as $p) {
        if ($p === '') continue;
        if (!ctype_digit($p)) continue;
        $n = (int)$p;
        if ($n <= 0) continue;
        $ids[] = $n;
        if (count($ids) >= $max) break;
    }

    // De-dupe while preserving first-seen order.
    $seen = [];
    $out = [];
    foreach ($ids as $n) {
        if (isset($seen[$n])) continue;
        $seen[$n] = true;
        $out[] = $n;
    }

    return $out;
}

try {
    $ids = api_parse_ids(isset($_GET['ids']) ? (string)$_GET['ids'] : '');
    if (!$ids) {
        api_send_json(['items' => []]);
        exit;
    }

    $pdo = api_pdo();
    $tableName = api_db_table();
    $table = '`' . $tableName . '`';

    $hasPriceCents = api_db_has_column($pdo, $tableName, 'price_cents');
    $hasPrice = api_db_has_column($pdo, $tableName, 'price');
    $priceSel = $hasPriceCents
        ? 'price_cents'
        : ($hasPrice ? 'CAST(ROUND(`price` * 100) AS SIGNED) AS price_cents' : '0 AS price_cents');

    $placeholders = implode(',', array_fill(0, count($ids), '?'));
    $sql =
        'SELECT id, scott, `condition`, ' . $priceSel . ' ' .
        'FROM ' . $table . ' ' .
        'WHERE id IN (' . $placeholders . ')';

    $stmt = $pdo->prepare($sql);
    foreach ($ids as $i => $id) {
        $stmt->bindValue($i + 1, $id, PDO::PARAM_INT);
    }
    $stmt->execute();

    $rows = $stmt->fetchAll();
    $byId = [];
    foreach ($rows as $r) {
        $id = (int)($r['id'] ?? 0);
        if ($id <= 0) continue;
        $byId[$id] = [
            'id' => $id,
            'scott' => (string)($r['scott'] ?? ''),
            'condition' => (string)($r['condition'] ?? ''),
            'priceCents' => (int)($r['price_cents'] ?? 0),
        ];
    }

    // Preserve requested order and omit unknown ids.
    $items = [];
    foreach ($ids as $id) {
        if (isset($byId[$id])) $items[] = $byId[$id];
    }

    $payload = ['items' => $items];
    if (api_debug_enabled()) {
        $payload['debug'] = api_db_debug_info($pdo, $tableName);
        $payload['debug']['requestedIds'] = $ids;
        $payload['debug']['returnedCount'] = count($items);
    }

    api_send_json($payload);
} catch (Throwable $e) {
    $payload = [
        'error' => 'cart_items_failed',
        'message' => $e->getMessage(),
    ];
    if (api_debug_enabled()) {
        try {
            $pdo = isset($pdo) && $pdo instanceof PDO ? $pdo : api_pdo();
            $tableName = isset($tableName) && is_string($tableName) ? $tableName : api_db_table();
            $payload['debug'] = api_db_debug_info($pdo, $tableName);
        } catch (Throwable $ignored) {
        }
    }
    api_send_json($payload, 500);
}
