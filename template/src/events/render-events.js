import {
  loadGifById,
  loadRandomGif,
  loadTrending,
  searchGifs,
  loadGifsByIds,
} from "../requests/request-service.js";
import { toTrendingView } from "../views/trending-view.js";
import { toAboutView } from "../views/about-view.js";
import { uploadView } from "../views/upload-view.js";
import { attachUploadEvents } from "./upload-events.js";
import { q } from "./helpers.js";
import { CONTAINER_SELECTOR, LIMIT, normalizeGif } from "../common/constants.js";
import { getUploadedGifs } from "../data/uploaded-gifs.js";
import { toUploadedView } from "../views/uploaded-view.js";
import { getFavoriteGifIds, isFavoriteGifId } from "../data/favorites.js";
import { toFavoritesView } from "../views/favorites-view.js";
import { gifDetailsView } from "../views/gif-detail-view.js";

/**
 * Current "grid" mode.
 * - 'trending': trending endpoint with infinite scroll
 * - 'search': search endpoint with infinite scroll
 *
 * @type {'trending' | 'search' | 'none'}
 */
let activeGridMode = "none";

/**
 * Current search query (only used when activeGridMode === 'search').
 * @type {string}
 */
let activeSearchQuery = "";

/**
 * Tracks how many GIFs have been rendered in the active grid.
 * Used as offset for the next request.
 * @type {number}
 */
let renderedCount = 0;

/**
 * Prevents overlapping requests when scrolling.
 * @type {boolean}
 */
let isLoading = false;

/**
 * Whether there are more GIFs to load from the API.
 * Set to false when the API returns fewer results than LIMIT.
 * @type {boolean}
 */
let hasMore = true;

/**
 * Tracks the estimated pixel height of each column.
 * Used for masonry placement since DOM offsetHeight is unreliable
 * (images haven't loaded when we measure).
 * @type {number[]}
 */
let columnHeights = [0, 0, 0, 0];

/**
 * Returns a simple loading indicator HTML string.
 *
 * @returns {string}
 */
const loadingHtml = () => `
  <div class="loading-indicator">
    <div class="loading-dots">
      <span></span><span></span><span></span>
    </div>
  </div>
`;

/**
 * Renders a reusable 4-column GIF grid layout into the shared container.
 *
 * @param {Object} opts
 * @param {('trending'|'search')} opts.mode
 * @param {string} [opts.query]
 * @returns {void}
 */
const renderGridLayout = ({ mode, query = "" }) => {
  const container = q(CONTAINER_SELECTOR);

  const headerHtml =
    mode === "search"
      ? `
      <div class="search-results-label">
        <h5>Search results for: <span class="query-text">"${query}"</span></h5>
      </div>
    `
      : "";

  container.innerHTML = `
    ${headerHtml}
    <div id="gif-grid">
      <div class="column" id="col-1"></div>
      <div class="column" id="col-2"></div>
      <div class="column" id="col-3"></div>
      <div class="column" id="col-4"></div>
    </div>
  `;

  renderedCount = 0;
};

/**
 * Gets the estimated display height for a GIF based on its API dimensions.
 * Since images render at width: 100% of the column, the displayed height is
 * proportional to the aspect ratio (height / width). We use a base width of
 * 240 (matching --col-width) to get a pixel estimate, plus a gap.
 *
 * @param {Object} gif - GIF object from the API.
 * @returns {number} Estimated rendered height in pixels.
 */
const estimateGifHeight = (gif) => {
  const img = gif?.images?.fixed_height;
  const w = parseInt(img?.width, 10) || 200;
  const h = parseInt(img?.height, 10) || 200;
  // 240 = base column width, 12 = gap between cards
  return (h / w) * 240 + 12;
};

/**
 * Appends an array of GIF objects into the 4 columns, always placing each
 * GIF into the currently shortest column (by tracked virtual height) for a
 * balanced masonry layout.
 *
 * We track heights mathematically rather than reading the DOM because images
 * haven't loaded when we insert them, so offsetHeight would be unreliable.
 *
 * @param {Array<Object>} gifs
 * @returns {void}
 */
const appendGifsToColumns = (gifs) => {
  const favoriteIds = new Set(getFavoriteGifIds());
  const colEls = [q("#col-1"), q("#col-2"), q("#col-3"), q("#col-4")];

  if (colEls.some((c) => !c)) {
    return;
  }

  gifs.forEach((gif) => {
    // Find the shortest column by tracked height
    let shortest = 0;
    for (let i = 1; i < columnHeights.length; i++) {
      if (columnHeights[i] < columnHeights[shortest]) {
        shortest = i;
      }
    }

    const html = toTrendingView(gif, favoriteIds.has(gif.id));
    colEls[shortest].insertAdjacentHTML("beforeend", html);
    columnHeights[shortest] += estimateGifHeight(gif);
  });

  renderedCount += gifs.length;
};

/**
 * Loads the next page of GIFs based on the active grid mode.
 *
 * @returns {void}
 */
const loadMoreGridGifs = () => {
  if (activeGridMode === "none" || isLoading || !hasMore) {
    return;
  }

  isLoading = true;

  const request =
    activeGridMode === "trending"
      ? loadTrending(renderedCount)
      : searchGifs(activeSearchQuery, renderedCount);

  request
    .then((res) => {
      const gifs = res?.data || [];

      if (!gifs.length && renderedCount === 0) {
        q(CONTAINER_SELECTOR).insertAdjacentHTML(
          "beforeend",
          '<p class="empty-state">No GIFs found.</p>'
        );
        hasMore = false;
        return;
      }

      if (gifs.length < LIMIT) {
        hasMore = false;
      }

      if (gifs.length) {
        appendGifsToColumns(gifs);
      }
    })
    .catch(() => {
      if (renderedCount === 0) {
        q(CONTAINER_SELECTOR).insertAdjacentHTML(
          "beforeend",
          '<p class="empty-state">Failed to load GIFs. Please try again.</p>'
        );
      }
      hasMore = false;
    })
    .finally(() => {
      isLoading = false;
    });
};

/**
 * Handles scrolling while the grid (Trending/Search) is active.
 *
 * @returns {void}
 */
const onGridScroll = () => {
  const scrollBottom = window.innerHeight + window.scrollY;
  const pageHeight = document.documentElement.scrollHeight;

  if (scrollBottom >= pageHeight - 800) {
    loadMoreGridGifs();
  }
};

/**
 * Starts (or restarts) the grid mode.
 *
 * @param {'trending'|'search'} mode
 * @param {string} [query]
 * @returns {void}
 */
const enterGridMode = (mode, query = "") => {
  exitGridMode();

  activeGridMode = mode;
  activeSearchQuery = query;

  renderGridLayout({ mode, query });
  loadMoreGridGifs();

  window.addEventListener("scroll", onGridScroll);
};

/**
 * Stops the grid mode (Trending/Search) and removes listeners.
 *
 * @returns {void}
 */
const exitGridMode = () => {
  isLoading = false;
  hasMore = true;
  activeGridMode = "none";
  activeSearchQuery = "";
  renderedCount = 0;
  columnHeights = [0, 0, 0, 0];

  window.removeEventListener("scroll", onGridScroll);
};

/**
 * Enters the Trending page (infinite scroll).
 *
 * @returns {void}
 */
export const renderTrending = () => {
  enterGridMode("trending");
};

/**
 * Renders search results (infinite scroll) for a given query.
 *
 * @param {string} query
 * @returns {void}
 */
export const renderSearch = (query) => {
  const qTrim = (query || "").trim();
  if (!qTrim) {
    renderTrending();
    return;
  }

  enterGridMode("search", qTrim);
};

/**
 * Renders the About page content in the main container.
 *
 * @returns {void}
 */
export const renderAbout = () => {
  exitGridMode();
  q(CONTAINER_SELECTOR).innerHTML = toAboutView();
};

/**
 * Renders the Upload page and attaches upload-related event listeners.
 *
 * @returns {void}
 */
export const renderUpload = () => {
  exitGridMode();
  q(CONTAINER_SELECTOR).innerHTML = uploadView();
  attachUploadEvents();
};

/**
 * Loads and renders all uploaded GIFs stored in localStorage.
 *
 * @returns {void}
 */
export const renderUploaded = () => {
  exitGridMode();

  const ids = getUploadedGifs();

  if (!ids.length) {
    q(CONTAINER_SELECTOR).innerHTML = toUploadedView("");
    return;
  }

  q(CONTAINER_SELECTOR).innerHTML = loadingHtml();

  loadGifsByIds(ids)
    .then((res) => {
      const favoriteIds = new Set(getFavoriteGifIds());
      const gifsHtml = (res?.data || [])
        .map((gif) => toTrendingView(gif, favoriteIds.has(gif.id)))
        .join("");

      q(CONTAINER_SELECTOR).innerHTML = toUploadedView(gifsHtml);
    })
    .catch(() => {
      q(CONTAINER_SELECTOR).innerHTML = toUploadedView(
        '<p class="empty-state">Failed to load uploads.</p>'
      );
    });
};

/**
 * Fetches a GIF by its ID and renders its details inside a container.
 *
 * @param {string} gifId - The unique identifier of the GIF to fetch and display.
 * @returns {void}
 */
export const renderGifDetails = (gifId) => {
  exitGridMode();

  q(CONTAINER_SELECTOR).innerHTML = loadingHtml();

  loadGifById(gifId)
    .then((res) => {
      const gif = res?.data;

      if (!gif) {
        q(CONTAINER_SELECTOR).innerHTML =
          '<p class="empty-state">GIF not found.</p>';
        return;
      }

      const isFav = isFavoriteGifId(gifId);
      q(CONTAINER_SELECTOR).innerHTML = gifDetailsView(gif, isFav);
    })
    .catch(() => {
      q(CONTAINER_SELECTOR).innerHTML =
        '<p class="empty-state">Failed to load GIF details.</p>';
    });
};

/**
 * Handles click events on the document for:
 * - Back button in GIF details
 * - Opening GIF details from a GIF card
 *
 * Favorites toggling is handled in favorites-events.js.
 *
 * @param {MouseEvent} e
 * @returns {void}
 */
document.addEventListener("click", (e) => {
  if (e.target.id === "back-btn" || e.target.closest("#back-btn")) {
    const searchInput = document.querySelector("#search");
    if (searchInput) {
      searchInput.value = "";
    }
    renderTrending();
    return;
  }

  const actionEl = e.target.closest("[data-action]");
  if (!actionEl || actionEl.dataset.action !== "open-details") {
    return;
  }

  const gifId = actionEl.dataset.gifId;
  if (!gifId) {
    return;
  }

  renderGifDetails(gifId);
});

/**
 * Renders the Favorites page.
 * If the user has no favorites yet, shows a notification and a random GIF.
 *
 * @returns {void}
 */
export const renderFavorites = () => {
  exitGridMode();

  const favoriteIdsArr = getFavoriteGifIds();

  q(CONTAINER_SELECTOR).innerHTML = toFavoritesView(
    favoriteIdsArr.length ? "" : "You have no favorites yet."
  );

  if (!favoriteIdsArr.length) {
    loadRandomGif()
      .then((res) => {
        const randomGif = res?.data;

        if (!randomGif?.id) {
          return;
        }

        q(CONTAINER_SELECTOR).innerHTML = toFavoritesView(
          "You have no favorites yet. Here is a random one:"
        );

        const favoriteIds = new Set(getFavoriteGifIds());
        const normalized = normalizeGif(randomGif);

        const gifHtml = toTrendingView(
          normalized,
          favoriteIds.has(normalized.id)
        );

        const firstCol = q("#favorites-col-1");
        if (firstCol) {
          firstCol.insertAdjacentHTML("beforeend", gifHtml);
        }
      })
      .catch(() => {
        /* silently degrade — empty favorites state is already shown */
      });

    return;
  }

  loadGifsByIds(favoriteIdsArr)
    .then((res) => {
      const favoriteIds = new Set(getFavoriteGifIds());
      const gifs = res?.data || [];
      const colEls = [
        q("#favorites-col-1"),
        q("#favorites-col-2"),
        q("#favorites-col-3"),
        q("#favorites-col-4"),
      ];

      if (colEls.some((c) => !c)) {
        return;
      }

      const favColHeights = [0, 0, 0, 0];

      gifs.forEach((gif) => {
        let shortest = 0;
        for (let i = 1; i < favColHeights.length; i++) {
          if (favColHeights[i] < favColHeights[shortest]) {
            shortest = i;
          }
        }

        const html = toTrendingView(gif, favoriteIds.has(gif.id));
        colEls[shortest].insertAdjacentHTML("beforeend", html);
        favColHeights[shortest] += estimateGifHeight(gif);
      });
    })
    .catch(() => {
      q(CONTAINER_SELECTOR).innerHTML = toFavoritesView(
        "Failed to load favorites."
      );
    });
};
