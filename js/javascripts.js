// Site behaviors (vanilla JS): scroll-to-top + mobile menu interactions

var clickaway = "yes"; // USE CLICK OFF MENU SCRIPT | yes | no |

function isMobileMenuActive() {
    return window.innerWidth < 740;
}

function closestPolyfill(el, selector) {
    if (!el) return null;
    if (el.closest) return el.closest(selector);

    var node = el;
    while (node && node.nodeType === 1) {
        var matches = node.matches || node.msMatchesSelector || node.webkitMatchesSelector;
        if (matches && matches.call(node, selector)) return node;
        node = node.parentElement;
    }
    return null;
}

function setExpanded(triggerEl, expanded) {
    if (triggerEl && triggerEl.setAttribute) {
        triggerEl.setAttribute("aria-expanded", expanded ? "true" : "false");

        // Keep the button's accessible name in sync with state.
        // Defaults match the markup used across the site.
        var openLabel = triggerEl.getAttribute("data-label-open") || "Open menu";
        var closeLabel = triggerEl.getAttribute("data-label-close") || "Close menu";
        var currentLabel = triggerEl.getAttribute("aria-label") || "";
        if (currentLabel === openLabel || currentLabel === closeLabel) {
            triggerEl.setAttribute("aria-label", expanded ? closeLabel : openLabel);
        }
    }
}

function toggleMenu(divId, triggerEl) {
    var menu = document.getElementById(divId);
    if (!menu) return;

    var open = !menu.classList.contains("is-open");
    if (open) {
        menu.classList.add("is-open");
    } else {
        menu.classList.remove("is-open");
    }
    setExpanded(triggerEl, open);
}

function closeMenuIfOpen(divId, triggerId) {
    var menu = document.getElementById(divId);
    if (!menu) return;
    if (menu.classList.contains("is-open")) {
        menu.classList.remove("is-open");
    }
    var btn = document.getElementById(triggerId);
    if (btn) setExpanded(btn, false);
}

function initScrollToTop() {
    var btn = document.querySelector(".scrollToTop");
    if (!btn) return;

    function setVisible(visible) {
        if (visible) btn.classList.add("is-visible");
        else btn.classList.remove("is-visible");
    }

    var ticking = false;
    var raf = window.requestAnimationFrame || function(cb) {
        return window.setTimeout(cb, 16);
    };

    function onScroll() {
        if (ticking) return;
        ticking = true;
        raf(function() {
            var y = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
            setVisible(y > 100);
            ticking = false;
        });
    }

    window.addEventListener("scroll", onScroll);
    onScroll();

    btn.addEventListener("click", function(e) {
        e.preventDefault();
        try {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        } catch (err) {
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
        }
    });
}

function initMenuCloseBehaviors() {
    if (clickaway !== "yes") return;

    document.addEventListener("click", function(event) {
        if (!isMobileMenuActive()) return;

        var target = event.target;
        var clickedInPrimary = closestPolyfill(target, "#menusub, #mobile-menu-icon");
        var clickedInFooter = closestPolyfill(target, "#menusub-footer, #mobile-menu-icon-footer");

        if (!clickedInPrimary) closeMenuIfOpen("menusub", "mobile-menu-icon");
        if (!clickedInFooter) closeMenuIfOpen("menusub-footer", "mobile-menu-icon-footer");
    });

    document.addEventListener("keydown", function(e) {
        var key = e.key || "";
        var isEscape = key === "Escape" || e.keyCode === 27;
        if (isMobileMenuActive() && isEscape) {
            closeMenuIfOpen("menusub", "mobile-menu-icon");
            closeMenuIfOpen("menusub-footer", "mobile-menu-icon-footer");
        }
    });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function() {
        initScrollToTop();
        initMenuCloseBehaviors();
    });
} else {
    initScrollToTop();
    initMenuCloseBehaviors();
}