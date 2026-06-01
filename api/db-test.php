<?php
declare(strict_types=1);

require_once __DIR__ . '/db.php';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

try {
    $pdo = api_pdo();

    $dbName = $pdo->query('SELECT DATABASE()')->fetchColumn();

    $tableInfo = api_db_table_resolved($pdo);
    $tableName = $tableInfo['used'];
    $quotedTable = '`' . $tableName . '`';
    $tableExists = (bool)$tableInfo['usedExists'];

    $columns = [];
    $rowCount = null;
    if ($tableExists) {
        $columns = api_db_columns($pdo, $tableName);
        $rowCount = (int)($pdo->query('SELECT COUNT(*) FROM ' . $quotedTable)->fetchColumn() ?: 0);
    }

    echo json_encode([
        'ok' => true,
        'database' => $dbName,
        'tableConfigured' => $tableInfo['configured'],
        'tableConfiguredExists' => (bool)$tableInfo['configuredExists'],
        'table' => $tableName,
        'tableExists' => $tableExists,
        'columns' => $columns,
        'rowCount' => $rowCount,
    ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => $e->getMessage()], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
}