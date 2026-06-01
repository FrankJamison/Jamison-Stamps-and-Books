<!doctype html>
<html lang="en">

<head>
    <meta charset="UTF-8">

    <title>U.S. Stamp Collection</title>
    <meta name="description" content="Shop a wide selection of authentic U.S. stamps at Jamison Stamps &amp; Books. From classic 19th-century issues to modern rarities, every stamp is expertly graded and carefully preserved.">
    <meta name="keywords" content="U.S. stamps, rare U.S. stamps, vintage U.S. stamps, American stamps, stamp collecting, philately, commemorative stamps, definitive stamps, graded stamps, buy U.S. stamps, Jamison Stamps &amp; Books">

    <meta property="og:site_name" content="Jamison Stamps &amp; Books">
    <meta property="og:title" content="United States Stamp Collection">
    <meta property="og:description" content="Shop authentic U.S. stamps—expertly graded and carefully preserved.">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://jamisonstamps.com/stamps.php">
    <meta property="og:image" content="https://jamisonstamps.com/picts/USA.jpg">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="United States Stamp Collection">
    <meta name="twitter:description" content="Shop authentic U.S. stamps—expertly graded and carefully preserved.">
    <meta name="twitter:image" content="https://jamisonstamps.com/picts/USA.jpg">

    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="canonical" href="https://jamisonstamps.com/stamps.php">

    <link rel="icon" href="favicon.png" type="image/png">

    <link rel="stylesheet" href="css/style.css" type="text/css">
    <link rel="stylesheet" href="css/stamps.css" type="text/css">

    <script type="text/javascript" src="js/javascripts.js"></script>

    <!-- Local cart + PayPal checkout handled by js/stamps.js + checkout.php -->
</head>

<body id="top">

    <a class="skip-link" href="#maincontent">Skip to main content</a>

    <div id="outerdiv">

        <?php include __DIR__ . '/includes/header.php'; ?>

        <?php include __DIR__ . '/includes/menu.php'; ?>

        <div class="pageheight">
            <div id="wrapper" class="pagewidth">

                <figure class="image-bar">
                    <img src="picts/USA.png" class="main-image" alt="United States stamp collection">
                </figure>

                <div id="contentdiv">

                    <main id="maincontent" tabindex="-1" aria-labelledby="page-title">
                        <div class="content-pad just">

                            <h1 id="page-title" class="title sr-only">United States Stamp Collection</h1>

                            <form class="controls" role="search" aria-label="Filter and sort stamps" onsubmit="return false;">
                                <div>
                                    <label class="sr-only" for="countryFilter">Country</label>
                                    <select id="countryFilter">
                                        <option value="">Filter by Country</option>
                                    </select>
                                </div>

                                <div>
                                    <label class="sr-only" for="conditionFilter">Condition</label>
                                    <select id="conditionFilter">
                                        <option value="">Filter by Condition</option>
                                    </select>
                                </div>

                                <div>
                                    <label class="sr-only" for="hingedFilter">Hinging</label>
                                    <select id="hingedFilter">
                                        <option value="">Filter by Hinging</option>
                                    </select>
                                </div>

                                <div>
                                    <label class="sr-only" for="gumFilter">Gum condition</label>
                                    <select id="gumFilter">
                                        <option value="">Filter by Gum Condition</option>
                                    </select>
                                </div>

                                <div>
                                    <label class="sr-only" for="gradeFilter">Grade</label>
                                    <select id="gradeFilter">
                                        <option value="">Filter by Grade</option>
                                    </select>
                                </div>

                                <div>
                                    <label class="sr-only" for="sortOptions">Sort</label>
                                    <select id="sortOptions">
                                        <option value="">Sort by</option>
                                        <option value="scott-asc">Scott # (Low → High)</option>
                                        <option value="scott-desc">Scott # (High → Low)</option>
                                        <option value="price-asc">Price (Low → High)</option>
                                        <option value="price-desc">Price (High → Low)</option>
                                    </select>
                                </div>

                                <div>
                                    <label class="sr-only" for="searchBox">Search by Scott number</label>
                                    <input type="search" id="searchBox" placeholder="Search by Scott number (Scott #)" autocomplete="off">
                                </div>

                                <button type="submit" class="sr-only">Apply filters</button>
                            </form>

                            <div class="page-splits" aria-hidden="true"></div>

                            <h2 id="results-title" class="sr-only">Stamp results</h2>
                            <article class="content" aria-live="polite" aria-labelledby="results-title"></article>

                            <div class="page-splits" aria-hidden="true"></div>
                        </div>
                    </main>

                    <?php include __DIR__ . '/includes/sidebar-stamps.php'; ?>

                    <div class="divclear" aria-hidden="true"></div>

                </div>

            </div>
        </div>

        <?php include __DIR__ . '/includes/footer.php'; ?>

    </div>

    <script src="js/stamps.js"></script>

</body>

</html>
