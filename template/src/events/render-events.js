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
import { getFavoriteGifId } from "../data/favorite-gif.js";
import { toFavoriteGifView } from "../views/favorite-gif-view.js";

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
 * Renders the Trending page layout inside the shared container.
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

  gifs.forEach((gif, i) => {
    const columnIndex = (renderedCount + i) % 4;
    columns[columnIndex].push(toTrendingView(gif));
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

  loadTrending(renderedCount).then((res) => {
    if (!isTrendingActive) return;

    appendGifsToColumns(res.data);
    isLoading = false;
  });
};

/**
 * Scroll event handler for infinite scrolling on the Trending page.
 * Loads more GIFs when the user scrolls near the bottom.
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
export const leaveTrending = () => {
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
    const gifsHtml = res.data.map((gif) => toTrendingView(gif)).join("");

    q(CONTAINER_SELECTOR).innerHTML = toUploadedView(gifsHtml);
  });
};

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
 * Renders the Favorite GIF page.
 * If the user has no chosen favorite yet, shows a notification and a random GIF.
 *
 * @returns {void}
 */
export const renderFavoriteGif = () => {
  const favoriteId = getFavoriteGifId();

  if (!favoriteId) {
    loadRandomGif().then(res => {
      const randomGif = res.data;

      const gifUrl = getRandomGifUrl(randomGif);

      const gifHtml = gifUrl
        ? `<img src="${gifUrl}" alt="Random GIF" class="img-fluid" />`
        : `<p>Could not load a random GIF.</p>`;

      q(CONTAINER_SELECTOR).innerHTML = toFavoriteGifView(
        'You have not chosen a favorite GIF yet. Here is a random one:',
        gifHtml
      );
    });

    return;
  }

  loadGifById(favoriteId).then(res => {
    const gif = res.data;
    const gifHtml = `
      <img src="${gif.images.fixed_height.url}" alt="${gif.title}" class="img-fluid" />
    `;

    q(CONTAINER_SELECTOR).innerHTML = toFavoriteGifView('', gifHtml);
  });
};

