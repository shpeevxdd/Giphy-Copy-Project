import { loadTrending } from '../requests/request-service.js';
import { toTrendingView } from '../views/trending-view.js';
import { toAboutView } from '../views/about-view.js';
import { uploadView } from '../views/upload-view.js';
import { attachUploadEvents } from './upload-events.js';
import { q } from './helpers.js';
import { CONTAINER_SELECTOR } from '../common/constants.js';
import { loadGifsByIds } from '../requests/request-service.js';
import { getUploadedGifs } from '../data/uploaded-gifs.js';
import { toUploadedView } from '../views/uploaded-view.js';


/** 
 * Tracks the total number of GIFs rendered so far.
 * @type {number} 
 */
let renderedCount = 0;


/** 
 * Flags whether an API request is currently in progress to prevent duplicate requests.
 * @type {boolean} 
 */
let isLoading = false;  


/**
 * Appends an array of GIFs to 4 columns evenly.
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
    const colId = `#col-${index + 1}`;
    q(colId).insertAdjacentHTML('beforeend', colGifs.join(''));
  });

  renderedCount += gifs.length;
};


/**
 * Fetches trending GIFs from the API and appends them to the page.
 * Prevents multiple concurrent requests.
 * 
 * @returns {void}
 */
export const renderTrending = () => {
  if (isLoading) return;
  isLoading = true;

  loadTrending(renderedCount).then(res => {
    appendGifsToColumns(res.data);
    isLoading = false;
  });
};

window.addEventListener('scroll', () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
    renderTrending();
  }
});


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

  loadGifsByIds(ids).then(res => {
    const gifsHtml = res.data
      .map(gif => toTrendingView(gif))
      .join('');

    q(CONTAINER_SELECTOR).innerHTML = toUploadedView(gifsHtml);
  });
};
