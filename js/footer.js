// FOOTER

var basePath = (function() {
    var p = (window.location && window.location.pathname) ? window.location.pathname : "";
    if (p.indexOf('/stamps/') !== -1) return '../';
    if (p.indexOf('/extras/') !== -1) return '../';
    return '';
})();

document.write('<footer id="footerdiv">');

document.write('&copy; Copyright 2025 <a href="' + basePath + 'index.html" class="footerlink">Jamison Enterprises Stamps &amp; Books</a> ');

// document.write('// Site Design &copy; <a href="https://allwebcodesign.com" rel="nofollow" class="footerlink">Allwebco Design</a><br> ');

document.write('</footer>');




// NEXT LINE IS SCROLL TO TOP ARROW

document.write('<a href="#" class="scrollToTop" aria-label="Scroll to top"></a>');