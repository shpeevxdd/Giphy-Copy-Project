# GIFHub

A lightweight single-page application for browsing, searching, favoriting, and uploading GIFs — built on the [GIPHY API](https://developers.giphy.com/).

No build tools, no frameworks — just vanilla JavaScript with ES modules served directly to the browser.

---

## Features

- **Trending Feed** — Infinite-scroll masonry grid of trending GIFs, balanced across 4 columns using virtual height tracking.
- **Search** — Real-time search against GIPHY's catalog with the same infinite-scroll grid.
- **Favorites** — Heart any GIF to save it locally. Favorites persist in `localStorage` and render on a dedicated page. An empty favorites page shows a random GIF suggestion.
- **Upload** — Upload `.gif` files to GIPHY directly from the browser. Uploaded GIF IDs are stored locally.
- **My Uploads** — View and delete your previously uploaded GIFs.
- **GIF Details** — Click any card to see a detail view with author, rating, and a favorite toggle.

---

## Project Structure

```
├── index.html                  # Entry point
├── styles/
│   └── main.css                # All styles (design tokens, layout, components, responsive)
├── assets/
│   └── giphy-icon.png          # Favicon / brand icon
├── src/
│   ├── index.js                # App bootstrap — attaches global listeners, loads home page
│   ├── common/
│   │   └── constants.js        # Page keys, selectors, API key, LIMIT, normalizeGif()
│   ├── data/
│   │   ├── favorites.js        # localStorage CRUD for favorite GIF IDs
│   │   └── uploaded-gifs.js    # localStorage CRUD for uploaded GIF IDs
│   ├── events/
│   │   ├── helpers.js          # DOM helpers: q(), qs(), setActiveNav()
│   │   ├── navigation-events.js# Page router (loadPage switch)
│   │   ├── render-events.js    # Core rendering: grid, masonry, infinite scroll, detail view
│   │   ├── search-events.js    # Search input + button listeners
│   │   ├── favorites-events.js # Heart toggle logic + empty-state random GIF
│   │   ├── upload-events.js    # File picker + GIPHY upload handler
│   │   └── uploaded-events.js  # Delete buttons + MutationObserver for uploads page
│   ├── requests/
│   │   └── request-service.js  # All GIPHY API calls (trending, search, upload, getById, random)
│   └── views/
│       ├── trending-view.js    # GIF card template
│       ├── gif-detail-view.js  # Detail page template
│       ├── heart-view.js       # Favorite button template
│       ├── favorites-view.js   # Favorites page shell
│       ├── upload-view.js      # Upload page template
│       ├── uploaded-view.js    # My Uploads page template
│       └── about-view.js       # About page template
├── package.json                # Dev tooling (ESLint + Prettier)
├── eslint.config.mjs           # ESLint flat config
└── README.md
```

---

## Getting Started

### Prerequisites

- A modern browser (Chrome, Firefox, Safari, Edge)
- Any static file server

### Run Locally

The app uses native ES modules (`type="module"`) so it must be served over HTTP, not opened as a `file://` URL.

**Option 1 — VS Code Live Server:**
Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension, open the project folder, and click "Go Live".

**Option 2 — Node one-liner:**
```bash
npx serve .
```

**Option 3 — Python:**
```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080` (or whichever port your server uses).

### Linting & Formatting

```bash
npm install          # install dev dependencies
npm run lint         # check for issues
npm run lint:fix     # auto-fix issues
npm run format       # format with Prettier
npm run format:check # check formatting without writing
```

---

## API

The app uses the [GIPHY API v1](https://developers.giphy.com/docs/api/) with a public beta key included in the source. Endpoints used:

| Endpoint | Purpose |
|---|---|
| `GET /v1/gifs/trending` | Trending feed with offset pagination |
| `GET /v1/gifs/search` | Keyword search with offset pagination |
| `GET /v1/gifs/{id}` | Single GIF detail |
| `GET /v1/gifs` | Batch fetch by IDs (favorites, uploads) |
| `GET /v1/gifs/random` | Random GIF for empty favorites state |
| `POST upload.giphy.com/v1/gifs` | File upload |

> **Note:** The included API key is GIPHY's public beta key. It has rate limits. For production use, register your own key at [developers.giphy.com](https://developers.giphy.com/).

---

## Architecture Notes

**No build step.** All JavaScript is authored as ES modules and loaded natively by the browser. No bundler, no transpilation.

**Masonry layout.** The 4-column grid uses virtual height tracking rather than CSS masonry or DOM measurement. Each GIF's display height is estimated from its API-provided dimensions (`height / width × columnWidth`), and new GIFs are always placed into the shortest column. This avoids layout shifts from unloaded images.

**Infinite scroll.** A `scroll` event listener triggers the next API page when the user is within 800px of the page bottom. A `hasMore` flag stops requests once the API returns fewer results than the page size (`LIMIT = 25`), which happens when GIPHY's offset cap (~5000) is reached.

**State management.** App state lives in module-scoped variables (`activeGridMode`, `renderedCount`, `columnHeights`, `hasMore`, `isLoading`). Favorites and uploads persist in `localStorage`. No global variables are exposed.

**Event delegation.** Click handlers for GIF cards, favorites, and navigation are all delegated from `document` using `data-action` and `data-page` attributes, avoiding per-element listener attachment.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Language | Vanilla JavaScript (ES2021+ modules) |
| Styling | Custom CSS with design tokens (CSS variables) |
| Layout | Flexbox with virtual masonry |
| UI Framework | Bootstrap 5.3 (grid utilities + base reset only) |
| Typography | DM Sans + Bricolage Grotesque (Google Fonts) |
| API | GIPHY API v1 |
| Linting | ESLint 9 (flat config) |
| Formatting | Prettier 3 |

---

## License

This project is for educational purposes. The GIPHY API is subject to [GIPHY's Terms of Service](https://giphy.com/terms).
