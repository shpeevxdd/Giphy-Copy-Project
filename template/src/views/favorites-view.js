/**
 * Generates the HTML markup for the Favorites page.
 *
 * @param {string} message - Optional message shown above the GIFs.
 * @returns {string} HTML string for the favorites page.
 */
export const toFavoritesView = (message = '') => `
  <section class="favorites">
    <h2>Favorites</h2>
    ${message ? `<p class="text-warning">${message}</p>` : ''}
    <div class="container-md d-flex justify-content-center flex-wrap gap-2" id="favorites">
      <div class="column" style="flex: 0 0 200px;" id="favorites-col-1"></div>
      <div class="column" style="flex: 0 0 200px;" id="favorites-col-2"></div>
      <div class="column" style="flex: 0 0 200px;" id="favorites-col-3"></div>
      <div class="column" style="flex: 0 0 200px;" id="favorites-col-4"></div>
    </div>
  </section>
`;
