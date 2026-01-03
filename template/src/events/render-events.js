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
import { CONTAINER_SELECTOR } from "../common/constants.js";
import { getUploadedGifs } from "../data/uploaded-gifs.js";
import { toUploadedView } from "../views/uploaded-view.js";
import { getFavoriteGifIds } from "../data/favorites.js";
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
      <div class="container-md">
        <div class="py-2 text-center">
          <h5 class="m-0">Search results for: <span class="text-muted">"${query}"</span></h5>
        </div>
      </div>
    `
      : "";

  container.innerHTML = `
    ${headerHtml}
    <div class="container-md d-flex justify-content-center flex-wrap gap-2" id="gif-grid">
      <div class="column" style="flex: 0 0 200px;" id="col-1"></div>
      <div class="column" style="flex: 0 0 200px;" id="col-2"></div>
      <div class="column" style="flex: 0 0 200px;" id="col-3"></div>
      <div class="column" style="flex: 0 0 200px;" id="col-4"></div>
    </div>
  `;

  renderedCount = 0;
};

/**
 * Appends an array of GIF objects into the 4 columns, distributing evenly.
 *
 * @param {Array<Object>} gifs
 * @returns {void}
 */
const appendGifsToColumns = (gifs) => {
  const columns = [[], [], [], []];
  const favoriteIds = new Set(getFavoriteGifIds());

  gifs.forEach((gif, i) => {
    const columnIndex = (renderedCount + i) % 4;
    columns[columnIndex].push(toTrendingView(gif, favoriteIds.has(gif.id)));
  });

  columns.forEach((colGifs, index) => {
    const col = q(`#col-${index + 1}`);
    if (!col) {
      return;
    }
    col.insertAdjacentHTML("beforeend", colGifs.join(""));
  });

  renderedCount += gifs.length;
};

/**
 * Loads the next page of GIFs based on the active grid mode.
 *
 * @returns {void}
 */
const loadMoreGridGifs = () => {
  if (activeGridMode === "none") {
    return;
  }
  if (isLoading) {
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
        // Empty state for the first page only
        q(CONTAINER_SELECTOR).insertAdjacentHTML(
          "beforeend",
          '<p class="text-center text-muted mt-3">No GIFs found.</p>'
        );
        return;
      }

      appendGifsToColumns(gifs);
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
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
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
  // ensure we don't keep multiple listeners around
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
  activeGridMode = "none";
  activeSearchQuery = "";
  renderedCount = 0;

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
 * Exits the Trending page (kept for compatibility with older code).
 *
 * @returns {void}
 */
export const exitTrending = () => {
  if (activeGridMode === "trending") {
    exitGridMode();
  }
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
 * Exits the Search view if active.
 *
 * @returns {void}
 */
export const exitSearch = () => {
  if (activeGridMode === "search") {
    exitGridMode();
  }
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

  loadGifsByIds(ids).then((res) => {
    const favoriteIds = new Set(getFavoriteGifIds());
    const gifsHtml = (res?.data || [])
      .map((gif) => toTrendingView(gif, favoriteIds.has(gif.id)))
      .join("");

    q(CONTAINER_SELECTOR).innerHTML = toUploadedView(gifsHtml);
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

  loadGifById(gifId).then((res) => {
    const gif = res?.data;

    if (!gif) {
      q(CONTAINER_SELECTOR).innerHTML = "<p>GIF not found.</p>";
      return;
    }

    q(CONTAINER_SELECTOR).innerHTML = gifDetailsView(gif);
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
  if (e.target.id === "back-btn") {
    // Keep the UX simple: back goes to Trending.
    const searchInput = document.querySelector("#search");
    if (searchInput) {
      searchInput.value = "";
    }
    renderTrending();
    return;
  }

  const actionEl = e.target.closest("[data-action]");
  if (!actionEl) {
    return;
  }

  if (actionEl.dataset.action !== "open-details") {
    return;
  }

  const gifId = actionEl.dataset.gifId;
  if (!gifId) {
    return;
  }

  renderGifDetails(gifId);
});

/**
 * Gets a usable GIF URL from a Random endpoint GIF object.
 *
 * @param {Object} gif - Random endpoint GIF object.
 * @returns {string} A GIF URL.
 */
const getRandomGifUrl = (gif) => {
  return (
    gif?.images?.fixed_height?.url ||
    gif?.images?.original?.url ||
    gif?.image_url ||
    gif?.image_original_url ||
    gif?.image_fixed_height_url ||
    ""
  );
};

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
    // Show a random GIF when there are no favorites yet.
    loadRandomGif().then((res) => {
      const randomGif = res?.data;

      if (!randomGif?.id) {
        return;
      }

      // Re-render so the random GIF shows under the message.
      q(CONTAINER_SELECTOR).innerHTML = toFavoritesView(
        "You have no favorites yet. Here is a random one:"
      );

      const favoriteIds = new Set(getFavoriteGifIds());

      // Normalize random gif data for the card (ensure fixed_height.url exists)
      const url = getRandomGifUrl(randomGif);
      const normalized = {
        ...randomGif,
        images: {
          ...(randomGif.images || {}),
          fixed_height: {
            ...(randomGif.images?.fixed_height || {}),
            url,
          },
        },
        title: randomGif?.title || "Random GIF",
      };

      const gifHtml = toTrendingView(
        normalized,
        favoriteIds.has(normalized.id)
      );

      const firstCol = q("#favorites-col-1");
      if (firstCol) {
        firstCol.insertAdjacentHTML("beforeend", gifHtml);
      }
    });

    return;
  }

  loadGifsByIds(favoriteIdsArr).then((res) => {
    const favoriteIds = new Set(getFavoriteGifIds());
    const gifs = res?.data || [];

    const columns = [[], [], [], []];

    gifs.forEach((gif, i) => {
      const columnIndex = i % 4;
      columns[columnIndex].push(toTrendingView(gif, favoriteIds.has(gif.id)));
    });

    columns.forEach((colGifs, index) => {
      const col = q(`#favorites-col-${index + 1}`);
      if (!col) {
        return;
      }
      col.insertAdjacentHTML("beforeend", colGifs.join(""));
    });
  });
};
