<footer id="footerdiv">
    &copy; Copyright <span data-year-start="2025" class="js-year-range">2025</span>
    <a href="index.php" class="footerlink">Jamison Stamps &amp; Books</a>
</footer>

<script>
    (function() {
        var nodes = document.querySelectorAll('.js-year-range[data-year-start]');
        for (var i = 0; i < nodes.length; i++) {
            var start = parseInt(nodes[i].getAttribute('data-year-start'), 10);
            if (!start) continue;
            var current = new Date().getFullYear();
            nodes[i].textContent = (current > start) ? (start + '-' + current) : String(start);
        }
    })();
</script>

<a href="#top" class="scrollToTop" aria-label="Scroll to top"></a>
