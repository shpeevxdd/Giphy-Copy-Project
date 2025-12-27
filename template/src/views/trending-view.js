/**
 * Generates the HTML markup for a single trending GIF card.
 *
 * @param {Object} gif - The GIF object returned from the Giphy API.
 * @returns {string} HTML string representing a GIF card.
 */
export const toTrendingView = (gif) => `
  <div class="gif-card" data-gif-id="${gif.id}">
    <img
      src="${gif.images.fixed_height.url}"
      alt="${gif.title}"
      class="img-fluid"
    />
    <button class="btn btn-sm btn-outline-warning mt-1 set-favorite-btn" data-gif-id="${gif.id}">
      Set as Favorite
    </button>
  </div>
`;
