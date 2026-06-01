<?php
declare(strict_types=1);

require_once __DIR__ . '/api/db.php';

function h(string $s): string {
    return htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function base_url(): string {
    $https = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off';
    $proto = $https ? 'https' : 'http';
    $host = isset($_SERVER['HTTP_HOST']) ? (string)$_SERVER['HTTP_HOST'] : 'localhost';

    // checkout.php lives at the site root in this repo.
    return $proto . '://' . $host . '/';
}

function parse_cart_from_post(): array {
    if (!isset($_POST['cart'])) return [];
    $raw = trim((string)$_POST['cart']);
    if ($raw === '') return [];

    $data = json_decode($raw, true);
    if (!is_array($data) || !isset($data['items']) || !is_array($data['items'])) return [];

    $out = [];
    foreach ($data['items'] as $it) {
        if (!is_array($it)) continue;
        $id = isset($it['id']) ? (int)$it['id'] : 0;
        $qty = isset($it['qty']) ? (int)$it['qty'] : 1;
        if ($id <= 0) continue;
        if ($qty < 1) $qty = 1;
        if ($qty > 1) $qty = 1; // each stamp is treated as a single unique item
        $out[] = ['id' => $id, 'qty' => $qty];
        if (count($out) >= 50) break;
    }

    // De-dupe ids while preserving order.
    $seen = [];
    $deduped = [];
    foreach ($out as $it) {
        $id = $it['id'];
        if (isset($seen[$id])) continue;
        $seen[$id] = true;
        $deduped[] = $it;
    }

    return $deduped;
}

function parse_ship_region_from_post(): string {
    // 'us' or 'intl'
    $raw = isset($_POST['ship_region']) ? strtolower(trim((string)$_POST['ship_region'])) : '';
    if ($raw === 'intl' || $raw === 'international') return 'intl';
    if ($raw === 'us' || $raw === 'usa' || $raw === 'united-states') return 'us';
    return '';
}

function compute_shipping_total(string $region, int $itemCount): float {
    if ($itemCount <= 0) return 0.0;
    $additional = max(0, $itemCount - 1);
    if ($region === 'intl') {
        return 6.00 + (0.25 * $additional);
    }
    // Default: US
    return 2.00 + (0.25 * $additional);
}

$merchant = 'BSB86CSLZFYL2';
$currency = 'USD';

$base = base_url();
$returnUrl = $base . 'thanks-payment.php';
$cancelUrl = $base . 'stamps.php';
$notifyUrl = $base . 'api/paypal-ipn.php';

// Prefer sending the buyer back to the page they came from (same-host only).
if (isset($_SERVER['HTTP_REFERER'])) {
    $ref = trim((string)$_SERVER['HTTP_REFERER']);
    if ($ref !== '') {
        $host = isset($_SERVER['HTTP_HOST']) ? (string)$_SERVER['HTTP_HOST'] : '';
        $refHost = (string)parse_url($ref, PHP_URL_HOST);
        if ($host !== '' && $refHost !== '' && strcasecmp($host, $refHost) === 0) {
            $cancelUrl = $ref;
        }
    }
}

$cart = parse_cart_from_post();
$shipRegion = parse_ship_region_from_post();

if (!$cart) {
    http_response_code(400);
    ?>
    <!doctype html>
    <html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Checkout</title>
    </head>

    <body>
        <a class="skip-link" href="#maincontent">Skip to main content</a>
        <main id="maincontent" tabindex="-1" aria-labelledby="page-title">
            <h1 id="page-title">Checkout</h1>
            <p>Your cart is empty.</p>
            <p><a href="<?php echo h($cancelUrl); ?>">Back to stamps</a></p>
        </main>
    </body>

    </html>
    <?php
    exit;
}

// If shipping region wasn't chosen yet, show a simple selection step.
if ($shipRegion === '') {
    ?>
    <!doctype html>
    <html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Shipping</title>
    </head>

    <body>
        <a class="skip-link" href="#maincontent">Skip to main content</a>
        <main id="maincontent" tabindex="-1" aria-labelledby="page-title">
            <h1 id="page-title">Shipping</h1>
            <p>Choose your shipping region:</p>

            <form method="post" action="checkout.php">
                <input type="hidden" name="cart" value="<?php echo h((string)($_POST['cart'] ?? '')); ?>">

                <p>
                    <label>
                        <input type="radio" name="ship_region" value="us" checked>
                        U.S. shipping: $2.00 first item, $0.25 each additional
                    </label>
                </p>
                <p>
                    <label>
                        <input type="radio" name="ship_region" value="intl">
                        International shipping: $6.00 first item, $0.25 each additional
                    </label>
                </p>

                <p>
                    <button type="submit">Continue to PayPal</button>
                    <a href="<?php echo h($cancelUrl); ?>" style="margin-left:12px;">Cancel</a>
                </p>
            </form>
        </main>
    </body>

    </html>
    <?php
    exit;
}

try {
    $pdo = api_pdo();
    $tableName = api_db_table();
    $table = '`' . $tableName . '`';

    $hasPrice = api_db_has_column($pdo, $tableName, 'price');
    $hasPriceCents = api_db_has_column($pdo, $tableName, 'price_cents');

    if (!$hasPrice && !$hasPriceCents) {
        throw new RuntimeException('Database table must include either a `price` or `price_cents` column.');
    }

    $ids = array_map(fn($it) => (int)$it['id'], $cart);
    $placeholders = implode(',', array_fill(0, count($ids), '?'));

    $priceSel = $hasPrice ? 'price' : 'price_cents';
    $sql =
        'SELECT id, scott, `condition`, hinged, gum, grade, ' . $priceSel . ' AS price_any ' .
        'FROM ' . $table . ' ' .
        'WHERE id IN (' . $placeholders . ')';

    $stmt = $pdo->prepare($sql);
    foreach ($ids as $i => $id) {
        $stmt->bindValue($i + 1, $id, PDO::PARAM_INT);
    }
    $stmt->execute();

    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $byId = [];
    foreach ($rows as $r) {
        $id = (int)($r['id'] ?? 0);
        if ($id <= 0) continue;
        $byId[$id] = $r;
    }

    $lineItems = [];
    foreach ($cart as $it) {
        $id = (int)$it['id'];
        if (!isset($byId[$id])) continue;
        $r = $byId[$id];

        $priceCents = 0;
        if ($hasPrice) {
            $price = isset($r['price_any']) ? (float)$r['price_any'] : 0.0;
            $priceCents = (int)round($price * 100);
        } else {
            $priceCents = (int)($r['price_any'] ?? 0);
        }
        if ($priceCents <= 0) continue;

        $scott = trim((string)($r['scott'] ?? ''));
        $cond = trim((string)($r['condition'] ?? ''));
        $hinged = trim((string)($r['hinged'] ?? ''));
        $gum = trim((string)($r['gum'] ?? ''));
        $grade = trim((string)($r['grade'] ?? ''));

        $nameParts = [];
        if ($scott !== '') $nameParts[] = 'Scott ' . $scott;
        if ($cond !== '') $nameParts[] = $cond;
        if ($hinged !== '') $nameParts[] = $hinged;
        if ($gum !== '') $nameParts[] = $gum;
        if ($grade !== '') $nameParts[] = $grade;
        $itemName = implode(' / ', $nameParts);
        if ($itemName === '') $itemName = 'Stamp #' . $id;

        $lineItems[] = [
            'id' => $id,
            'name' => $itemName,
            'amount' => number_format($priceCents / 100, 2, '.', ''),
            'qty' => 1,
        ];

        if (count($lineItems) >= 50) break;
    }

    if (!$lineItems) {
        http_response_code(400);
        ?>
        <!doctype html>
        <html lang="en">

        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Checkout</title>
        </head>

        <body>
            <a class="skip-link" href="#maincontent">Skip to main content</a>
            <main id="maincontent" tabindex="-1" aria-labelledby="page-title">
                <h1 id="page-title">Checkout</h1>
                <p>No valid items were found for checkout.</p>
                <p><a href="<?php echo h($cancelUrl); ?>">Back to stamps</a></p>
            </main>
        </body>

        </html>
        <?php
        exit;
    }

    // Add shipping as a separate line item (robust across PayPal Standard variations).
    $shipLabel = $shipRegion === 'intl' ? 'Shipping (International)' : 'Shipping (U.S.)';
    $shipTotal = compute_shipping_total($shipRegion, count($lineItems));
    if ($shipTotal > 0) {
        $lineItems[] = [
            'id' => $shipRegion === 'intl' ? 'SHIP-INTL' : 'SHIP-US',
            'name' => $shipLabel,
            'amount' => number_format($shipTotal, 2, '.', ''),
            'qty' => 1,
        ];
    }
} catch (Throwable $e) {
    http_response_code(500);
    ?>
    <!doctype html>
    <html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Checkout</title>
    </head>

    <body>
        <a class="skip-link" href="#maincontent">Skip to main content</a>
        <main id="maincontent" tabindex="-1" aria-labelledby="page-title">
            <h1 id="page-title">Checkout</h1>
            <p>Checkout failed. Please try again.</p>
            <p><?php echo h($e->getMessage()); ?></p>
            <p><a href="<?php echo h($cancelUrl); ?>">Back to stamps</a></p>
        </main>
    </body>

    </html>
    <?php
    exit;
}

?>
<!doctype html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Redirecting to PayPal…</title>
</head>

<body>
    <a class="skip-link" href="#maincontent">Skip to main content</a>
    <main id="maincontent" tabindex="-1" aria-labelledby="page-title">
        <h1 id="page-title">Redirecting to PayPal…</h1>
        <p>Redirecting to PayPal…</p>

        <form id="paypalCheckout" method="post" action="https://www.paypal.com/cgi-bin/webscr">
            <input type="hidden" name="cmd" value="_cart">
            <input type="hidden" name="upload" value="1">
            <input type="hidden" name="business" value="<?php echo h($merchant); ?>">
            <input type="hidden" name="currency_code" value="<?php echo h($currency); ?>">
            <input type="hidden" name="notify_url" value="<?php echo h($notifyUrl); ?>">
            <input type="hidden" name="return" value="<?php echo h($returnUrl); ?>">
            <input type="hidden" name="cancel_return" value="<?php echo h($cancelUrl); ?>">
            <input type="hidden" name="no_note" value="1">
            <input type="hidden" name="lc" value="US">

            <?php foreach ($lineItems as $i => $li):
                $n = $i + 1;
            ?>
                <input type="hidden" name="item_number_<?php echo $n; ?>" value="<?php echo h((string)$li['id']); ?>">
                <input type="hidden" name="item_name_<?php echo $n; ?>" value="<?php echo h((string)$li['name']); ?>">
                <input type="hidden" name="amount_<?php echo $n; ?>" value="<?php echo h((string)$li['amount']); ?>">
                <input type="hidden" name="quantity_<?php echo $n; ?>" value="<?php echo h((string)$li['qty']); ?>">
            <?php endforeach; ?>

            <noscript>
                <button type="submit">Continue to PayPal</button>
            </noscript>
        </form>

        <script>
            (function() {
                var f = document.getElementById('paypalCheckout');
                if (f) f.submit();
            })();
        </script>
    </main>
</body>

</html>
