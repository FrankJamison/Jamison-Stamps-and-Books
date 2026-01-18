// Begin

// NOTE: If you use a ' add a slash before it like this \'

var basePath = (function() {
    var p = (window.location && window.location.pathname) ? window.location.pathname : "";
    if (p.indexOf('/stamps/') !== -1) return '../';
    if (p.indexOf('/extras/') !== -1) return '../';
    return '';
})();


document.write('<div class="sidebar-topics">');
document.write('<table class="sidebar-text"><tr><td class="sidebarL td-left td-top">');

document.write('<img src="' + basePath + 'picts/sidebar-2.jpg" width="50" height="60" class="side-borders" alt="">');
document.write('</td><td class="sidebarR td-left td-top">');

document.write('<span class="smalltitle">');

document.write('United States Collection<br>');

document.write('</span>');

document.write('1870 - 2001<br><a href="' + basePath + 'stamps/USA.htm" target="_top">View Stamps</a><br>');

document.write('</td></tr></table>');
document.write('</div>');






/* document.write('<div class="sidebar-topics">');
document.write('<table class="sidebar-text"><tr><td class="sidebarL td-left td-top">');

document.write('<img src="picts/sidebar-3.jpg" width="50" height="60" class="side-borders" alt="image">');
document.write('</td><td class="sidebarR td-left td-top">');

document.write('<span class="smalltitle">');

document.write('Global Title<br>');

document.write('</span>');

document.write('This text is in the global sidebar and shows on all pages. <a href="stamps.htm" target="_top">View stamps</a><br>');

document.write('</td></tr></table>');
document.write('</div>'); */