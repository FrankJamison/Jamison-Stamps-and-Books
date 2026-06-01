<?php
declare(strict_types=1);

require_once __DIR__ . '/api/db.php';

function h(string $s): string {
    return htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function normalize_count_3(string $raw): string {
    $raw = trim($raw);
    if ($raw === '') return '001';

    // Allow numeric input like "5" and normalize to "005".
    if (ctype_digit($raw)) {
        $n = (int)$raw;
        if ($n < 0 || $n > 999) {
            throw new RuntimeException('Count must be between 0 and 999.');
        }
        return str_pad((string)$n, 3, '0', STR_PAD_LEFT);
    }

    // Allow "005" exactly.
    if (preg_match('/^\d{3}$/', $raw)) return $raw;

    throw new RuntimeException('Count must be a 1–3 digit number (will be saved as 3 digits, e.g. 5 → 005).');
}

function normalize_price(string $raw): string {
    $raw = trim($raw);
    if ($raw === '') {
        throw new RuntimeException('Price is required.');
    }
    if (!is_numeric($raw)) {
        throw new RuntimeException('Price must be a number (e.g. 0.47).');
    }
    $n = (float)$raw;
    if ($n < 0) {
        throw new RuntimeException('Price must be 0 or greater.');
    }
    // Store as a 2-decimal string for DECIMAL(10,2).
    return number_format($n, 2, '.', '');
}

$values = [
    'country' => 'United States',
    'scott' => '',
    'count' => '001',
    'condition' => '',
    'hinged' => '',
    'gum' => '',
    'grade' => '',
    'description' => '',
    'price' => '',
    'location' => '',
    'paypal_id' => '',
];

$insertedId = null;
$updatedCount = null;
$deletedCount = null;
$error = '';
$mode = 'create';
$loaded = false;

$flashSavedId = isset($_GET['saved']) ? (int)$_GET['saved'] : null;
$flashUpdated = isset($_GET['updated']) ? (int)$_GET['updated'] : null;
$flashDeleted = isset($_GET['deleted']) ? (int)$_GET['deleted'] : null;

$lookup = [
    'country' => isset($_GET['country']) ? trim((string)$_GET['country']) : 'United States',
    'scott' => isset($_GET['scott']) ? trim((string)$_GET['scott']) : '',
    'count' => isset($_GET['count']) ? trim((string)$_GET['count']) : '',
];

try {
    $pdo = api_pdo();
    $tableInfo = api_db_table_resolved($pdo);
    $tableName = $tableInfo['used'];

    $hasPaypalId = api_db_has_column($pdo, $tableName, 'paypal_id');
    $hasPrice = api_db_has_column($pdo, $tableName, 'price');
    $hasPriceCents = api_db_has_column($pdo, $tableName, 'price_cents');

    // Lookup existing stamp by composite key (country, scott, count).
    if ($_SERVER['REQUEST_METHOD'] === 'GET' && $lookup['country'] !== '' && $lookup['scott'] !== '' && $lookup['count'] !== '') {
        $lookupCount = normalize_count_3($lookup['count']);
        $lookup['count'] = $lookupCount;

        $table = '`' . $tableName . '`';
        $stmt = $pdo->prepare(
            'SELECT * FROM ' . $table . ' WHERE country = :country AND scott = :scott AND `count` = :count'
        );
        $stmt->execute([
            ':country' => $lookup['country'],
            ':scott' => $lookup['scott'],
            ':count' => $lookup['count'],
        ]);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (count($rows) === 0) {
            $error = 'No stamp found for that Country + Scott # + Count.';
        } elseif (count($rows) > 1) {
            $error = 'Multiple stamps match that Country + Scott # + Count. Add a UNIQUE index to enforce one row per key.';
        } else {
            $r = $rows[0];
            $values['country'] = (string)($r['country'] ?? '');
            $values['scott'] = (string)($r['scott'] ?? '');
            $values['count'] = (string)($r['count'] ?? '001');
            $values['condition'] = (string)($r['condition'] ?? '');
            $values['hinged'] = (string)($r['hinged'] ?? '');
            $values['gum'] = (string)($r['gum'] ?? '');
            $values['grade'] = (string)($r['grade'] ?? '');
            $values['description'] = (string)($r['description'] ?? '');
            $values['location'] = (string)($r['location'] ?? '');

            if ($hasPrice) {
                $values['price'] = isset($r['price']) ? (string)$r['price'] : '';
            } elseif ($hasPriceCents) {
                $pc = isset($r['price_cents']) ? (int)$r['price_cents'] : 0;
                $values['price'] = number_format($pc / 100.0, 2, '.', '');
            }

            if ($hasPaypalId) {
                $values['paypal_id'] = (string)($r['paypal_id'] ?? '');
            }

            $mode = 'update';
            $loaded = true;
        }
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        foreach ($values as $k => $v) {
            if ($k === 'description') {
                $values[$k] = isset($_POST[$k]) ? (string)$_POST[$k] : '';
            } else {
                $values[$k] = isset($_POST[$k]) ? trim((string)$_POST[$k]) : '';
            }
        }

        $action = isset($_POST['action']) ? trim((string)$_POST['action']) : '';

        $mode = isset($_POST['mode']) ? trim((string)$_POST['mode']) : 'create';
        if ($mode !== 'create' && $mode !== 'update') $mode = 'create';

        if ($action === 'delete') {
            $origCountry = isset($_POST['orig_country']) ? trim((string)$_POST['orig_country']) : '';
            $origScott = isset($_POST['orig_scott']) ? trim((string)$_POST['orig_scott']) : '';
            $origCountRaw = isset($_POST['orig_count']) ? trim((string)$_POST['orig_count']) : '';
            $origCount = normalize_count_3($origCountRaw);

            if ($origCountry === '' || $origScott === '' || $origCount === '') {
                throw new RuntimeException('Missing original key values for delete. Use the lookup form to load a stamp before deleting.');
            }

            $table = '`' . $tableName . '`';
            $stmt = $pdo->prepare('DELETE FROM ' . $table . ' WHERE country = :country AND scott = :scott AND `count` = :count');
            $stmt->execute([
                ':country' => $origCountry,
                ':scott' => $origScott,
                ':count' => $origCount,
            ]);
            $deletedCount = $stmt->rowCount();

            // Reset after submission (PRG pattern).
            header('Location: stamp-entry.php?deleted=' . (int)$deletedCount);
            exit;
        } else {
            $country = $values['country'];
            $scott = $values['scott'];
            $count = normalize_count_3($values['count']);
            $condition = $values['condition'];
            $hinged = $values['hinged'];
            $gum = $values['gum'];
            $grade = $values['grade'];
            $description = $values['description'];
            $location = $values['location'];

            if ($country === '') throw new RuntimeException('Country is required.');
            if ($scott === '') throw new RuntimeException('Scott # is required.');
            if ($condition === '') throw new RuntimeException('Condition is required.');
            if ($hinged === '') throw new RuntimeException('Hinged is required.');
            if ($gum === '') throw new RuntimeException('Gum is required.');
            if ($grade === '') throw new RuntimeException('Grade is required.');
            if (trim($description) === '') throw new RuntimeException('Description is required.');
            if ($location === '') throw new RuntimeException('Location is required.');

            $priceDecimal = normalize_price($values['price']);

            $cols = [
                'country' => $country,
                'scott' => $scott,
                'count' => $count,
                'condition' => $condition,
                'hinged' => $hinged,
                'gum' => $gum,
                'grade' => $grade,
                'description' => $description,
                'location' => $location,
            ];

            if ($hasPrice) {
                $cols['price'] = $priceDecimal;
            } elseif ($hasPriceCents) {
                $cols['price_cents'] = (string)(int)round(((float)$priceDecimal) * 100);
            } else {
                throw new RuntimeException('Database table must include either a `price` or `price_cents` column.');
            }

            if ($hasPaypalId) {
                // Only require/pay attention to paypal_id if the table has it.
                $paypalId = trim($values['paypal_id']);
                if ($paypalId === '') {
                    throw new RuntimeException('This database requires `paypal_id` but none was provided.');
                }
                $cols['paypal_id'] = $paypalId;
            }

            $table = '`' . $tableName . '`';

            if ($mode === 'update') {
                $origCountry = isset($_POST['orig_country']) ? trim((string)$_POST['orig_country']) : '';
                $origScott = isset($_POST['orig_scott']) ? trim((string)$_POST['orig_scott']) : '';
                $origCountRaw = isset($_POST['orig_count']) ? trim((string)$_POST['orig_count']) : '';
                $origCount = normalize_count_3($origCountRaw);

                if ($origCountry === '' || $origScott === '' || $origCount === '') {
                    throw new RuntimeException('Missing original key values for update. Use the lookup form to load a stamp before editing.');
                }

                $setSql = implode(', ', array_map(fn($c) => '`' . $c . '` = :' . $c, array_keys($cols)));
                $sql = 'UPDATE ' . $table . ' SET ' . $setSql . ' WHERE country = :orig_country AND scott = :orig_scott AND `count` = :orig_count';
                $stmt = $pdo->prepare($sql);
                foreach ($cols as $k => $v) {
                    $stmt->bindValue(':' . $k, $v);
                }
                $stmt->bindValue(':orig_country', $origCountry);
                $stmt->bindValue(':orig_scott', $origScott);
                $stmt->bindValue(':orig_count', $origCount);
                $stmt->execute();

                $updatedCount = $stmt->rowCount();

                // Reset after submission (PRG pattern).
                header('Location: stamp-entry.php?updated=' . (int)$updatedCount);
                exit;
            } else {
                $colNames = array_keys($cols);
                $sqlCols = implode(', ', array_map(fn($c) => '`' . $c . '`', $colNames));
                $sqlVals = implode(', ', array_map(fn($c) => ':' . $c, $colNames));

                $sql = 'INSERT INTO ' . $table . ' (' . $sqlCols . ') VALUES (' . $sqlVals . ')';
                $stmt = $pdo->prepare($sql);
                foreach ($cols as $k => $v) {
                    $stmt->bindValue(':' . $k, $v);
                }
                $stmt->execute();

                $insertedId = (int)$pdo->lastInsertId();

                // Reset after submission (PRG pattern).
                header('Location: stamp-entry.php?saved=' . (int)$insertedId);
                exit;
            }
        }
    }
} catch (Throwable $e) {
    $error = $e->getMessage();
    if (stripos($error, 'stamps_mariadb') !== false && stripos($error, "doesn't exist") !== false) {
        $error .= ' (Hint: your schema creates table `stamps`. Update STAMPS_DB_TABLE to `stamps` in .env.local or api/db.local.php.)';
    }
}
?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Stamp Entry</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="icon" href="favicon.png" type="image/png">
    <link rel="stylesheet" href="css/style.css" type="text/css">
</head>
<body>
    <a class="skip-link" href="#maincontent">Skip to main content</a>
    <div id="outerdiv">
        <header id="headerdiv" class="headercolor">
            <a href="index.php" aria-label="Home">
                <img src="picts/logo.png" class="logo-respond" alt="Jamison Stamps &amp; Books">
            </a>
        </header>

        <div class="pageheight">
            <div id="wrapper" class="pagewidth">
                <div id="contentdiv">
                    <main id="maincontent" tabindex="-1" aria-labelledby="page-title">
                        <div class="content-pad just">
                            <h1 id="page-title" class="title">Stamp Entry</h1>

                            <?php if ($flashSavedId !== null && $flashSavedId > 0): ?>
                                <p><strong>Saved.</strong> New stamp id: <?php echo h((string)$flashSavedId); ?></p>
                            <?php endif; ?>

                            <?php if ($flashUpdated !== null): ?>
                                <p><strong>Updated.</strong> Rows changed: <?php echo h((string)$flashUpdated); ?></p>
                            <?php endif; ?>

                            <?php if ($flashDeleted !== null): ?>
                                <p><strong>Deleted.</strong> Rows removed: <?php echo h((string)$flashDeleted); ?></p>
                            <?php endif; ?>

                            <?php if ($error !== ''): ?>
                                <p><strong>Error:</strong> <?php echo h($error); ?></p>
                            <?php endif; ?>

                            <h2>Load for edit</h2>
                            <form method="get" action="stamp-entry.php" style="max-width: 720px;">
                                <p>
                                    <label>Country<br>
                                        <select name="country" required style="width: 100%;">
                                            <option value="United States" <?php echo ($lookup['country'] === 'United States' ? 'selected' : ''); ?>>United States</option>
                                        </select>
                                    </label>
                                </p>
                                <p>
                                    <label>Scott #<br>
                                        <input type="text" name="scott" required value="<?php echo h($lookup['scott']); ?>" style="width: 100%;">
                                    </label>
                                </p>
                                <p>
                                    <label>Count (3 digits)<br>
                                        <input type="text" name="count" required value="<?php echo h($lookup['count']); ?>" style="width: 100%;">
                                    </label>
                                </p>
                                <p>
                                    <button type="submit">Load stamp</button>
                                </p>
                            </form>

                            <h2><?php echo $mode === 'update' ? 'Edit stamp' : 'Create new stamp'; ?></h2>

                            <form method="post" action="stamp-entry.php" style="max-width: 720px;">
                                <input type="hidden" name="mode" value="<?php echo h($mode); ?>">
                                <?php if ($mode === 'update'): ?>
                                    <input type="hidden" name="orig_country" value="<?php echo h($lookup['country'] !== '' ? $lookup['country'] : $values['country']); ?>">
                                    <input type="hidden" name="orig_scott" value="<?php echo h($lookup['scott'] !== '' ? $lookup['scott'] : $values['scott']); ?>">
                                    <input type="hidden" name="orig_count" value="<?php echo h($lookup['count'] !== '' ? $lookup['count'] : $values['count']); ?>">
                                <?php endif; ?>

                                <p>
                                    <label>Country<br>
                                        <select name="country" required style="width: 100%;">
                                            <option value="United States" <?php echo ($values['country'] === 'United States' ? 'selected' : ''); ?>>United States</option>
                                        </select>
                                    </label>
                                </p>

                                <p>
                                    <label>Scott #<br>
                                        <input type="text" name="scott" required value="<?php echo h($values['scott']); ?>" style="width: 100%;">
                                    </label>
                                </p>

                                <p>
                                    <label>Count (3 digits)<br>
                                        <input type="text" name="count" required value="<?php echo h($values['count']); ?>" style="width: 100%;">
                                    </label>
                                </p>

                                <p>
                                    <label>Condition<br>
                                        <select name="condition" required style="width: 100%;">
                                            <option value="" <?php echo ($values['condition'] === '' ? 'selected' : ''); ?> disabled>Select…</option>
                                            <option value="Mint" <?php echo ($values['condition'] === 'Mint' ? 'selected' : ''); ?>>Mint</option>
                                            <option value="Unused" <?php echo ($values['condition'] === 'Unused' ? 'selected' : ''); ?>>Unused</option>
                                            <option value="Used" <?php echo ($values['condition'] === 'Used' ? 'selected' : ''); ?>>Used</option>
                                        </select>
                                    </label>
                                </p>

                                <p>
                                    <label>Hinged<br>
                                        <select name="hinged" required style="width: 100%;">
                                            <option value="" <?php echo ($values['hinged'] === '' ? 'selected' : ''); ?> disabled>Select…</option>
                                            <option value="Hinged" <?php echo ($values['hinged'] === 'Hinged' ? 'selected' : ''); ?>>Hinged</option>
                                            <option value="Never Hinged" <?php echo ($values['hinged'] === 'Never Hinged' ? 'selected' : ''); ?>>Never Hinged</option>
                                        </select>
                                    </label>
                                </p>

                                <p>
                                    <label>Gum<br>
                                        <select name="gum" required style="width: 100%;">
                                            <option value="" <?php echo ($values['gum'] === '' ? 'selected' : ''); ?> disabled>Select…</option>
                                            <option value="OG - Original Gum" <?php echo ($values['gum'] === 'OG - Original Gum' ? 'selected' : ''); ?>>OG - Original Gum</option>
                                            <option value="PG - Partial Gum" <?php echo ($values['gum'] === 'PG - Partial Gum' ? 'selected' : ''); ?>>PG - Partial Gum</option>
                                            <option value="NG - No Gum" <?php echo ($values['gum'] === 'NG - No Gum' ? 'selected' : ''); ?>>NG - No Gum</option>
                                            <option value="NGAI - No Gum As Issued" <?php echo ($values['gum'] === 'NGAI - No Gum As Issued' ? 'selected' : ''); ?>>NGAI - No Gum As Issued</option>
                                        </select>
                                    </label>
                                </p>

                                <p>
                                    <label>Grade<br>
                                        <select name="grade" required style="width: 100%;">
                                            <option value="" <?php echo ($values['grade'] === '' ? 'selected' : ''); ?> disabled>Select…</option>
                                            <option value="Gem" <?php echo ($values['grade'] === 'Gem' ? 'selected' : ''); ?>>Gem</option>
                                            <option value="Superb" <?php echo ($values['grade'] === 'Superb' ? 'selected' : ''); ?>>Superb</option>
                                            <option value="Extra Fine/Superb" <?php echo ($values['grade'] === 'Extra Fine/Superb' ? 'selected' : ''); ?>>Extra Fine/Superb</option>
                                            <option value="Extra Fine" <?php echo ($values['grade'] === 'Extra Fine' ? 'selected' : ''); ?>>Extra Fine</option>
                                            <option value="Very Fine/Extra Fine" <?php echo ($values['grade'] === 'Very Fine/Extra Fine' ? 'selected' : ''); ?>>Very Fine/Extra Fine</option>
                                            <option value="Very Fine" <?php echo ($values['grade'] === 'Very Fine' ? 'selected' : ''); ?>>Very Fine</option>
                                            <option value="Fine/Very Fine" <?php echo ($values['grade'] === 'Fine/Very Fine' ? 'selected' : ''); ?>>Fine/Very Fine</option>
                                            <option value="Fine" <?php echo ($values['grade'] === 'Fine' ? 'selected' : ''); ?>>Fine</option>
                                            <option value="Very Good/Fine" <?php echo ($values['grade'] === 'Very Good/Fine' ? 'selected' : ''); ?>>Very Good/Fine</option>
                                            <option value="Very Good" <?php echo ($values['grade'] === 'Very Good' ? 'selected' : ''); ?>>Very Good</option>
                                            <option value="Good/Very Good" <?php echo ($values['grade'] === 'Good/Very Good' ? 'selected' : ''); ?>>Good/Very Good</option>
                                            <option value="Good" <?php echo ($values['grade'] === 'Good' ? 'selected' : ''); ?>>Good</option>
                                            <option value="Fair/Good" <?php echo ($values['grade'] === 'Fair/Good' ? 'selected' : ''); ?>>Fair/Good</option>
                                            <option value="Fair" <?php echo ($values['grade'] === 'Fair' ? 'selected' : ''); ?>>Fair</option>
                                            <option value="Poor" <?php echo ($values['grade'] === 'Poor' ? 'selected' : ''); ?>>Poor</option>
                                            <option value="Damaged" <?php echo ($values['grade'] === 'Damaged' ? 'selected' : ''); ?>>Damaged</option>
                                        </select>
                                    </label>
                                </p>

                                <p>
                                    <label>Description<br>
                                        <textarea name="description" required rows="8" style="width: 100%;"><?php echo h($values['description']); ?></textarea>
                                    </label>
                                </p>

                                <p>
                                    <label>Price (dollars, e.g. 0.47)<br>
                                        <input type="number" name="price" required step="0.01" min="0" value="<?php echo h($values['price']); ?>" style="width: 100%;">
                                    </label>
                                </p>

                                <p>
                                    <label>Location<br>
                                        <input type="text" name="location" required value="<?php echo h($values['location']); ?>" style="width: 100%;">
                                    </label>
                                </p>

                                <?php if (isset($hasPaypalId) && $hasPaypalId): ?>
                                    <p>
                                        <label>PayPal ID (required by this DB)<br>
                                            <input type="text" name="paypal_id" required value="<?php echo h($values['paypal_id']); ?>" style="width: 100%;">
                                        </label>
                                    </p>
                                <?php endif; ?>

                                <p>
                                    <button type="submit"><?php echo $mode === 'update' ? 'Update Stamp' : 'Save Stamp'; ?></button>
                                    <?php if ($mode === 'update'): ?>
                                        <button type="submit" name="action" value="delete" onclick="return confirm('Delete this stamp? This cannot be undone.');" style="margin-left: 12px; background-color: var(--postal-red); color: #ffffff; border: 1px solid rgba(255, 255, 255, 0.14);">Delete</button>
                                    <?php endif; ?>
                                    <button type="button" onclick="window.location.href='stamp-entry.php'" style="margin-left: 12px;">Reset</button>
                                    <a href="stamps.php" style="margin-left: 12px;">Go to inventory</a>
                                </p>
                            </form>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
