import { EMPTY_HEART, FULL_HEART } from '../common/constants.js';

/**
 * Generates the HTML markup for a single trending GIF card.
 *
 * @param {Object} gif - The GIF object returned from the Giphy API.
 * @param {boolean} isFavorite - Whether the GIF is in favorites.
 * @returns {string} HTML string representing a GIF card.
 */
export const toTrendingView = (gif, isFavorite = false) => `
  <div class="gif-card" data-gif-id="${gif.id}">
    <img
      src="${gif.images.fixed_height.url}"
      alt="${gif.title}"
      class="img-fluid"
    />
    <button
      class="btn btn-sm btn-outline-warning mt-1 toggle-favorite-btn"
      data-gif-id="${gif.id}"
      aria-label="${isFavorite ? 'Remove from favorites' : 'Add to favorites'}"
    >
      ${isFavorite ? FULL_HEART : EMPTY_HEART}
    </button>
  </div>
`;
