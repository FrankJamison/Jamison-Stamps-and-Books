// Begin

// NOTE: If you use a ' add a slash before it like this \'



var menuside = "left" // MENU SIDE | left | right | center |



document.write('<div id="menudiv" class="td-' + menuside + ' printhide">');
document.write('<div id="mobile-menu-icon" onclick="javascript:toggleMenu(\'menusub\');">');

// MOBILE 3 BAR MENU

document.write('<img src="../picts/mobile-menu-icon-white.png" width="100" height="29" class="menu-icon-img" alt="Open Menu">');

document.write('</div>');
document.write('<div id="menusub">');


// START MENU LINKS - COPY ANY LINE TO ADD A NEW LINK


document.write('<a href="../index.html">Home</a>');


document.write('<a href="../about.htm">About</a>');


document.write('<a href="USA.htm">Stamps</a>');


/* document.write('<a href="stamps-CART.htm">Purchase</a>'); */


/* document.write('<a href="../testimonials.htm">Testimonials</a>'); */


document.write('<a href="../resources.htm">Resources</a>');


document.write('<a href="../site_map.htm">Site Map</a>');


document.write('<a href="../contact.htm">Contact</a>');


// END MENU LINKS


document.write('</div>');
document.write('</div>');