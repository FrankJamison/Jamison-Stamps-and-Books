<?php
declare(strict_types=1);

require_once __DIR__ . '/db.php';

function api_scott_key(string $scott): array {
    $s = trim($scott);
    if ($s === '') {
        return ['prefix' => '', 'hasNum' => false, 'num' => 0, 'suffix' => ''];
    }
    if (!preg_match('/^([A-Za-z]*)(\d+)?([A-Za-z]*)$/', $s, $m)) {
        return ['prefix' => $s, 'hasNum' => false, 'num' => 0, 'suffix' => ''];
    }
    return [
        'prefix' => $m[1] ?? '',
        'hasNum' => isset($m[2]) && $m[2] !== '',
        'num' => isset($m[2]) && $m[2] !== '' ? (int)$m[2] : 0,
        'suffix' => $m[3] ?? '',
    ];
}

function api_cmp_scott_asc(array $a, array $b): int {
    $A = api_scott_key((string)($a['scott'] ?? ''));
    $B = api_scott_key((string)($b['scott'] ?? ''));

    $p = strcasecmp($A['prefix'], $B['prefix']);
    if ($p !== 0) return $p;

    // Numbers sort before "no number".
    if ($A['hasNum'] !== $B['hasNum']) {
        return $A['hasNum'] ? -1 : 1;
    }
    if ($A['hasNum'] && $B['hasNum'] && $A['num'] !== $B['num']) {
        return $A['num'] <=> $B['num'];
    }

    $s = strcasecmp($A['suffix'], $B['suffix']);
    if ($s !== 0) return $s;

    // Stable tie-breaker: full scott then id.
    $full = strcasecmp((string)($a['scott'] ?? ''), (string)($b['scott'] ?? ''));
    if ($full !== 0) return $full;

    return ((int)($a['id'] ?? 0)) <=> ((int)($b['id'] ?? 0));
}

function api_int_param(string $key, int $default, int $min, int $max): int {
    if (!isset($_GET[$key])) return $default;
    $raw = trim((string)$_GET[$key]);
    if ($raw === '' || !is_numeric($raw)) return $default;
    $n = (int)$raw;
    if ($n < $min) return $min;
    if ($n > $max) return $max;
    return $n;
}

try {
    $pdo = api_pdo();
    $tableName = api_db_table();
    $table = '`' . $tableName . '`';

    $hasCountry = api_db_has_column($pdo, $tableName, 'country');
    $hasLocation = api_db_has_column($pdo, $tableName, 'location');
    $hasCount = api_db_has_column($pdo, $tableName, 'count');
    $hasDescription = api_db_has_column($pdo, $tableName, 'description');
    $hasPriceCents = api_db_has_column($pdo, $tableName, 'price_cents');
    $hasPrice = api_db_has_column($pdo, $tableName, 'price');
    $hasPaypalId = api_db_has_column($pdo, $tableName, 'paypal_id');

    $q = isset($_GET['q']) ? trim((string)$_GET['q']) : '';
    $country = isset($_GET['country']) ? trim((string)$_GET['country']) : '';
    $condition = isset($_GET['condition']) ? trim((string)$_GET['condition']) : '';
    $hinged = isset($_GET['hinged']) ? trim((string)$_GET['hinged']) : '';
    $gum = isset($_GET['gum']) ? trim((string)$_GET['gum']) : '';
    $grade = isset($_GET['grade']) ? trim((string)$_GET['grade']) : '';
    $sort = isset($_GET['sort']) ? trim((string)$_GET['sort']) : '';

    $pageSize = api_int_param('pageSize', 25, 1, 100);
    $page = api_int_param('page', 1, 1, 1000000);

    $where = [];
    $params = [];

    if ($q !== '') {
        $where[] = 'scott LIKE :q';
        $params[':q'] = '%' . $q . '%';
    }
    if ($country !== '' && $hasCountry) {
        $where[] = 'country = :country';
        $params[':country'] = $country;
    }
    if ($condition !== '') {
        $where[] = '`condition` = :condition';
        $params[':condition'] = $condition;
    }
    if ($hinged !== '') {
        $where[] = 'hinged = :hinged';
        $params[':hinged'] = $hinged;
    }
    if ($gum !== '') {
        $where[] = 'gum = :gum';
        $params[':gum'] = $gum;
    }
    if ($grade !== '') {
        $where[] = 'grade = :grade';
        $params[':grade'] = $grade;
    }

    $whereSql = $where ? (' WHERE ' . implode(' AND ', $where)) : '';

    // Count total
    $stmt = $pdo->prepare('SELECT COUNT(*) AS cnt FROM ' . $table . $whereSql);
    $stmt->execute($params);
    $total = (int)($stmt->fetchColumn() ?: 0);

    $totalPages = max(1, (int)ceil($total / $pageSize));
    if ($page > $totalPages) $page = $totalPages;

    $offset = ($page - 1) * $pageSize;

    // Safe ORDER BY mapping
    $orderSql = 'ORDER BY id ASC';
    switch ($sort) {
        case 'scott-asc':
            // Sort in PHP for maximum MariaDB compatibility.
            break;
        case 'scott-desc':
            // Sort in PHP for maximum MariaDB compatibility.
            break;
        case 'price-asc':
            // Works with either a physical price_cents column or an aliased expression.
            $orderSql = 'ORDER BY price_cents ASC, id ASC';
            break;
        case 'price-desc':
            // Works with either a physical price_cents column or an aliased expression.
            $orderSql = 'ORDER BY price_cents DESC, id DESC';
            break;
        default:
            // keep stable default by id
            break;
    }

    // LIMIT/OFFSET: interpolate validated ints to avoid driver quirks.
    $limitSql = (string)$pageSize;
    $offsetSql = (string)$offset;

    if ($sort === 'scott-asc' || $sort === 'scott-desc') {
        // Fetch all matching rows, sort + page in PHP.
        $countrySel = $hasCountry ? 'country' : "'' AS country";
        $locationSel = $hasLocation ? '`location`' : "'' AS location";
        $countSel = $hasCount ? '`count`' : "'000' AS `count`";
        $descriptionSel = $hasDescription ? '`description`' : "'' AS description";
        $priceSel = $hasPriceCents
            ? 'price_cents'
            : ($hasPrice ? 'CAST(ROUND(`price` * 100) AS SIGNED) AS price_cents' : '0 AS price_cents');
        $paypalSel = $hasPaypalId ? 'paypal_id' : "'' AS paypal_id";
        $sql =
            'SELECT id, ' . $countrySel . ', scott, `condition`, hinged, gum, grade, ' . $countSel . ', ' . $descriptionSel . ', ' . $priceSel . ', ' . $locationSel . ', ' . $paypalSel . ' ' .
            'FROM ' . $table . ' ' .
            $whereSql;

        $stmt = $pdo->prepare($sql);
        foreach ($params as $k => $v) {
            $stmt->bindValue($k, $v);
        }
        $stmt->execute();
        $rows = $stmt->fetchAll();

        usort($rows, 'api_cmp_scott_asc');
        if ($sort === 'scott-desc') {
            $rows = array_reverse($rows);
        }
        $rows = array_slice($rows, $offset, $pageSize);
    } else {
        // Let the database do paging/sorting.
        $countrySel = $hasCountry ? 'country' : "'' AS country";
        $locationSel = $hasLocation ? '`location`' : "'' AS location";
        $countSel = $hasCount ? '`count`' : "'000' AS `count`";
        $descriptionSel = $hasDescription ? '`description`' : "'' AS description";
        $priceSel = $hasPriceCents
            ? 'price_cents'
            : ($hasPrice ? 'CAST(ROUND(`price` * 100) AS SIGNED) AS price_cents' : '0 AS price_cents');
        $paypalSel = $hasPaypalId ? 'paypal_id' : "'' AS paypal_id";
        $sql =
            'SELECT id, ' . $countrySel . ', scott, `condition`, hinged, gum, grade, ' . $countSel . ', ' . $descriptionSel . ', ' . $priceSel . ', ' . $locationSel . ', ' . $paypalSel . ' ' .
            'FROM ' . $table . ' ' .
            $whereSql . ' ' .
            $orderSql . ' ' .
            "LIMIT {$limitSql} OFFSET {$offsetSql}";

        $stmt = $pdo->prepare($sql);
        foreach ($params as $k => $v) {
            $stmt->bindValue($k, $v);
        }
        $stmt->execute();
        $rows = $stmt->fetchAll();
    }

    $items = array_map(function (array $r): array {
        $priceCents = (int)($r['price_cents'] ?? 0);
        return [
            'id' => (int)$r['id'],
            'country' => (string)$r['country'],
            'scott' => (string)$r['scott'],
            'condition' => (string)$r['condition'],
            'hinged' => (string)$r['hinged'],
            'gum' => (string)$r['gum'],
            'grade' => (string)$r['grade'],
            'count' => (string)($r['count'] ?? '000'),
            'description' => (string)($r['description'] ?? ''),
            'priceCents' => $priceCents,
            'price' => $priceCents / 100.0,
            'location' => (string)$r['location'],
            'paypalId' => (string)($r['paypal_id'] ?? ''),
        ];
    }, $rows);

    api_send_json([
        'items' => $items,
        'total' => $total,
        'page' => $page,
        'pageSize' => $pageSize,
        'totalPages' => $totalPages,
        // Optional debug info (safe: no credentials)
        'debug' => api_debug_enabled() ? array_merge(
            api_db_debug_info($pdo, $tableName),
            [
                'database' => $pdo->query('SELECT DATABASE()')->fetchColumn(),
                'rowCount' => (int)($pdo->query('SELECT COUNT(*) FROM ' . $table)->fetchColumn() ?: 0),
                'countryParamIgnored' => ($country !== '' && !$hasCountry),
                'countryParam' => $country,
                'sort' => $sort,
            ]
        ) : null,
    ]);
} catch (Throwable $e) {
    $payload = [
        'error' => 'stamps_failed',
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
