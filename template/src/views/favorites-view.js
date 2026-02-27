/**
 * Generates the HTML markup for the Favorites page.
 *
 * @param {string} message - Optional message shown above the GIFs.
 * @returns {string} HTML string for the favorites page.
 */
export const toFavoritesView = (message = "") => `
  <section class="favorites">
    <h2 class="section-title">Favorites</h2>
    ${message ? `<p class="section-subtitle">${message}</p>` : ""}
    <div id="favorites">
      <div class="column" id="favorites-col-1"></div>
      <div class="column" id="favorites-col-2"></div>
      <div class="column" id="favorites-col-3"></div>
      <div class="column" id="favorites-col-4"></div>
    </div>
  </section>
`;
