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
 * Loads trending GIFs from the API and renders them in the main container.
 *
 * @returns {void}
 */
export const renderTrending = () => {
  loadTrending().then(res => {
    const gifsHtml = res.data
      .map(gif => toTrendingView(gif))
      .join('');

    q(CONTAINER_SELECTOR).innerHTML = gifsHtml;
  });
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

  loadGifsByIds(ids).then(res => {
    const gifsHtml = res.data
      .map(gif => toTrendingView(gif))
      .join('');

    q(CONTAINER_SELECTOR).innerHTML = toUploadedView(gifsHtml);
  });
};
