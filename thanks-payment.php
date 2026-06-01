<!doctype html>
<html lang="en">

<head>
    <meta charset="UTF-8">

    <meta name="robots" content="noindex, nofollow">

    <title>Transaction Complete</title>
    <meta name="description" content="Thank you for your purchase from Jamison Stamps &amp; Books. Your order has been received.">

    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="canonical" href="https://jamisonstamps.com/thanks-payment.php">

    <link rel="icon" href="./favicon.png" type="image/png">

    <link rel="stylesheet" href="./css/style.css" type="text/css">

    <script type="text/javascript" src="./js/javascripts.js"></script>

</head>

<body id="top">

    <a class="skip-link" href="#maincontent">Skip to main content</a>

    <div id="outerdiv">

        <?php include __DIR__ . '/includes/header.php'; ?>

        <?php include __DIR__ . '/includes/menu.php'; ?>

        <div class="pageheight">
            <div id="wrapper" class="pagewidth">

                <figure class="image-bar">
                    <img src="./picts/thank-you-contact.png" class="main-image" alt="Thank you for your purchase">
                </figure>

                <div id="contentdiv-nosidebar">

                    <main id="maincontent" tabindex="-1" aria-labelledby="page-title">
                        <article class="content-pad td-center">
                            <header>
                                <h1 id="page-title" class="title">Thank you for choosing Jamison Stamps &amp; Books!</h1>
                            </header>

                            <p>Your order has been received and is now being prepared with the same care we give to every collector's treasure. You'll receive a confirmation email shortly.</p>

                            <nav aria-label="Quick links">
                                <a href="index.php">Home</a>
                            </nav>
                        </article>
                    </main>

                </div>

            </div>
        </div>

        <?php include __DIR__ . '/includes/footer.php'; ?>

    </div>

    <script>
        (function() {
            try {
                localStorage.removeItem('jsb_local_cart_v1');
            } catch (e) {
                // ignore
            }
        })();
    </script>

</body>

</html>