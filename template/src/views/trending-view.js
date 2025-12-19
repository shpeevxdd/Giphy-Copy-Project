/**
 * Generates the HTML markup for a single trending GIF card.
 *
 * @param {Object} gif - The GIF object returned from the Giphy API.
 * @returns {string} HTML string representing a GIF card.
 */
export const toTrendingView = (gif) => `
  <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
    <div class="gif-card">
      <img
        src="${gif.images.fixed_height.url}"
        alt="${gif.title}"
        class="img-fluid"
      />
    </div>
  </div>
`;
