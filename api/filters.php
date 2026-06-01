<?php
declare(strict_types=1);

require_once __DIR__ . '/db.php';

try {
    $pdo = api_pdo();
    $tableName = api_db_table();
    $table = '`' . $tableName . '`';

    $hasCountry = api_db_has_column($pdo, $tableName, 'country');

    $country = isset($_GET['country']) ? trim((string)$_GET['country']) : '';

    // Countries (always global) — only if the schema supports it.
    $countries = [];
    if ($hasCountry) {
        $countries = $pdo->query('SELECT DISTINCT country FROM ' . $table . ' ORDER BY country')->fetchAll(PDO::FETCH_COLUMN);
    }

    // Other filters (optionally scoped by country)
    $where = '';
    $params = [];
    if ($country !== '' && $hasCountry) {
        $where = ' WHERE country = :country';
        $params[':country'] = $country;
    }

    $stmt = $pdo->prepare('SELECT DISTINCT `condition` FROM ' . $table . $where . ' ORDER BY `condition`');
    $stmt->execute($params);
    $conditions = $stmt->fetchAll(PDO::FETCH_COLUMN);

    $stmt = $pdo->prepare('SELECT DISTINCT hinged FROM ' . $table . $where . ' ORDER BY hinged');
    $stmt->execute($params);
    $hinged = $stmt->fetchAll(PDO::FETCH_COLUMN);

    $stmt = $pdo->prepare('SELECT DISTINCT gum FROM ' . $table . $where . ' ORDER BY gum');
    $stmt->execute($params);
    $gums = $stmt->fetchAll(PDO::FETCH_COLUMN);

    $stmt = $pdo->prepare('SELECT DISTINCT grade FROM ' . $table . $where . ' ORDER BY grade');
    $stmt->execute($params);
    $grades = $stmt->fetchAll(PDO::FETCH_COLUMN);


    $payload = [
        'countries' => array_values(array_filter($countries, fn($v) => $v !== null && $v !== '')),
        'conditions' => array_values(array_filter($conditions, fn($v) => $v !== null && $v !== '')),
        'hinged' => array_values(array_filter($hinged, fn($v) => $v !== null && $v !== '')),
        'gums' => array_values(array_filter($gums, fn($v) => $v !== null && $v !== '')),
        'grades' => array_values(array_filter($grades, fn($v) => $v !== null && $v !== '')),
    ];

    if (api_debug_enabled()) {
        $payload['debug'] = api_db_debug_info($pdo, $tableName);
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
            $tableName = isset($tableName) && is_string($tableName) ? $tableName : api_db_table();
            $payload['debug'] = api_db_debug_info($pdo, $tableName);
        } catch (Throwable $ignored) {
        }
    }
    api_send_json($payload, 500);
}
