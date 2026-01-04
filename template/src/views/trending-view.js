import { favoriteButtonView } from "./heart-view.js";

/**
 * Generates the HTML markup for a single trending GIF card.
 *
 * @param {Object} gif - The GIF object returned from the Giphy API.
 * @param {boolean} isFavorite - Whether the GIF is in favorites.
 * @returns {string} HTML string representing a GIF card.
 */
export const toTrendingView = (gif, isFavorite = false) => `
  <div class="gif-card" data-gif-id="${gif.id}" data-action="open-details">
    <img
      src="${gif.images.fixed_height.url}"
      alt="${gif.title}"
      class="img-fluid"
    />
    ${favoriteButtonView(gif.id, isFavorite)}
  </div>
`;
