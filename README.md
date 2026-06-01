# Jamison Stamps & Books

Production site + a small, data-driven stamps catalog (vanilla JS). This repo is intentionally **zero-build**: no bundler, no framework, and no compile step—just PHP/HTML/CSS/JS that’s easy to host and easy to update.

## Quick start (Windows + VS Code)

1. Serve the site over HTTP (don’t use `file://`).

2. Open it in a browser:

- VS Code task: **Open in Browser** (prints `http://127.0.0.1:8080/` and attempts to open it)
- Or any local server: `http://127.0.0.1:8080/` (see “Running locally”)

## URLs

- Production: https://jamisonstamps.com/
- Local: `http://127.0.0.1:8080/`

Legacy URLs:

- The old top-level `.html` / `.htm` URLs are intended to permanently redirect to their `.php` equivalents (see `.htaccess`).

Note: in some remote/headless Linux environments the task may not be able to launch a GUI browser; it will still print the URL.

## Tech stack

- PHP: simple `.php` pages (mostly static HTML), semantic landmarks
- CSS: global theme + responsive breakpoints
- JavaScript:
  - Site-wide behaviors (mobile menu + scroll-to-top): `js/javascripts.js`
  - Stamps catalog “mini-app” (render/filter/sort/paging + PayPal add-to-cart): `js/stamps.js`

### External services

- PayPal Cart (NCP): `https://www.paypalobjects.com/ncp/cart/cart.js` (used only on the stamps catalog)
- Formspree: contact form submissions (`contact.php`)

## Repository layout

Top-level pages:

```
/
	index.php
	about.php
	contact.php
	resources.php
	site_map.php
	thanks.php
	thanks-payment.php
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
	stamps/
		(stamp photos)

tools/
	optimize-images.cmd
```

Stamps catalog (separate “mini-app” area):

```
	stamps.php
	css/stamps.css
	js/stamps.js

api/
	stamps.php
	filters.php
```

Why the stamps page is separate: it renders a large inventory list from a JS dataset, supports filter/sort/paging, and integrates commerce widgets. Keeping it isolated avoids complicating the brochure-style pages.

## Running locally

Because the site uses external scripts (PayPal) and browsers restrict some behavior on `file://` URLs, run it through an HTTP server.

### Option A — VS Code task

Run the **Open in Browser** task (prints `http://127.0.0.1:8080/`).

### Option B — PHP built-in server

From repo root:

```bash
php -S 127.0.0.1:8080 -t .
```

Then open `http://127.0.0.1:8080/`.

Any server that can run PHP works (IIS, Apache, Nginx, etc.).

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

- Page: `stamps.php`
- Styles: `css/stamps.css`
- Frontend logic: `js/stamps.js`

### Live database endpoint (dynamic; no runtime JSON)

The stamps page fetches inventory data from same-origin endpoints:

- `/api/stamps.php` (paged results; 25 items per page)
- `/api/filters.php` (distinct values for dropdowns)

These endpoints query MariaDB/MySQL (table name is configurable via `STAMPS_DB_TABLE`) and return JSON to the browser.

Configure connection via environment variables:

- `STAMPS_DB_HOST` (e.g. `localhost`)
- `STAMPS_DB_PORT` (optional; default `3306`)
- `STAMPS_DB_NAME`
- `STAMPS_DB_USER`
- `STAMPS_DB_PASS`

Or provide a full DSN:

- `STAMPS_DB_DSN` (e.g. `mysql:host=HOST;port=3306;dbname=DBNAME;charset=utf8mb4`)

Alternatively (common on shared hosting), use a server-side config file:

- Production server: copy [api/db.config.php.example](api/db.config.php.example) to `api/db.config.php`
- Local dev with `php -S`: copy [api/db.local.php.example](api/db.local.php.example) to `api/db.local.php`

Both files are ignored by git.

### Offline editing workflow (SQLite)

SQLite can be used as an editing/source-of-truth format for bulk updates and exports.

- Import JS dataset → SQLite:
  - [tools/import_usa_js_to_sqlite.py](tools/import_usa_js_to_sqlite.py)
- Export SQLite → JSON for the browser:
  - [tools/export_stamps_json.py](tools/export_stamps_json.py)

Example (from repo root):

```bash
python3 tools/import_usa_js_to_sqlite.py --input /path/to/USA.js --db data/stamps.sqlite3 --table stamps --country "United States" --replace
python3 tools/export_stamps_json.py --db data/stamps.sqlite3 --table stamps --out stamps/data/stamps.json
```

Note: `stamps/data/stamps.json` is an optional export artifact and is not required for the live site. The live site uses the `/api/*.php` endpoints at runtime.

### MariaDB / MySQL (phpMyAdmin)

This repo’s live `/api/*.php` endpoints are designed to run on the same server as the website and query a MariaDB/MySQL table (default: `stamps_mariadb`, configurable via `STAMPS_DB_TABLE`).

Important: the browser cannot connect directly to MariaDB. The browser only calls the `/api/*.php` endpoints.

#### Create the table

Run this SQL in phpMyAdmin (or any MySQL client):

- [tools/mariadb/create_stamps_table.sql](tools/mariadb/create_stamps_table.sql)

Note: the MariaDB `price` column is stored as a dollar amount (e.g. `0.47`).

#### Export a CSV for MariaDB

From repo root:

```bash
python3 tools/export_stamps_mariadb_csv.py --db data/stamps.sqlite3 --table stamps --out data/stamps_mariadb.csv
```

#### Import into MariaDB with phpMyAdmin

1. phpMyAdmin → select your database
2. Run the “Create the table” SQL above
3. Click the `stamps` table → Import tab
4. Choose `data/stamps_mariadb.csv`
5. Format: CSV
6. Enable “The first line of the file contains the table column names”
7. Run the import

### Data model

Each stamp inventory row is an object like:

```js
{
	country: "United States",
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

`contact.php` posts to Formspree and redirects to `thanks.php`.

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
- `site_map.php` is the human-readable site map

When you add/remove a public page, update both `site_map.php` and `sitemap.xml` (and consider updating `robots.txt` if it’s a utility/thank-you page).

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
5. Add to `site_map.php` and `sitemap.xml` if it’s public

### Updating the stamp inventory

- Use the admin entry page to add/update/delete stamps, or edit the backing database table directly.
- The stamps UI loads inventory via the `/api/*.php` endpoints at runtime.

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
