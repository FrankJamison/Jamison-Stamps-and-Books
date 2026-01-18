// Begin

// NOTE: If you use a ' add a slash before it like this \'



var menuside = "left" // MENU SIDE | left | right | center |

var basePath = (function() {
    var p = (window.location && window.location.pathname) ? window.location.pathname : "";
    if (p.indexOf('/stamps/') !== -1) return '../';
    if (p.indexOf('/extras/') !== -1) return '../';
    return '';
})();



document.write('<nav id="menudiv" class="td-' + menuside + ' printhide" aria-label="Primary">');
document.write('<button type="button" id="mobile-menu-icon" onclick="javascript:toggleMenu(\'menusub\', this);" aria-controls="menusub" aria-expanded="false" aria-label="Open menu">');

// MOBILE 3 BAR MENU

document.write('<img src="' + basePath + 'picts/mobile-menu-icon-white.png" width="100" height="29" class="menu-icon-img" alt="">');

document.write('</button>');
document.write('<div id="menusub">');


// START MENU LINKS - COPY ANY LINE TO ADD A NEW LINK


document.write('<a href="' + basePath + 'index.html">Home</a>');


document.write('<a href="' + basePath + 'about.htm">About</a>');


document.write('<a href="' + basePath + 'stamps/USA.htm">Stamps</a>');


/* document.write('<a href="stamps-CART.htm">Purchase</a>'); */


/* document.write('<a href="testimonials.htm">Testimonials</a>'); */


document.write('<a href="' + basePath + 'resources.htm">Resources</a>');


document.write('<a href="' + basePath + 'site_map.htm">Site Map</a>');


document.write('<a href="' + basePath + 'contact.htm">Contact</a>');


// END MENU LINKS


document.write('</div>');
document.write('</nav>');