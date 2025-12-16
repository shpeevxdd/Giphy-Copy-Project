import { EMPTY_HEART, FULL_HEART } from '../common/constants.js';
import { getFavorites } from '../data/favorites.js';

/**
 * Returns the first DOM element that matches the given selector.
 *
 * @param {string} selector - A valid CSS selector.
 * @returns {Element|null} The matched element or null if none is found.
 */
export const q = (selector) => document.querySelector(selector);

/**
 * Returns a NodeList of all DOM elements matching the given selector.
 *
 * @param {string} selector - A valid CSS selector.
 * @returns {NodeListOf<Element>} A list of matched elements.
 */
export const qs = (selector) => document.querySelectorAll(selector);

/**
 * Sets the active navigation link based on the current page.
 *
 * @param {string} page - The current page identifier.
 * @returns {void}
 */
export const setActiveNav = (page) => {
  const navs = qs('a.nav-link');

  Array.from(navs).forEach(element =>
    element.getAttribute('data-page') === page
      ? element.classList.add('active')
      : element.classList.remove('active')
  );
};

/**
 * Renders the favorite icon markup based on the GIF's favorite status.
 *
 * @param {string} gifId - The unique identifier of the GIF.
 * @returns {string} HTML string representing the favorite icon.
 */
export const renderFavoriteStatus = (gifId) => {
  const favorites = getFavorites();

  return favorites.includes(gifId)
    ? `<span class="favorite active" data-gif-id="${gifId}">${FULL_HEART}</span>`
    : `<span class="favorite" data-gif-id="${gifId}">${EMPTY_HEART}</span>`;
};
