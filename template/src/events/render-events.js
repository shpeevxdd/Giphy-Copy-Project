import {
  loadGifById,
  loadRandomGif,
  loadTrending,
} from "../requests/request-service.js";
import { toTrendingView } from "../views/trending-view.js";
import { toAboutView } from "../views/about-view.js";
import { uploadView } from "../views/upload-view.js";
import { attachUploadEvents } from "./upload-events.js";
import { q } from "./helpers.js";
import { CONTAINER_SELECTOR } from "../common/constants.js";
import { loadGifsByIds } from "../requests/request-service.js";
import { getUploadedGifs } from "../data/uploaded-gifs.js";
import { toUploadedView } from "../views/uploaded-view.js";
import { getFavoriteGifIds } from "../data/favorites.js";
import { toFavoritesView } from "../views/favorites-view.js";
import { gifDetailsView } from "../views/gif-detail-view.js";

/**
 * Tracks the total number of GIFs rendered in the Trending page so far.
 * @type {number}
 */
let renderedCount = 0;

/**
 * Indicates whether an API request is currently in progress to prevent duplicate requests.
 * @type {boolean}
 */
let isLoading = false;

/**
 * Flags whether the Trending page is currently active.
 * This is used to prevent GIF loading on other pages.
 * @type {boolean}
 */
let isTrendingActive = false;

/**
 * Renders the Trending layout inside the shared container.
 * Creates four columns for GIFs.
 * Resets renderedCount to zero.
 *
 * @returns {void}
 */
const renderTrendingLayout = () => {
  const container = q(CONTAINER_SELECTOR);

  container.innerHTML = `
    <div class="container-md d-flex justify-content-center flex-wrap gap-2" id="trending">
      <div class="column" style="flex: 0 0 200px;" id="col-1"></div>
      <div class="column" style="flex: 0 0 200px;" id="col-2"></div>
      <div class="column" style="flex: 0 0 200px;" id="col-3"></div>
      <div class="column" style="flex: 0 0 200px;" id="col-4"></div>
    </div>
  `;

  renderedCount = 0;
};

/**
 * Converts an array of GIF objects into HTML and appends them evenly to the four columns.
 *
 * @param {Array<Object>} gifs - Array of GIF objects from the API.
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
    col.insertAdjacentHTML("beforeend", colGifs.join(""));
  });

  renderedCount += gifs.length;
};

/**
 * Fetches more Trending GIFs from the API and appends them to the page.
 * Prevents multiple concurrent requests and ensures GIFs are only loaded on the active page.
 *
 * @returns {void}
 */
const loadMoreTrending = () => {
  if (!isTrendingActive) return;
  if (isLoading) return;

  isLoading = true;

  loadTrending(renderedCount)
    .then((res) => {
      appendGifsToColumns(res.data);
    })
    .finally(() => {
      isLoading = false;
    });
};

/**
 * Handles scrolling on the Trending page.
 * When user reaches near the bottom, loads more GIFs.
 *
 * @returns {void}
 */
const onTrendingScroll = () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
    loadMoreTrending();
  }
};

/**
 * Enters the Trending page.
 * Renders the layout, loads the first batch of GIFs, and attaches the scroll listener.
 *
 * @returns {void}
 */
export const renderTrending = () => {
  isTrendingActive = true;

  renderTrendingLayout();
  loadMoreTrending();

  window.addEventListener("scroll", onTrendingScroll);
};

/**
 * Exits the Trending page.
 * Marks the page as inactive, stops any loading in progress, and removes the scroll listener.
 *
 * @returns {void}
 */
export const exitTrending = () => {
  isTrendingActive = false;
  isLoading = false;

  window.removeEventListener("scroll", onTrendingScroll);
};

/**
 * Renders the About page content in the main container.
 *
 * @returns {void}
 */
export const renderAbout = () => {
  q(CONTAINER_SELECTOR).innerHTML = toAboutView();
};

/**
 * Renders the Upload page and attaches upload-related event listeners.
 *
 * @returns {void}
 */
export const renderUpload = () => {
  q(CONTAINER_SELECTOR).innerHTML = uploadView();
  attachUploadEvents();
};

/**
 * Loads and renders all uploaded GIFs stored in localStorage.
 *
 * @returns {void}
 */
export const renderUploaded = () => {
  const ids = getUploadedGifs();

  loadGifsByIds(ids).then((res) => {
    const favoriteIds = new Set(getFavoriteGifIds());
    const gifsHtml = res.data
      .map((gif) => toTrendingView(gif, favoriteIds.has(gif.id)))
      .join("");

    q(CONTAINER_SELECTOR).innerHTML = toUploadedView(gifsHtml);
  });
};

/**
 * Fetches a GIF by its ID and renders its details inside a container.
 *
 * @param {string} gifId - The unique identifier of the GIF to fetch and display.
 * @returns {void} This function does not return anything. It updates the DOM asynchronously.
 */
export const renderGifDetails = (gifId) => {
  loadGifById(gifId).then((res) => {
    const gif = res.data;

    if (!gif) {
      q(CONTAINER_SELECTOR).innerHTML = "<p>GIF not found.</p>";
      return;
    }

    q(CONTAINER_SELECTOR).innerHTML = gifDetailsView(gif);
  });
}

/**
 * Handles click events on the document to provide GIF-related interactions.
 *
 * - If the clicked element has an id of "back-btn", it renders trending GIFs.
 * - If the clicked element or its parent has a `data-action` attribute:
 *   - `"toggle-favorite"` toggles the GIF as favorite.
 *   - `"open-details"` opens the GIF details by calling `renderGifDetails`.
 *
 * @param {MouseEvent} e - The click event object.
 */
document.addEventListener("click", (e) => {

  if (e.target.id === "back-btn") {
    renderTrending();
    return;
  }

  const actionEl = e.target.closest("[data-action]");
  if (!actionEl) return;

  const gifId = actionEl.dataset.gifId;

  if (actionEl.dataset.action === "toggle-favorite") {
    e.stopPropagation();
    toggleFavorite(gifId);
    return;
  }

  if (actionEl.dataset.action === "open-details") {
    renderGifDetails(gifId);
  }
});

/**
 * Gets a usable GIF URL from a Random endpoint GIF object.
 *
 * @param {Object} gif - Random endpoint GIF object.
 * @returns {string} A GIF URL.
 */
const getRandomGifUrl = (gif) => {
  return gif?.images?.fixed_height?.url
    || gif?.images?.original?.url
    || gif?.image_url
    || gif?.image_original_url
    || gif?.image_fixed_height_url
    || '';
};

/**
 * Renders the Favorites page.
 * If the user has no favorites yet, shows a notification and a random GIF.
 *
 * @returns {void}
 */
export const renderFavorites = () => {
  const favoriteIdsArr = getFavoriteGifIds();

  q(CONTAINER_SELECTOR).innerHTML = toFavoritesView(
    favoriteIdsArr.length ? '' : 'You have no favorites yet.'
  );

  if (!favoriteIdsArr.length) {
    // Keep the previous behavior: show a random GIF when there are no favorites yet.
    loadRandomGif().then((res) => {
      const randomGif = res.data;

      if (!randomGif?.id) {
        return;
      }

      // Re-render so the random GIF shows under the message.
      q(CONTAINER_SELECTOR).innerHTML = toFavoritesView(
        'You have no favorites yet. Here is a random one:'
      );

      const favoriteIds = new Set(getFavoriteGifIds());
      const gifHtml = toTrendingView(randomGif, favoriteIds.has(randomGif.id));

      const columns = [[], [], [], []];
      columns[0].push(gifHtml);

      columns.forEach((colGifs, index) => {
        const col = q(`#favorites-col-${index + 1}`);
        col.insertAdjacentHTML("beforeend", colGifs.join(""));
      });
    });

    return;
  }

  loadGifsByIds(favoriteIdsArr).then((res) => {
    const favoriteIds = new Set(getFavoriteGifIds());
    const gifs = res.data;

    const columns = [[], [], [], []];

    gifs.forEach((gif, i) => {
      const columnIndex = i % 4;
      columns[columnIndex].push(toTrendingView(gif, favoriteIds.has(gif.id)));
    });

    columns.forEach((colGifs, index) => {
      const col = q(`#favorites-col-${index + 1}`);
      col.insertAdjacentHTML("beforeend", colGifs.join(""));
    });
  });
};
