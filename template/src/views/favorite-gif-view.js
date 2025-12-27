/**
 * Generates the HTML markup for the Favorite GIF page.
 *
 * @param {string} message - Message shown above the GIF (optional).
 * @param {string} gifHtml - Rendered GIF HTML.
 * @returns {string} HTML string for the favorites page.
 */
export const toFavoriteGifView = (message, gifHtml) => `
  <section class="favorites">
    <h2>Favorite GIF</h2>
    ${message ? `<p class="text-warning">${message}</p>` : ''}
    <div class="favorite-gif">
      ${gifHtml}
    </div>
  </section>
`;
