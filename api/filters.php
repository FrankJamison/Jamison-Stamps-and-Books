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

    // Force user-friendly condition ordering.
    // Expected order: Mint, Unused, Used (then anything else alphabetically).
    $stmt = $pdo->prepare(
        'SELECT `condition` AS v, COUNT(*) AS cnt ' .
        'FROM ' . $table . $where . ' ' .
        'GROUP BY `condition` ' .
        'ORDER BY (CASE LOWER(`condition`) ' .
            "WHEN 'mint' THEN 1 " .
            "WHEN 'unused' THEN 2 " .
            "WHEN 'used' THEN 3 " .
            'ELSE 99 END), `condition`'
    );
    $stmt->execute($params);
    $conditions = [];
    foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $r) {
        $v = isset($r['v']) ? trim((string)$r['v']) : '';
        if ($v === '') continue;
        $conditions[] = ['value' => $v, 'count' => (int)($r['cnt'] ?? 0)];
    }

    // Force user-friendly hinging ordering.
    // Expected order: Never Hinged, Hinged (then anything else alphabetically).
    $stmt = $pdo->prepare(
        'SELECT hinged AS v, COUNT(*) AS cnt ' .
        'FROM ' . $table . $where . ' ' .
        'GROUP BY hinged ' .
        'ORDER BY (CASE LOWER(hinged) ' .
            "WHEN 'never hinged' THEN 1 " .
            "WHEN 'hinged' THEN 2 " .
            'ELSE 99 END), hinged'
    );
    $stmt->execute($params);
    $hinged = [];
    foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $r) {
        $v = isset($r['v']) ? trim((string)$r['v']) : '';
        if ($v === '') continue;
        $hinged[] = ['value' => $v, 'count' => (int)($r['cnt'] ?? 0)];
    }

    // Force user-friendly gum condition ordering.
    // Expected order: OG, PG, NG, NGAI (then anything else alphabetically).
    $stmt = $pdo->prepare(
        'SELECT gum AS v, COUNT(*) AS cnt ' .
        'FROM ' . $table . $where . ' ' .
        'GROUP BY gum ' .
        'ORDER BY (CASE LOWER(gum) ' .
            "WHEN 'og - original gum' THEN 1 " .
            "WHEN 'pg - partial gum' THEN 2 " .
            "WHEN 'ng - no gum' THEN 3 " .
            "WHEN 'ngai - no gum as issued' THEN 4 " .
            'ELSE 99 END), gum'
    );
    $stmt->execute($params);
    $gums = [];
    foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $r) {
        $v = isset($r['v']) ? trim((string)$r['v']) : '';
        if ($v === '') continue;
        $gums[] = ['value' => $v, 'count' => (int)($r['cnt'] ?? 0)];
    }

    // Force user-friendly grade ordering.
    // Expected order:
    // Gem, Superb, Extra Fine/Superb, Extra Fine, Very Fine/Extra Fine, Very Fine,
    // Fine/Very Fine, Fine, Very Good/Fine, Very Good, Good/Very Good, Good,
    // Fair/Good, Fair, Poor, Damaged (then anything else alphabetically).
    // Use a simple normalization (lowercase + remove spaces) to tolerate minor formatting differences.
    $stmt = $pdo->prepare(
        'SELECT grade AS v, COUNT(*) AS cnt ' .
        'FROM ' . $table . $where . ' ' .
        'GROUP BY grade ' .
        'ORDER BY (CASE REPLACE(LOWER(grade), " ", "") ' .
            "WHEN 'gem' THEN 1 " .
            "WHEN 'superb' THEN 2 " .
            "WHEN 'extrafine/superb' THEN 3 " .
            "WHEN 'extrafine' THEN 4 " .
            "WHEN 'veryfine/extrafine' THEN 5 " .
            "WHEN 'veryfine' THEN 6 " .
            "WHEN 'fine/veryfine' THEN 7 " .
            "WHEN 'fine' THEN 8 " .
            "WHEN 'verygood/fine' THEN 9 " .
            "WHEN 'verygood' THEN 10 " .
            "WHEN 'good/verygood' THEN 11 " .
            "WHEN 'good' THEN 12 " .
            "WHEN 'fair/good' THEN 13 " .
            "WHEN 'fair' THEN 14 " .
            "WHEN 'poor' THEN 15 " .
            "WHEN 'damaged' THEN 16 " .
            'ELSE 99 END), grade'
    );
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
