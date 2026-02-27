/**
 * Generates the HTML markup for the uploaded GIFs page.
 *
 * @param {string} gifsHtml - Rendered GIF cards HTML.
 * @returns {string} HTML string for the uploaded GIFs view.
 */
export const toUploadedView = (gifsHtml) => `
  <section class="uploaded">
    <h2 class="section-title">My Uploads</h2>
    <div class="uploaded-grid gifs-container">
      ${gifsHtml || '<p class="empty-state">No uploaded GIFs yet.</p>'}
    </div>
  </section>
`;
