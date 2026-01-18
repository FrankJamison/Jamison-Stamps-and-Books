
# Jamison Stamps & Books — 2026 website refresh

I built and maintain this repo as a **real-world, production static site** for Jamison Stamps & Books. It’s designed to be easy to host, easy to update, and friendly to collectors on phones, tablets, and desktops — without introducing a build pipeline or framework.

If you’re an employer, recruiter, or developer reviewing this project: this README focuses on **implementation details and engineering decisions** (architecture, accessibility, SEO, performance tradeoffs, and how to extend the site).

## What this project demonstrates

- Shipping a maintainable **zero-build** site (no bundler, no framework) with sensible structure.
- Building a data-driven “mini-app” (the stamps catalog) using **vanilla JavaScript**.
- Practical accessibility improvements (landmarks, skip links, form semantics, ARIA where it matters).
- SEO fundamentals (canonical URLs, Open Graph/Twitter cards, `robots.txt`, `sitemap.xml`).
- A pragmatic approach to legacy/template code: keep it stable, modernize carefully, and document constraints.

## Live / local

- Production: https://jamisonstamps.com/
- Local (this workspace): `http://2025jamisonstamps.localhost/`

## Tech stack

This is intentionally “boring” technology — by design.

- **HTML**: hand-authored pages, semantic landmarks.
- **CSS**: global theme + responsive media queries.
- **JavaScript**:
	- Shared layout “includes” (header/menu/footer/sidebar/calendar/contact).
	- Small jQuery behaviors for the mobile menu and scroll-to-top.
	- Stamps catalog renderer (filters, sorting, pagination, PayPal add-to-cart).

### Third-party / external services

- **jQuery 1.11.3** (`JQuery/jquery-1.11.3.min.js`) — used only for a couple of UI behaviors.
- **PayPal Cart (NCP)** (`https://www.paypalobjects.com/ncp/cart/cart.js`) — used on the stamps catalog.
- **Formspree** — handles contact form submissions (`contact.htm`).

## Repository structure

At a high level:

```
/
	index.html
	about.htm
	contact.htm
	resources.htm
	site_map.htm
	sitemap.xml
	robots.txt

	css/
		style.css
		media-queries.css

	js/
		header.js
		menu.js
		footer.js
		sidebar.js
		calendar.js
		contact.js
		javascripts.js

	stamps/
		USA.htm
		css/stamps.css
		js/USA.js

	extras/
		(historical samples / reference files)
```

### Why the `stamps/` folder is separate

The stamps catalog behaves more like a small application than a brochure page:

- It renders a large inventory list from a JavaScript dataset.
- It provides filters + sorting + pagination.
- It integrates with a hosted commerce widget (PayPal cart).

Keeping it in `stamps/` lets it evolve without complicating the rest of the site.

## Design system and UX decisions

### Visual theme ("paper + ink + postal accents")

The global theme is driven by CSS variables in `css/style.css` to keep colors consistent:

- Surfaces are dark “desk/paper” tones for contrast and readability.
- Accent colors mimic postal ink (blue/red) and a subtle “postmark” underline for headings.
- Components use soft borders/shadows to keep the site readable without heavy images.

### Responsive layout

Responsive behavior lives in `css/media-queries.css` and is organized into breakpoint “stages”. Key behaviors:

- Navigation switches to a mobile menu at ~740px.
- Typography and spacing tighten at smaller widths.
- Sidebar stacks below the main content on mobile for better reading flow.

### Content structure

Pages consistently use:

- `<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>` landmarks.
- A top “image bar” that sets context per page.
- A left main content area with a right sidebar (collapses on mobile).

## Architecture: how the pages are composed

This repo avoids copy/pasting shared HTML across multiple pages by using lightweight JavaScript “includes”.

### Shared layout scripts

There are two sets of shared layout scripts:

- Main site includes under `js/` (used by `index.html`, `about.htm`, `contact.htm`, etc.)
- Stamps subsite includes under `stamps/js/` (used by `stamps/USA.htm`)

Main site shared layout scripts:

- `js/header.js` — writes the site header/logo.
- `js/menu.js` — writes primary navigation + the mobile menu button.
- `js/footer.js` — writes the footer + the scroll-to-top anchor.
- `js/sidebar.js` — writes a global “website topics” sidebar block.
- `js/calendar.js` — writes the month calendar widget.
- `js/contact.js` — writes the contact/address block.

These scripts use `document.write()` so the shared markup appears in the correct spot during initial parsing.

Tradeoff (intentional): `document.write()` is old-school, but it’s reliable for a no-build static site and keeps the pages simple to edit.

### Subfolder-safe URLs

For the main site includes, the scripts compute a `basePath` based on the current URL path so the same header/menu/footer work from:

- the site root (`/`)
- `stamps/` pages
- `extras/` pages

This avoids maintaining separate nav/header copies for subfolders.

The stamps subsite scripts under `stamps/js/` use explicit relative links (for example `../index.html`).

## Accessibility

Accessibility improvements are implemented directly in markup/CSS, not via a framework:

- **Skip link** (`.skip-link`) to jump to `#maincontent`.
- **Screen-reader-only utility** (`.sr-only`) used for form and control labels.
- **Navigation semantics (main site pages)**: the primary menu is written as `<nav aria-label="Primary">`.
- **Mobile menu ARIA (main site pages)**: `aria-controls` + `aria-expanded` are updated when toggling the menu.
- **Forms**: explicit `<label for=...>` associations and a `<fieldset><legend>` for grouped radio controls.

Note: the stamps subsite menu is older template markup; one future improvement would be bringing it into parity with the main site’s button/ARIA approach.

## SEO and social sharing

Core pages include:

- `meta name="description"` and keyword targeting.
- Canonical URLs (`<link rel="canonical" ...>`).
- Open Graph + Twitter card metadata.

Crawl management:

- `robots.txt` disallows non-content/utility pages (`/extras/`, thank-you pages, etc.).
- `sitemap.xml` is present for search engines.
- `site_map.htm` is a human-readable “site map” page.

## JavaScript behavior details

### Site-wide behavior (`js/javascripts.js`)

This file contains small progressive enhancements:

- Scroll-to-top affordance (shows after the user scrolls).
- Mobile menu toggle.
- Click-away-to-close behavior for the mobile menu under ~740px.

This is intentionally small and isolated so that most pages remain stable, cacheable, and easy to reason about.

## The stamps catalog (data-driven page)

The catalog is implemented as a client-side renderer:

- Page: `stamps/USA.htm`
- Logic + dataset: `stamps/js/USA.js`
- Styles: `stamps/css/stamps.css`

### Data model

Each inventory item is represented as an object with:

- `scott` (string): Scott catalog identifier (supports prefixes/suffixes like `C115`, `219D`, etc.).
- `condition`, `hinged`, `gum`, `grade` (strings): filterable attributes.
- `price` (number): used for sorting.
- `location` (string): internal inventory locator.
- `paypalId` (string): PayPal add-to-cart button id.

### Filtering + sorting

The UI supports:

- Text search by Scott number (debounced input).
- Dropdown filters for condition/hinging/gum/grade.
- Sorting by Scott number and price.

Scott sorting is implemented with a robust key function that splits identifiers into:

- prefix letters
- numeric portion
- suffix letters

This produces “collector-correct” ordering across mixed IDs.

### Pagination

The catalog renders one page at a time (configurable via `PAGE_SIZE`) and generates **two pagers**:

- A top pager (above the results)
- A bottom pager (below the results)

Each pager includes:

- First/Prev/Next/Last
- Current page indicator
- A numeric “Jump to page” input

### PayPal integration (performance-minded)

Each stamp row contains a `<paypal-add-to-cart-button>`.

To keep the page responsive with a large list:

- PayPal add-to-cart initialization is done **lazily** using `IntersectionObserver`.
- There’s a safe fallback path when `IntersectionObserver` isn’t supported.
- A small `whenPaypalReady()` helper waits for `cartPaypal` to be available.

## Contact form

The contact form on `contact.htm` posts to Formspree and then redirects to a thank-you page.

Implementation details:

- Uses HTML5 input types (`email`, `tel`) and autocomplete hints.
- Uses required fields + a confirm-email field.
- Uses a `<fieldset>` for the “Contact regarding” radio group.

## Running locally

Because the site depends on external scripts (PayPal) and browser security restrictions apply to `file://` URLs, run it through an HTTP server.

### Option A — VS Code task

This workspace has a task labeled **Open in Browser** which opens:

- `http://2025jamisonstamps.localhost/`

### Option B — any static server

From repo root:

```bash
python -m http.server 8080
```

Then open `http://localhost:8080/`.

## How to update content safely

### Adding a new page

I follow the existing page pattern:

1. Include `css/style.css` and `css/media-queries.css`.
2. Include jQuery + `js/javascripts.js` (for mobile menu + scroll-to-top).
3. Inject shared sections with `js/header.js`, `js/menu.js`, and `js/footer.js`.
4. Wrap main content in `<main id="maincontent">` so the skip link works.

### Updating navigation

- Edit `js/menu.js` (root site navigation).
- The stamps pages have their own menu include under `stamps/js/`.

### Updating the stamp inventory

- Edit the dataset in `stamps/js/USA.js`.
- Each item needs a unique `paypalId` matching PayPal’s configuration.

## Notes on legacy/template code

Some files originated from a legacy site template and include vendor notices. I keep those notices intact and treat that code as “stable foundation,” then layer my changes on top (theme variables, accessibility fixes, SEO metadata, and the catalog renderer).

## Next improvements I’d consider

If I were expanding this further, I’d likely:

- Replace `document.write()` includes with a small compile step or server-side includes.
- Reduce dependency on jQuery (it’s only used for a few behaviors).
- Add a lightweight image optimization pass and ensure all decorative images have intentional alt behavior.
- Add a simple content checklist for non-developers updating pages.
