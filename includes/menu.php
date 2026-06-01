<?php
// Shared primary navigation.
// Highlights the current page using aria-current.

$current = basename((string)($_SERVER['SCRIPT_NAME'] ?? ''));
$items = [
    'index.php' => 'Home',
    'about.php' => 'About',
    'stamps.php' => 'Stamps',
    'resources.php' => 'Resources',
    'site_map.php' => 'Site Map',
    'contact.php' => 'Contact',
];
?>
<nav id="menudiv" class="menudiv td-left printhide" aria-label="Primary navigation">
    <button type="button" id="mobile-menu-icon" class="menu-toggle" onclick="javascript:toggleMenu('menusub', this);" aria-controls="menusub" aria-expanded="false" aria-label="Open menu">
        <img src="picts/mobile-menu-icon-white.png" width="100" height="29" class="menu-icon-img" alt="">
    </button>
    <div id="menusub" class="menusub">
        <?php foreach ($items as $href => $label): ?>
            <a href="<?php echo htmlspecialchars($href, ENT_QUOTES, 'UTF-8'); ?>"<?php echo ($current === $href) ? ' aria-current="page"' : ''; ?>><?php echo htmlspecialchars($label, ENT_QUOTES, 'UTF-8'); ?></a>
        <?php endforeach; ?>
    </div>
</nav>
