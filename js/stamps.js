// stamps.js — DB/JSON-backed filters, sorting, paging (top & bottom), text Jump-to, and scroll-to-top
// Jamison Stamps & Books

// =========================
// 1) DATA (loaded from API)
// =========================
const DEBUG = new URLSearchParams(window.location.search).has("debug") ||
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

// Prefer the script URL (stable regardless of current page path).
const SCRIPT_SRC = (document.currentScript && document.currentScript.src) ? document.currentScript.src : window.location.href;

// Compute API base relative to THIS script's location.
// This keeps it working when pages live under subfolders like `/stamps/...`.
function computeApiBase() {
    try {
        // js/stamps.js -> ../api/
        const u = new URL("../api/", SCRIPT_SRC);
        return u.toString().replace(/\/$/, "");
    } catch {
        return "api";
    }
}

// Site base, derived from script location: js/stamps.js -> ../ (site root).
let SITE_BASE = "";
try {
    SITE_BASE = new URL("../", SCRIPT_SRC).toString();
} catch {
    SITE_BASE = "";
}

// Images base, derived from script location: js/stamps.js -> ../picts/stamps/
// This stays correct regardless of which page includes the script.
let IMAGES_BASE = "";
try {
    // Images live under /picts/stamps/{country}/...
    // js/stamps.js -> ../picts/stamps/
    IMAGES_BASE = new URL("../picts/stamps/", SCRIPT_SRC).toString();
} catch {
    IMAGES_BASE = "";
}

const API_BASE = computeApiBase();

async function fetchJson(url) {
    const res = await fetch(url, {
        cache: "no-cache"
    });
    if (!res.ok) {
        let details = "";
        try {
            const ct = res.headers.get("content-type") || "";
            if (ct.includes("application/json")) {
                const j = await res.json();
                if (j && typeof j === "object") {
                    const err = j.error ? String(j.error) : "";
                    const msg = j.message ? String(j.message) : "";
                    details = [err, msg].filter(Boolean).join(": ");
                }
            } else {
                const t = await res.text();
                details = (t || "").trim().slice(0, 300);
            }
        } catch {}
        const suffix = details ? ` (${details})` : "";
        throw new Error(`${url}: HTTP ${res.status} ${res.statusText}${suffix}`);
    }
    return res.json();
}

// =========================
// 2) CONFIG
// =========================
const PAGE_SIZE = 25; // show only 25 items at a time

// =========================
// 3) INTERNAL STATE
// =========================
let currentPage = 1;
let lastTotalPages = 1; // updated on each render

// =========================
// 4) DOM HELPERS
// =========================
const $ = (sel) => document.querySelector(sel);
const byId = (id) => document.getElementById(id);
const contentEl = () => document.querySelector("article.content");

// Debounce for search input
function debounce(fn, ms = 200) {
    let t;
    return (...a) => {
        clearTimeout(t);
        t = setTimeout(() => fn(...a), ms);
    };
}

function uniqueSorted(values) {
    return Array.from(new Set(values)).filter(Boolean).sort((a, b) => String(a).localeCompare(String(b), undefined, {
        numeric: true
    }));
}

function buildQuery(params) {
    const q = new URLSearchParams();
    Object.keys(params).forEach((k) => {
        const v = params[k];
        if (v === undefined || v === null) return;
        if (String(v) === "") return;
        q.set(k, String(v));
    });
    return q.toString();
}

// Robust Scott sorting: prefix letters, number, suffix letters (e.g., "C115", "219D")
function scottKey(s) {
    const str = String(s);
    const m = str.match(/^([A-Za-z]*)(\d+)?([A-Za-z]*)$/);
    if (!m) return {
        prefix: str,
        num: Number.NaN,
        suffix: ""
    };
    return {
        prefix: m[1] || "",
        num: m[2] ? parseInt(m[2], 10) : Number.NaN,
        suffix: m[3] || ""
    };
}

function compareScottAsc(a, b) {
    const A = scottKey(a.scott),
        B = scottKey(b.scott);
    if (A.prefix !== B.prefix) return A.prefix.localeCompare(B.prefix);
    if (!Number.isNaN(A.num) && !Number.isNaN(B.num) && A.num !== B.num) return A.num - B.num;
    if (Number.isNaN(A.num) && !Number.isNaN(B.num)) return 1;
    if (!Number.isNaN(A.num) && Number.isNaN(B.num)) return -1;
    return A.suffix.localeCompare(B.suffix) || String(a.scott).localeCompare(String(b.scott));
}

function compareScottDesc(a, b) {
    return -compareScottAsc(a, b);
}

// =========================
// 5) PAYPAL LAZY INIT
// =========================
// Replaced PayPal hosted-buttons cart with a local cart + a single PayPal checkout.

// =========================
// 5) LOCAL CART (localStorage)
// =========================
const CART_KEY = "jsb_local_cart_v1";

function moneyFromCents(cents) {
    const n = Number(cents) || 0;
    return (n / 100).toFixed(2);
}

function loadCart() {
    try {
        const raw = localStorage.getItem(CART_KEY);
        if (!raw) return {
            items: []
        };
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== "object") return {
            items: []
        };
        const items = Array.isArray(parsed.items) ? parsed.items : [];
        return {
            items: items.filter(x => x && Number.isFinite(Number(x.id)))
        };
    } catch {
        return {
            items: []
        };
    }
}

function saveCart(cart) {
    try {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch {}
}

function cartHasId(cart, id) {
    const n = Number(id);
    return cart.items.some(it => Number(it.id) === n);
}

function cartAddStamp(stamp) {
    const cart = loadCart();
    const id = Number(stamp.id);
    if (!Number.isFinite(id)) return;

    if (cartHasId(cart, id)) return;

    cart.items.push({
        id,
        qty: 1
    });
    saveCart(cart);
    renderLocalCart();
    refreshVisibleAddButtons();
}

function cartRemoveId(id) {
    const cart = loadCart();
    const n = Number(id);
    cart.items = cart.items.filter(it => Number(it.id) !== n);
    saveCart(cart);
    renderLocalCart();
    refreshVisibleAddButtons();
}

function cartClear() {
    saveCart({
        items: []
    });
    renderLocalCart();
    refreshVisibleAddButtons();
}

function computeCheckoutUrl() {
    try {
        if (SITE_BASE) return new URL("checkout.php", SITE_BASE).toString();
    } catch {}
    return "checkout.php";
}

function postToCheckout(cart) {
    const url = computeCheckoutUrl();
    const form = document.createElement("form");
    form.method = "post";
    form.action = url;
    form.style.display = "none";

    const input = document.createElement("input");
    input.type = "hidden";
    input.name = "cart";
    input.value = JSON.stringify({
        items: cart.items.map(it => ({
            id: Number(it.id),
            qty: 1
        }))
    });

    form.appendChild(input);
    document.body.appendChild(form);
    form.submit();
}

async function fetchStampSummariesByIds(ids) {
    // Uses the existing stamps API with a large pageSize and q-less filter,
    // but prefers a dedicated endpoint if present.
    // Dedicated endpoint: /api/cart-items.php?ids=1,2,3
    const list = (ids || []).map(n => Number(n)).filter(n => Number.isFinite(n));
    if (list.length === 0) return new Map();

    // Try dedicated endpoint first.
    try {
        const url = `${API_BASE}/cart-items.php?ids=${encodeURIComponent(list.join(","))}`;
        const data = await fetchJson(url);
        if (data && typeof data === "object" && Array.isArray(data.items)) {
            const m = new Map();
            data.items.forEach(it => {
                if (!it) return;
                const id = Number(it.id);
                if (!Number.isFinite(id)) return;
                m.set(id, it);
            });
            return m;
        }
    } catch {
        // ignore and fall back
    }

    // Fallback: no summaries available.
    return new Map();
}

async function renderLocalCart() {
    const root = byId("localCart");
    if (!root) return;

    const summaryEl = byId("localCartSummary");
    const itemsEl = byId("localCartItems");
    const totalEl = byId("localCartTotal");
    const checkoutBtn = byId("localCartCheckout");
    const clearBtn = byId("localCartClear");

    const cart = loadCart();
    const ids = cart.items.map(it => Number(it.id)).filter(n => Number.isFinite(n));
    const summaries = await fetchStampSummariesByIds(ids);

    // Render items
    if (itemsEl) itemsEl.innerHTML = "";

    let totalCents = 0;
    const knownCount = ids.length;

    if (knownCount === 0) {
        if (summaryEl) summaryEl.textContent = "Cart is empty.";
        if (totalEl) totalEl.textContent = "$0.00";
        if (checkoutBtn) checkoutBtn.disabled = true;
        if (clearBtn) clearBtn.disabled = true;
        return;
    }

    if (summaryEl) summaryEl.textContent = `${knownCount} item${knownCount === 1 ? "" : "s"} in cart`;

    cart.items.forEach(it => {
        const id = Number(it.id);
        const s = summaries.get(id);

        const row = document.createElement("div");
        row.className = "local-cart-item";
        row.setAttribute("role", "listitem");

        const label = document.createElement("div");
        label.className = "local-cart-item-label";

        if (s) {
            const priceCents = Number(s.priceCents);
            if (Number.isFinite(priceCents)) totalCents += priceCents;

            const scott = (s.scott || "").toString();
            const cond = (s.condition || "").toString();
            label.textContent = `Scott ${scott}${cond ? " — " + cond : ""}`;

            const price = document.createElement("div");
            price.className = "local-cart-item-price";
            price.textContent = `$${moneyFromCents(priceCents)}`;
            row.appendChild(price);
        } else {
            label.textContent = `Item #${id}`;
        }

        const remove = document.createElement("button");
        remove.type = "button";
        remove.className = "local-cart-item-remove";
        remove.textContent = "Remove";
        remove.addEventListener("click", () => cartRemoveId(id));

        row.appendChild(label);
        row.appendChild(remove);

        if (itemsEl) itemsEl.appendChild(row);
    });

    if (totalEl) totalEl.textContent = `$${moneyFromCents(totalCents)}`;

    if (checkoutBtn) {
        checkoutBtn.disabled = false;
        checkoutBtn.onclick = () => {
            const c = loadCart();
            if (!c.items.length) return;
            postToCheckout(c);
        };
    }
    if (clearBtn) {
        clearBtn.disabled = false;
        clearBtn.onclick = () => cartClear();
    }
}

function refreshVisibleAddButtons() {
    const cart = loadCart();
    const buttons = document.querySelectorAll("button[data-add-to-cart-id]");
    buttons.forEach(btn => {
        const id = Number(btn.getAttribute("data-add-to-cart-id"));
        const inCart = Number.isFinite(id) && cartHasId(cart, id);
        btn.disabled = inCart;
        btn.textContent = inCart ? "In cart" : "Add to cart";
    });
}

// =========================
// 6) RENDERING
// =========================
function getStampImageUrlCandidates(stamp, side /* 'front' | 'back' */ ) {
    // Preferred convention:
    // picts/stamps/{country}/{scott}-{count}-front.jpg
    // picts/stamps/{country}/{scott}-{count}-back.jpg
    // Legacy convention (seen in repo):
    // picts/stamps/{country}/{scott} - {count} - Front.jpg
    // picts/stamps/{country}/{scott} - {count} - Back.jpg
    const country = stamp && stamp.country ? String(stamp.country).trim() : "";
    const scott = stamp && stamp.scott ? String(stamp.scott).trim() : "";
    const count = stamp && stamp.count ? String(stamp.count).trim() : "";
    if (!country || !scott || !count) return [];

    const sideLower = String(side).toLowerCase() === "back" ? "back" : "front";
    const sideTitle = sideLower === "back" ? "Back" : "Front";

    const folder = encodeURIComponent(country);
    const names = [
        `${scott}-${count}-${sideLower}.jpg`,
        `${scott} - ${count} - ${sideTitle}.jpg`,
    ];

    return names.map(name => {
        const relPath = `${folder}/${encodeURIComponent(name)}`;
        try {
            if (IMAGES_BASE) return new URL(relPath, IMAGES_BASE).toString();
            if (SITE_BASE) return new URL(`picts/stamps/${relPath}`, SITE_BASE).toString();
        } catch {}
        return `picts/stamps/${relPath}`;
    });
}

function setImgSrcWithFallback(img, candidates, onAllFail) {
    const list = Array.isArray(candidates) ? candidates.filter(Boolean) : [];
    if (!img || list.length === 0) {
        if (typeof onAllFail === "function") onAllFail();
        return;
    }

    // Use a single chained handler (overwrites prior) to avoid stacking listeners.
    let idx = 0;
    img.onerror = () => {
        idx += 1;
        if (idx >= list.length) {
            img.onerror = null;
            if (typeof onAllFail === "function") onAllFail();
            return;
        }
        img.src = list[idx];
    };
    img.src = list[0];
}

function formatStampTitle(stamp) {
    const scott = (stamp?.scott ?? "").toString().trim();
    const condition = (stamp?.condition ?? "").toString().trim();
    const hinged = (stamp?.hinged ?? "").toString().trim();
    const grade = (stamp?.grade ?? "").toString().trim();

    const line1Parts = [
        scott ? `Scott ${scott}` : "Scott",
        condition || "Condition",
        hinged || "Hinging",
    ];
    const line1 = line1Parts.join(" | ");
    const line2 = grade || "Grade";
    return {
        line1,
        line2
    };
}

function renderStampTitle(stamp) {
    const t = formatStampTitle(stamp);
    const wrap = document.createElement("span");
    wrap.className = "stamp-title-wrap";

    const l1 = document.createElement("span");
    l1.className = "stamp-title-line stamp-title-line1";
    l1.textContent = t.line1;

    const l2 = document.createElement("span");
    l2.className = "stamp-title-line stamp-title-line2";
    l2.textContent = t.line2;

    wrap.appendChild(l1);
    wrap.appendChild(l2);
    return wrap;
}

function appendDescriptionParagraphs(container, raw) {
    const text = (raw ?? "").toString();
    const trimmed = text.trim();
    if (!trimmed) return;

    const paras = trimmed.split(/\n\s*\n+/g);
    paras.forEach(p => {
        const cleaned = p.replace(/\s*\n\s*/g, " ").trim();
        if (!cleaned) return;
        const el = document.createElement("p");
        el.textContent = cleaned;
        container.appendChild(el);
    });
}

function makeImageGallery(stamp) {
    const wrap = document.createElement("div");
    wrap.className = "stamp-gallery";

    const frontCandidates = getStampImageUrlCandidates(stamp, "front");
    const backCandidates = getStampImageUrlCandidates(stamp, "back");

    const main = document.createElement("div");
    main.className = "stamp-main";

    const mainImg = document.createElement("img");
    mainImg.className = "stamp-main-img";
    mainImg.alt = "Stamp";

    // Default main image: front (fallback to back if front missing).
    const mainCandidates = (frontCandidates.length ? frontCandidates : backCandidates);
    setImgSrcWithFallback(mainImg, mainCandidates, () => {
        main.style.display = "none";
    });
    main.appendChild(mainImg);
    wrap.appendChild(main);

    const thumbs = document.createElement("div");
    thumbs.className = "stamp-thumbs";
    wrap.appendChild(thumbs);

    const buttons = [];
    const setCurrent = (btn) => {
        buttons.forEach(b => {
            const isCurrent = (b === btn);
            b.setAttribute("aria-current", isCurrent ? "true" : "false");
            b.setAttribute("aria-pressed", isCurrent ? "true" : "false");
            const base = b.dataset.baseLabel || (b.getAttribute("aria-label") || "");
            b.setAttribute("aria-label", isCurrent ? `${base}, selected` : base);
        });
    };
    const maybeHide = () => {
        if (thumbs.childElementCount === 0) thumbs.style.display = "none";
        if (frontCandidates.length === 0 && backCandidates.length === 0) wrap.style.display = "none";
    };

    const addThumb = (side, candidates) => {
        const list = Array.isArray(candidates) ? candidates.filter(Boolean) : [];
        if (list.length === 0) return;

        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "stamp-thumb-btn";
        const baseLabel = side === "front" ? "Front image" : "Back image";
        btn.dataset.baseLabel = baseLabel;
        btn.setAttribute("aria-label", baseLabel);
        btn.setAttribute("aria-current", "false");
        btn.setAttribute("aria-pressed", "false");

        const img = document.createElement("img");
        img.className = "stamp-thumb-img";
        img.alt = side === "front" ? "Front thumbnail" : "Back thumbnail";

        setImgSrcWithFallback(img, list, () => {
            btn.remove();
            maybeHide();
        });

        btn.addEventListener("click", () => {
            if (mainImg) {
                setImgSrcWithFallback(mainImg, list, () => {
                    main.style.display = "none";
                    maybeHide();
                });
            }
            setCurrent(btn);
        });

        btn.appendChild(img);
        thumbs.appendChild(btn);
        buttons.push(btn);
    };

    addThumb("front", frontCandidates);
    addThumb("back", backCandidates);

    // Default selection: front, else back.
    if (buttons.length > 0) setCurrent(buttons[0]);
    maybeHide();

    return wrap;
}

function makeSection(stamp) {
    const s = document.createElement("section");
    s.className = "stamp";
    s.dataset.country = stamp.country || "";
    s.dataset.scott = stamp.scott;
    s.dataset.condition = stamp.condition;
    s.dataset.hinged = stamp.hinged;
    s.dataset.gum = stamp.gum;
    s.dataset.grade = stamp.grade || "";
    s.dataset.price = String(stamp.price);
    s.dataset.location = stamp.location;

    const row = document.createElement("div");
    row.className = "stamp-row";

    // Left: gallery (main image + front/back thumbnails)
    row.appendChild(makeImageGallery(stamp));

    // Right: title + price + description + add-to-cart
    const details = document.createElement("div");
    details.className = "stamp-details";

    const title = document.createElement("h2");
    title.className = "stamp-title";
    title.appendChild(renderStampTitle(stamp));
    details.appendChild(title);

    const price = document.createElement("div");
    price.className = "stamp-price";
    const cents = Number(stamp?.priceCents);
    price.textContent = Number.isFinite(cents) ? `$${moneyFromCents(cents)}` : "";
    details.appendChild(price);

    const desc = document.createElement("div");
    desc.className = "stamp-description";
    appendDescriptionParagraphs(desc, stamp?.description);
    details.appendChild(desc);

    const buy = document.createElement("div");
    buy.className = "stamp-buy";

    const add = document.createElement("button");
    add.type = "button";
    add.className = "add-to-cart";
    add.setAttribute("data-add-to-cart-id", String(stamp.id));
    add.textContent = "Add to cart";
    add.addEventListener("click", () => cartAddStamp(stamp));
    buy.appendChild(add);
    details.appendChild(buy);

    row.appendChild(details);
    s.appendChild(row);
    return s;
}

function renderPage(data) {
    const start = (currentPage - 1) * PAGE_SIZE;
    const page = data.slice(start, start + PAGE_SIZE);

    const root = contentEl();
    root.innerHTML = "";

    if (page.length === 0) {
        const empty = document.createElement("div");
        empty.className = "empty-state";
        empty.textContent = "No stamps match your filters.";
        root.appendChild(empty);
    } else {
        page.forEach(st => root.appendChild(makeSection(st)));
    }

    // render pagers above and below
    renderPagerAt("pagerTop", data.length, "top");
    renderPagerAt("pagerBottom", data.length, "bottom");

    // Clean up any legacy single pager if present
    const legacy = byId("pager");
    if (legacy) legacy.remove();
}

// Unified page change helper with optional scroll-to-top
function goToPage(n, scrollTop = true) {
    const clamped = Math.min(Math.max(1, n), lastTotalPages);
    if (clamped === currentPage) return;
    currentPage = clamped;
    refresh();
    if (scrollTop) {
        // wait for DOM update then scroll
        setTimeout(() => window.scrollTo({
            top: 0,
            behavior: 'smooth'
        }), 0);
    }
}

// New: generic pager renderer for a specific container, with TEXT jump-to
function renderPagerAt(containerId, total, position) {
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    lastTotalPages = totalPages;
    currentPage = Math.min(Math.max(1, currentPage), totalPages);

    let pager = byId(containerId);
    if (!pager) {
        pager = document.createElement("div");
        pager.id = containerId;
        pager.className = "pager";
        pager.style.display = "flex";
        pager.style.gap = "8px";
        pager.style.alignItems = "center";
        pager.style.flexWrap = "wrap";
        pager.style.margin = "12px 0";

        if (position === "top") {
            // Insert before the content section
            contentEl().insertAdjacentElement("beforebegin", pager);
        } else {
            // Insert after the content section
            contentEl().insertAdjacentElement("afterend", pager);
        }
    }
    pager.innerHTML = "";

    const makeBtn = (label, disabled, onClick) => {
        const b = document.createElement("button");
        b.textContent = label;
        b.disabled = disabled;
        b.addEventListener("click", onClick);
        return b;
    };

    // First & Prev
    pager.appendChild(makeBtn("« First", currentPage === 1, () => goToPage(1)));
    pager.appendChild(makeBtn("‹ Prev", currentPage === 1, () => goToPage(currentPage - 1)));

    // Info
    const info = document.createElement("span");
    info.textContent = `Page ${currentPage} of ${totalPages}`;
    pager.appendChild(info);

    // Jump-to TEXT input
    const jumpWrap = document.createElement("span");
    jumpWrap.className = "pager-jump";
    jumpWrap.style.display = "inline-flex";
    jumpWrap.style.alignItems = "center";
    jumpWrap.style.gap = "6px";
    jumpWrap.style.flexWrap = "wrap";
    jumpWrap.style.marginLeft = "8px";
    jumpWrap.style.maxWidth = "100%";
    jumpWrap.style.minWidth = "0";

    const jumpLabel = document.createElement("label");
    jumpLabel.textContent = "Jump to:";
    jumpLabel.setAttribute("for", containerId + "-jump");
    jumpWrap.appendChild(jumpLabel);

    const input = document.createElement("input");
    input.id = containerId + "-jump";
    input.type = "number";
    input.min = "1";
    input.max = String(totalPages);
    input.value = String(currentPage);
    input.placeholder = "Page #";
    input.style.width = "64px";
    input.style.maxWidth = "100%";
    input.style.minWidth = "0";
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            const val = parseInt(input.value, 10);
            if (!Number.isFinite(val)) return;
            goToPage(val);
        }
    });
    jumpWrap.appendChild(input);

    const goBtn = document.createElement("button");
    goBtn.textContent = "Go";
    goBtn.addEventListener("click", () => {
        const val = parseInt(input.value, 10);
        if (!Number.isFinite(val)) return;
        goToPage(val);
    });
    jumpWrap.appendChild(goBtn);

    pager.appendChild(jumpWrap);

    // Next & Last
    pager.appendChild(makeBtn("Next ›", currentPage === totalPages, () => goToPage(currentPage + 1)));
    pager.appendChild(makeBtn("Last »", currentPage === totalPages, () => goToPage(totalPages)));
}

// =========================
// 7) FILTERING & SORTING
// =========================
function setSelectOptions(selectId, values) {
    const el = byId(selectId);
    if (!el) return;
    const first = el.firstElementChild?.outerHTML || '<option value=""></option>';
    el.innerHTML = first;

    const list = Array.isArray(values) ? values : [];
    const isObjList = list.some(v => v && typeof v === "object");

    if (isObjList) {
        list.forEach(item => {
            const v = (item && typeof item === "object") ?
                (item.value ?? item.v ?? "") :
                item;
            const val = (v ?? "").toString().trim();
            if (!val) return;

            const cntRaw = (item && typeof item === "object") ? (item.count ?? item.cnt) : undefined;
            const cntNum = Number(cntRaw);
            const hasCount = Number.isFinite(cntNum);

            const opt = document.createElement("option");
            opt.value = val;
            opt.textContent = hasCount ? `${val} (${Math.max(0, Math.trunc(cntNum))})` : val;
            el.appendChild(opt);
        });
        return;
    }

    uniqueSorted(list).forEach(v => {
        const val = (v ?? "").toString().trim();
        if (!val) return;
        const opt = document.createElement("option");
        opt.value = val;
        opt.textContent = val;
        el.appendChild(opt);
    });
}

async function loadFilters(country) {
    const qs = buildQuery({
        country
    });
    const url = `${API_BASE}/filters.php${qs ? "?" + qs : ""}`;
    const data = await fetchJson(url);
    setSelectOptions("countryFilter", data.countries);
    if (byId("countryFilter") && country) byId("countryFilter").value = country;

    setSelectOptions("conditionFilter", data.conditions);
    setSelectOptions("hingedFilter", data.hinged);
    setSelectOptions("gumFilter", data.gums);
    if (byId("gradeFilter")) setSelectOptions("gradeFilter", data.grades);
}

function getCurrentQueryState() {
    return {
        q: (byId("searchBox")?.value || "").trim(),
        country: byId("countryFilter")?.value || "",
        condition: byId("conditionFilter")?.value || "",
        hinged: byId("hingedFilter")?.value || "",
        gum: byId("gumFilter")?.value || "",
        grade: byId("gradeFilter")?.value || "",
        sort: byId("sortOptions")?.value || "newest",
    };
}

// =========================
// 8) WIRING & BOOT
// =========================
function wireControls() {
    const onChange = () => {
        currentPage = 1;
        refresh();
        setTimeout(() => window.scrollTo({
            top: 0,
            behavior: 'smooth'
        }), 0);
    };
    const onType = debounce(onChange, 200);

    byId("searchBox")?.addEventListener("input", onType);
    byId("countryFilter")?.addEventListener("change", async () => {
        const selected = byId("countryFilter")?.value || "";

        // Preserve other dropdown selections when possible.
        const keep = {
            condition: byId("conditionFilter")?.value || "",
            hinged: byId("hingedFilter")?.value || "",
            gum: byId("gumFilter")?.value || "",
            grade: byId("gradeFilter")?.value || "",
        };

        await loadFilters(selected);

        if (byId("conditionFilter")) byId("conditionFilter").value = keep.condition;
        if (byId("hingedFilter")) byId("hingedFilter").value = keep.hinged;
        if (byId("gumFilter")) byId("gumFilter").value = keep.gum;
        if (byId("gradeFilter")) byId("gradeFilter").value = keep.grade;

        onChange();
    });
    byId("conditionFilter")?.addEventListener("change", onChange);
    byId("hingedFilter")?.addEventListener("change", onChange);
    byId("gumFilter")?.addEventListener("change", onChange);
    byId("gradeFilter")?.addEventListener("change", onChange); // optional
    byId("sortOptions")?.addEventListener("change", onChange);
}

async function refresh() {
    const state = getCurrentQueryState();
    const qs = buildQuery({
        ...state,
        page: currentPage,
        pageSize: PAGE_SIZE
    });
    const url = `${API_BASE}/stamps.php?${qs}`;

    try {
        const data = await fetchJson(url);
        const items = Array.isArray(data.items) ? data.items : [];
        lastTotalPages = Number(data.totalPages) || 1;
        currentPage = Math.min(Math.max(1, currentPage), lastTotalPages);

        // Server already paged; render directly.
        const root = contentEl();
        if (root) {
            root.innerHTML = "";
            if (items.length === 0) {
                const empty = document.createElement("div");
                empty.className = "empty-state";
                empty.textContent = "No stamps match your filters.";
                root.appendChild(empty);
            } else {
                items.forEach(st => root.appendChild(makeSection(st)));
            }
        }

        // Keep local cart sidebar up to date.
        renderLocalCart();
        refreshVisibleAddButtons();

        // Pagers use total count from server.
        renderPagerAt("pagerTop", Number(data.total) || 0, "top");
        renderPagerAt("pagerBottom", Number(data.total) || 0, "bottom");
    } catch (e) {
        console.error(e);
        const root = contentEl();
        if (root) {
            root.innerHTML = "";
            const msg = document.createElement("div");
            msg.className = "empty-state";
            msg.textContent = DEBUG && e?.message ? `Could not load stamp inventory. ${e.message}` : "Could not load stamp inventory.";
            root.appendChild(msg);
        }
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    try {
        // Load full country list first
        await loadFilters("");

        // Multi-country behavior:
        // - If there's exactly one country, auto-select it.
        // - Otherwise, leave blank to show all countries by default.
        const countryEl = byId("countryFilter");
        const countries = Array.from(countryEl?.options || [])
            .map(o => (o.value || "").trim())
            .filter(v => v !== "");

        if (countryEl && countries.length === 1) {
            countryEl.value = countries[0];
        }

        // Load dependent filters for the selected country (or unscoped if blank)
        await loadFilters(countryEl?.value || "");
    } catch (e) {
        console.error(e);
        const root = contentEl();
        if (root) {
            root.innerHTML = "";
            const msg = document.createElement("div");
            msg.className = "empty-state";
            msg.textContent = DEBUG && e?.message ? `Could not load stamp inventory. ${e.message}` : "Could not load stamp inventory.";
            root.appendChild(msg);
        }
        return;
    }

    wireControls();
    // Show any existing cart immediately.
    renderLocalCart();
    refresh();
});