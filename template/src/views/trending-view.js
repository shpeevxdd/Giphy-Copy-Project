/**
 * Generates the HTML markup for a single trending GIF card.
 *
 * @param {Object} gif - The GIF object returned from the Giphy API.
 * @returns {string} HTML string representing a GIF card.
 */
export const toTrendingView = (gif) => `
  <div class="gif-card">
    <img
      src="${gif.images.fixed_height.url}"
      alt="${gif.title}"
      class="img-fluid"
    />
  </div>
`;
