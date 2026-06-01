<?php
declare(strict_types=1);

require_once __DIR__ . '/db.php';

try {
    $pdo = api_pdo();
    $tableInfo = api_db_table_resolved($pdo);
    $tableName = $tableInfo['used'];
    $table = '`' . $tableName . '`';

    $hasCountry = api_db_has_column($pdo, $tableName, 'country');

    $country = isset($_GET['country']) ? trim((string)$_GET['country']) : '';

    // Countries (always global) — only if the schema supports it.
    $countries = [];
    if ($hasCountry) {
        $rows = $pdo->query('SELECT country AS v, COUNT(*) AS cnt FROM ' . $table . ' GROUP BY country ORDER BY country')->fetchAll(PDO::FETCH_ASSOC);
        foreach ($rows as $r) {
            $v = isset($r['v']) ? trim((string)$r['v']) : '';
            if ($v === '') continue;
            $countries[] = ['value' => $v, 'count' => (int)($r['cnt'] ?? 0)];
        }
    }

    // Other filters (optionally scoped by country)
    $where = '';
    $params = [];
    if ($country !== '' && $hasCountry) {
        $where = ' WHERE country = :country';
        $params[':country'] = $country;
    }

    $stmt = $pdo->prepare('SELECT `condition` AS v, COUNT(*) AS cnt FROM ' . $table . $where . ' GROUP BY `condition` ORDER BY `condition`');
    $stmt->execute($params);
    $conditions = [];
    foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $r) {
        $v = isset($r['v']) ? trim((string)$r['v']) : '';
        if ($v === '') continue;
        $conditions[] = ['value' => $v, 'count' => (int)($r['cnt'] ?? 0)];
    }

    $stmt = $pdo->prepare('SELECT hinged AS v, COUNT(*) AS cnt FROM ' . $table . $where . ' GROUP BY hinged ORDER BY hinged');
    $stmt->execute($params);
    $hinged = [];
    foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $r) {
        $v = isset($r['v']) ? trim((string)$r['v']) : '';
        if ($v === '') continue;
        $hinged[] = ['value' => $v, 'count' => (int)($r['cnt'] ?? 0)];
    }

    $stmt = $pdo->prepare('SELECT gum AS v, COUNT(*) AS cnt FROM ' . $table . $where . ' GROUP BY gum ORDER BY gum');
    $stmt->execute($params);
    $gums = [];
    foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $r) {
        $v = isset($r['v']) ? trim((string)$r['v']) : '';
        if ($v === '') continue;
        $gums[] = ['value' => $v, 'count' => (int)($r['cnt'] ?? 0)];
    }

    $stmt = $pdo->prepare('SELECT grade AS v, COUNT(*) AS cnt FROM ' . $table . $where . ' GROUP BY grade ORDER BY grade');
    $stmt->execute($params);
    $grades = [];
    foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $r) {
        $v = isset($r['v']) ? trim((string)$r['v']) : '';
        if ($v === '') continue;
        $grades[] = ['value' => $v, 'count' => (int)($r['cnt'] ?? 0)];
    }


    $payload = [
        // Arrays of { value, count }
        'countries' => $countries,
        'conditions' => $conditions,
        'hinged' => $hinged,
        'gums' => $gums,
        'grades' => $grades,
    ];

    if (api_debug_enabled()) {
        $payload['debug'] = array_merge($tableInfo, api_db_debug_info($pdo, $tableName));
        try {
            $payload['debug']['database'] = $pdo->query('SELECT DATABASE()')->fetchColumn();
            $payload['debug']['rowCount'] = (int)($pdo->query('SELECT COUNT(*) FROM ' . $table)->fetchColumn() ?: 0);
        } catch (Throwable $ignored) {
        }
        $payload['debug']['countryParamIgnored'] = ($country !== '' && !$hasCountry);
        $payload['debug']['countryParam'] = $country;
    }

    api_send_json($payload);
} catch (Throwable $e) {
    $payload = [
        'error' => 'filters_failed',
        'message' => $e->getMessage(),
    ];
    if (api_debug_enabled()) {
        try {
            $pdo = isset($pdo) && $pdo instanceof PDO ? $pdo : api_pdo();
            $tableInfo = isset($tableInfo) && is_array($tableInfo) ? $tableInfo : api_db_table_resolved($pdo);
            $tableName = isset($tableName) && is_string($tableName) ? $tableName : (string)($tableInfo['used'] ?? api_db_table());
            $payload['debug'] = array_merge($tableInfo, api_db_debug_info($pdo, $tableName));
        } catch (Throwable $ignored) {
        }
    }
    api_send_json($payload, 500);
}
