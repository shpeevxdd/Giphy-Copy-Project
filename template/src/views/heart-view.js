import { EMPTY_HEART, FULL_HEART } from "../common/constants.js";

/**
 * Generates a favorite (heart) button for a GIF.
 *
 * @param {string} gifId - The GIF ID.
 * @param {boolean} isFavorite - Whether the GIF is in favorites.
 * @returns {string} HTML string for the favorite button.
 */
export const favoriteButtonView = (gifId, isFavorite = false) => `
  <button
    class="btn btn-sm btn-dark mt-1 toggle-favorite-btn position"
    data-gif-id="${gifId}"
    data-action="toggle-favorite"
    aria-label="${isFavorite ? "Remove from favorites" : "Add to favorites"}"
  >
    ${isFavorite ? FULL_HEART : EMPTY_HEART}
  </button>
`;