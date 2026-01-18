// SOCIAL LINKS

// USE lowercase FOR ALL OPTIONS


var facebook = "no" // SHOW FACEBOOK

var facelink = "https://facebook.com/allwebcodesign"

var twitter = "no" // SHOW TWITTER

var twitlink = "https://twitter.com/allwebcodesign"

var linkedin = "no" // SHOW LINKEDIN

var linkedlink = "https://linkedin.com/"

var instagram = "no" // SHOW INSTAGRAM

var instalink = "https://instagram.com/"

var contactus = "no" // SHOW CONTACT ICON

var contactlink = "contact.htm" // CONTACT ICON LINK



var linktype = "_blank" // SOCIAL LINK TYPE USE | _blank | _top |
var linktypec = "_top" // CONTACT LINK TYPE USE | _blank | _top |




// COPYRIGHT 2025 � Allwebco Design Corporation
// Unauthorized use or sale of this script is strictly prohibited by law

// YOU DO NOT NEED TO EDIT BELOW THIS LINE

var basePath = (function() {
    var p = (window.location && window.location.pathname) ? window.location.pathname : "";
    if (p.indexOf('/stamps/') !== -1) return '../';
    if (p.indexOf('/extras/') !== -1) return '../';
    return '';
})();



if ((facebook == "yes") || (twitter == "yes") || (linkedin == "yes") || (instagram == "yes") || (contactus == "yes")) {
    document.write('<div class="soc-box">');
    document.write('<table><tr>');


    // FACEBOOK

    if (facebook == "yes") {

        document.write('<td class="socialspace"><a href="' + facelink + '" target="' + linktype + '"><img src="' + basePath + 'picts/social_facebook.png" class="socialicon" alt="Connect on Facebook"></a></td>');
    }


    // TWITTER

    if (twitter == "yes") {
        document.write('<td class="socialspace"><a href="' + twitlink + '" target="' + linktype + '"><img src="' + basePath + 'picts/social_twitter.png" class="socialicon" alt="Follow us on twitter"></a></td>');
    }


    // LINKEDIN

    if (linkedin == "yes") {
        document.write('<td class="socialspace"><a href="' + linkedlink + '" target="' + linktype + '"><img src="' + basePath + 'picts/social_linkedin.png" class="socialicon" alt="Connect on LinkedIn"></a></td>');
    }


    // INSTAGRAM

    if (instagram == "yes") {
        document.write('<td class="socialspace"><a href="' + instalink + '" target="' + linktype + '"><img src="' + basePath + 'picts/social_instagram.png" class="socialicon" alt="Instagram"></a></td>');
    }

    // CONTACT

    if (contactus == "yes") {
        document.write('<td class="socialspace"><a href="' + contactlink + '" target="' + linktypec + '"><img src="' + basePath + 'picts/social_contact.png" class="socialicon" alt="Contact Us"></a></td>');
    }

    document.write('</tr></table>');
    document.write('</div>');
} else {
    document.write('&nbsp;<br>');
}