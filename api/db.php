<?php
declare(strict_types=1);

function api_send_json($payload, int $status = 200): void {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
}

function api_debug_enabled(): bool {
    if (!isset($_GET['debug'])) return false;
    $v = strtolower(trim((string)$_GET['debug']));
    if ($v === '' || $v === '0' || $v === 'false' || $v === 'no') return false;
    return true;
}

function api_env(string $key, ?string $default = null): ?string {
    $val = getenv($key);
    if ($val === false) return $default;
    $val = trim((string)$val);
    return $val === '' ? $default : $val;
}

function api_local_db_config(): array {
    static $cfg = null;
    if (is_array($cfg)) return $cfg;

    // Prefer a production-friendly config filename.
    // When running locally via `php -S` (SAPI: cli-server), prefer db.local.php.
    $isDevServer = (PHP_SAPI === 'cli-server');
    $candidates = $isDevServer
        ? [__DIR__ . '/db.local.php', __DIR__ . '/db.config.php']
        : [__DIR__ . '/db.config.php', __DIR__ . '/db.local.php'];

    $path = null;
    foreach ($candidates as $p) {
        if (is_file($p)) {
            $path = $p;
            break;
        }
    }

    if ($path === null) {
        $cfg = [];
        return $cfg;
    }

    $loaded = require $path;
    $cfg = is_array($loaded) ? $loaded : [];
    return $cfg;
}

function api_db_table(): string {
    $local = api_local_db_config();

    $table = isset($local['table']) && is_string($local['table']) ? trim($local['table']) : '';
    if ($table === '') {
        $table = api_env('STAMPS_DB_TABLE', 'stamps') ?? 'stamps';
        $table = trim($table);
    }

    if ($table === '') {
        $table = 'stamps';
    }

    // Identifier safety: this value is injected into SQL, so validate strictly.
    if (!preg_match('/^[A-Za-z0-9_]+$/', $table)) {
        throw new RuntimeException('Invalid stamps table name. Use only letters, numbers, and underscores.');
    }

    return $table;
}

function api_pdo(): PDO {
    static $pdo = null;
    if ($pdo instanceof PDO) return $pdo;

    $local = api_local_db_config();

    // Provide either STAMPS_DB_HOST + STAMPS_DB_NAME, or STAMPS_DB_DSN.
    $dsn = isset($local['dsn']) && is_string($local['dsn']) ? trim($local['dsn']) : null;
    if ($dsn === '') $dsn = null;
    if ($dsn === null) $dsn = api_env('STAMPS_DB_DSN');
    if ($dsn === null) {
        $host = isset($local['host']) && is_string($local['host']) ? trim($local['host']) : null;
        if ($host === '') $host = null;
        if ($host === null) $host = api_env('STAMPS_DB_HOST');

        $database = isset($local['name']) && is_string($local['name']) ? trim($local['name']) : null;
        if ($database === '') $database = null;
        if ($database === null) $database = api_env('STAMPS_DB_NAME');

        $port = isset($local['port']) ? trim((string)$local['port']) : '';
        if ($port === '') $port = api_env('STAMPS_DB_PORT', '3306') ?? '3306';
        if ($host === null || $database === null) {
            $missing = [];
            if ($host === null) $missing[] = 'STAMPS_DB_HOST';
            if ($database === null) $missing[] = 'STAMPS_DB_NAME';
            $missingStr = implode(', ', $missing);
            throw new RuntimeException('Database is not configured. Missing/empty: ' . $missingStr . '. Set STAMPS_DB_DSN or set STAMPS_DB_HOST and STAMPS_DB_NAME.');
        }
        $dsn = "mysql:host={$host};port={$port};dbname={$database};charset=utf8mb4";
    }

    $user = isset($local['user']) && is_string($local['user']) ? trim($local['user']) : null;
    if ($user === '') $user = null;
    if ($user === null) $user = api_env('STAMPS_DB_USER');

    $pass = isset($local['pass']) && is_string($local['pass']) ? (string)$local['pass'] : null;
    if ($pass !== null && trim($pass) === '') $pass = null;
    if ($pass === null) $pass = api_env('STAMPS_DB_PASS');

    // Fail fast with a helpful message if the PDO driver isn't installed.
    // Typical local fix on Debian/Ubuntu: `sudo apt-get install php-mysql`.
    $drivers = [];
    try {
        $drivers = PDO::getAvailableDrivers();
    } catch (Throwable $ignored) {
        $drivers = [];
    }
    $scheme = strtolower((string)strtok($dsn, ':'));
    if ($scheme === 'mysql' && !in_array('mysql', $drivers, true)) {
        throw new RuntimeException('PDO MySQL driver is not installed/enabled (pdo_mysql). Install/enable it and restart PHP.');
    }
    if ($scheme === 'sqlite' && !in_array('sqlite', $drivers, true)) {
        throw new RuntimeException('PDO SQLite driver is not installed/enabled (pdo_sqlite). Install/enable it and restart PHP.');
    }

    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);

    return $pdo;
}

function api_db_columns(PDO $pdo, string $table): array {
    static $cache = [];
    if (isset($cache[$table]) && is_array($cache[$table])) {
        return $cache[$table];
    }

    // $table is validated by api_db_table() to [A-Za-z0-9_]+.
    $quoted = '`' . $table . '`';
    $stmt = $pdo->query('SHOW COLUMNS FROM ' . $quoted);
    $cols = [];
    foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
        if (!isset($row['Field'])) continue;
        $cols[] = strtolower((string)$row['Field']);
    }
    $cache[$table] = $cols;
    return $cols;
}

function api_db_has_column(PDO $pdo, string $table, string $column): bool {
    $cols = api_db_columns($pdo, $table);
    return in_array(strtolower($column), $cols, true);
}

function api_db_debug_info(PDO $pdo, string $tableName): array {
    // Intentionally excludes DSN/user/pass. This is safe to show publicly.
    $info = [
        'table' => $tableName,
    ];
    try {
        $info['columns'] = api_db_columns($pdo, $tableName);
        $info['hasCountry'] = api_db_has_column($pdo, $tableName, 'country');
    } catch (Throwable $e) {
        $info['columnsError'] = $e->getMessage();
    }
    return $info;
}
