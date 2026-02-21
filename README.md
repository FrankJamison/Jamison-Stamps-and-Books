# Jamison Stamps & Books

Production static site + a small, data-driven stamps catalog (vanilla JS). This repo is intentionally **zero-build**: no bundler, no framework, and no compile step—just HTML/CSS/JS that’s easy to host and easy to update.

## Quick start (Windows + VS Code)

1. Serve the site over HTTP (don’t use `file://`).

2. Open it in a browser:

- VS Code task: **Open in Browser** (opens `http://jamisonstampsandbooks.localhost/`)
- Or any local server: `http://localhost:8080/` (see “Running locally”)

## URLs

- Production: https://jamisonstamps.com/
- Local (this workspace task): `http://jamisonstampsandbooks.localhost/`

Note: the provided VS Code task opens a host on port 80. If you don’t have a local web server listening there, use the “any static server” option and open the `localhost:PORT` URL instead.

## Tech stack

- HTML: hand-authored pages, semantic landmarks
- CSS: global theme + responsive breakpoints
- JavaScript:
  - Site-wide behaviors (mobile menu + scroll-to-top): `js/javascripts.js`
  - Stamps catalog “mini-app” (render/filter/sort/paging + PayPal add-to-cart): `stamps/js/USA.js`

### External services

- PayPal Cart (NCP): `https://www.paypalobjects.com/ncp/cart/cart.js` (used only on the stamps catalog)
- Formspree: contact form submissions (`contact.html`)

## Repository layout

Top-level pages:

```
/
	index.html
	about.html
	contact.html
	resources.html
	site_map.html
	thanks.html
	thanks-payment.html
	robots.txt
	sitemap.xml
```

Shared assets:

```
css/
	style.css
	media-queries.css

js/
	javascripts.js

picts/
	(site images)

tools/
	optimize-images.cmd
```

Stamps catalog (separate “mini-app” area):

```
stamps/
	USA.html
	css/stamps.css
	js/USA.js
```

Why `stamps/` is separate: the stamps page renders a large inventory list from a JS dataset, supports filter/sort/paging, and integrates commerce widgets. Keeping it isolated avoids complicating the brochure-style pages.

## Running locally

Because the site uses external scripts (PayPal) and browsers restrict some behavior on `file://` URLs, run it through an HTTP server.

### Option A — VS Code task

Run the **Open in Browser** task (it opens `http://jamisonstampsandbooks.localhost/`).

### Option B — any static server

From repo root:

```bash
python -m http.server 8080
```

Then open `http://localhost:8080/`.

If you don’t have Python, any static server works (IIS, Apache, Nginx, etc.).

## How the site works

### Shared page structure

Most pages follow the same pattern:

- Landmarks: `<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`
- Skip link to `#maincontent`
- Top “image bar” per page
- Left content + right sidebar layout (sidebar stacks below on smaller screens)

### CSS and responsiveness

- Theme tokens are CSS variables in `css/style.css` (dark “desk/paper” surfaces + postal accent colors)
- Responsive rules live in `css/media-queries.css`
- Mobile menu breakpoint is ~740px (see `js/javascripts.js` + menu CSS)

### Site-wide JavaScript (`js/javascripts.js`)

Progressive enhancements kept intentionally small:

- Mobile menu open/close + `aria-expanded` updates
- Click-away and Escape-to-close behavior (mobile only)
- Scroll-to-top affordance

## Stamps catalog (data-driven page)

- Page: `stamps/USA.html`
- Styles: `stamps/css/stamps.css`
- Data + logic: `stamps/js/USA.js`

### Data model

Each stamp inventory row is an object like:

```js
{
	scott: "147",
	condition: "Used",
	hinged: "Never Hinged",
	gum: "No Gum",
	grade: "Good/Very Good",
	price: 0.47,
	location: "NA01-0023-04-01",
	paypalId: "VLXK5MGURSGMW"
}
```

Notes:

- `scott` is treated as a collector-facing identifier and supports mixed formats (letters + numbers + suffixes).
- `paypalId` must match the PayPal configuration; it should be unique per item.

### Filtering, sorting, and paging

- Text search (Scott #)
- Dropdown filters (condition / hinging / gum / grade)
- Sorting by Scott # or price
- Pagination renders both a top and bottom pager

### PayPal integration

The page loads PayPal’s cart script and renders `<paypal-add-to-cart-button>` elements. Initialization is done lazily (via `IntersectionObserver`, with fallback) to keep large lists responsive.

## Contact form

`contact.html` posts to Formspree and redirects to `thanks.html`.

Implementation notes:

- Uses HTML5 input types (`email`, `tel`) + autocomplete hints
- Uses required fields + a confirm-email field
- Uses `<fieldset><legend>` for the “Contact regarding” radio group

## SEO and indexing

### Per-page metadata

Core pages include:

- `meta name="description"`
- canonical URLs (`<link rel="canonical" ...>`)
- Open Graph + Twitter card metadata

### robots.txt and sitemap

- `robots.txt` blocks non-content utility pages (thank-you pages, etc.)
- `sitemap.xml` is the machine-readable sitemap
- `site_map.html` is the human-readable site map

When you add/remove a public page, update both `site_map.html` and `sitemap.xml` (and consider updating `robots.txt` if it’s a utility/thank-you page).

## Accessibility

Implemented directly in HTML/CSS:

- Skip link (`.skip-link`) to `#maincontent`
- Screen-reader-only utility (`.sr-only`) for control labels
- `<nav aria-label="Primary navigation">` semantics
- Mobile menu updates `aria-expanded`
- Forms use explicit `<label for=...>` and appropriate grouping

## Common edits and checklists

### Editing content (fast sanity pass)

- Update `<title>` and `meta name="description"` if the page topic changed
- Ensure a single clear `<h1>` per page
- Confirm nav links work and `aria-current="page"` is correct
- Check images: decorative should use `alt=""`; informative should have meaningful `alt`
- Verify mobile layout and menu toggle at narrow widths

### Adding a new page

1. Copy the structure from an existing top-level page
2. Include `css/style.css`, `css/media-queries.css`, and `js/javascripts.js`
3. Ensure the skip link targets `<main id="maincontent">`
4. Update navigation across pages (this repo uses copied markup, not templating)
5. Add to `site_map.html` and `sitemap.xml` if it’s public

### Updating the stamp inventory

- Edit the `stamps` array in `stamps/js/USA.js`
- Keep the object shape consistent (missing keys can break filters/sorting)
- Ensure `paypalId` is valid and unique per row

## Image optimization (optional)

Script: `tools/optimize-images.cmd`

Requirements:

- ImageMagick installed and available as `magick` on PATH

Dry run (writes `*.opt.*` files next to originals):

```bat
tools\optimize-images.cmd
```

Optimize in place (optionally with backups):

```bat
tools\optimize-images.cmd /inplace /backup
```

## Deployment

This is a static site. Deployment is typically “copy files to the web root”:

- Upload HTML/CSS/JS/assets as-is
- Keep paths intact (relative links assume this structure)
- Re-check canonical URLs and `sitemap.xml` after environment changes

## Notes on legacy/template code

Some markup originated from a legacy template and may contain vendor notices. Those notices are kept intact; changes are layered carefully (theme variables, accessibility improvements, SEO metadata, and the stamps renderer) to avoid regressions.
