// HEADER

// USE lowercase FOR ALL OPTIONS



var logo1 = "JamisonStamps" // FIRST LOGO
var logo2 = ".com" // SECOND LOGO
var logotype = "graphic" // LOGO TYPE | graphic | text |
var logolink = "../index.html" // LINK FOR LOGO



// COPYRIGHT 2025 � Allwebco Design Corporation
// Unauthorized use or sale of this script is strictly prohibited by law

// YOU DO NOT NEED TO EDIT BELOW THIS LINE

// LOGO


document.write('<div id="headerdiv" class="headercolor">');

if (logotype == "graphic") {
    document.write('<a href="' + logolink + '"><img src="../picts/logo.png" class="logo-respond"></a>');
}
if (logotype == "text") {
    document.write('<div OnSelectStart=\'return false;\' class="text-logo-box"><a href="' + logolink + '" class="textlogo"><nobr><span class="logo">&nbsp;' + logo1 + '</span><span class="logo2">' + logo2 + '&nbsp;</span></nobr></a></div>');
}

document.write('</div>');