// Begin TEMPLATE SCRIPTS



var clickaway = "yes" // USE CLICK OFF MENU SCRIPT | yes | no |



// YOU DO NOT NEED TO EDIT BELOW THIS LINE

// COPYRIGHT 2025 � Allwebco Design Corporation
// Unauthorized use or sale of this script is strictly prohibited by law





// START SCROLL TO TOP ARROW SCRIPT

$(document).ready(function() {

    $(window).scroll(function() {
        if ($(this).scrollTop() > 100) {
            $('.scrollToTop').fadeIn();
        } else {
            $('.scrollToTop').fadeOut();
        }
    });

    $('.scrollToTop').click(function() {
        $('html, body').animate({
            scrollTop: 0
        }, 300);
        return false;
    });

});

// END SCROLL TO TOP ARROW SCRIPT





// JQUERY CLICK MENU SCRIPT TOGGLE

function toggleMenu(divId, triggerEl) {
    const $menu = $("#" + divId);
    $menu.toggle("fast", function() {
        if (triggerEl && triggerEl.setAttribute) {
            const expandedNow = $menu.is(":visible");
            triggerEl.setAttribute("aria-expanded", expandedNow ? "true" : "false");
        }
    });
}



// CLOSE MENU IF CLICKED AWAY FROM

if (clickaway == "yes") {

    $(document).click(function(event) {

        if ($(window).width() < 740) {

            if (!$(event.target).closest('#menusub').length) {
                if (!$(event.target).closest('#mobile-menu-icon').length) {
                    if ($('#menusub').is(":visible")) {
                        $('#menusub').hide();
                        const btn = document.getElementById('mobile-menu-icon');
                        if (btn) btn.setAttribute('aria-expanded', 'false');
                    }
                }
            }
        }
    });
}