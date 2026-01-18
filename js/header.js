// HEADER

// USE lowercase FOR ALL OPTIONS



var logo1 = "JamisonStamps" // FIRST LOGO
var logo2 = ".com" // SECOND LOGO
var logotype = "graphic" // LOGO TYPE | graphic | text |
var logolink = "index.html" // LINK FOR LOGO

var basePath = (function() {
    var p = (window.location && window.location.pathname) ? window.location.pathname : "";
    if (p.indexOf('/stamps/') !== -1) return '../';
    if (p.indexOf('/extras/') !== -1) return '../';
    return '';
})();



// COPYRIGHT 2025 � Allwebco Design Corporation
// Unauthorized use or sale of this script is strictly prohibited by law

// YOU DO NOT NEED TO EDIT BELOW THIS LINE

// LOGO


document.write('<header id="headerdiv" class="headercolor">');

if (logotype == "graphic") {
    document.write('<a href="' + basePath + logolink + '"><img src="' + basePath + 'picts/logo.png" class="logo-respond" alt="Jamison Stamps &amp; Books"></a>');
}
if (logotype == "text") {
    document.write('<div OnSelectStart=\'return false;\' class="text-logo-box"><a href="' + basePath + logolink + '" class="textlogo"><nobr><span class="logo">&nbsp;' + logo1 + '</span><span class="logo2">' + logo2 + '&nbsp;</span></nobr></a></div>');
}

document.write('</header>');