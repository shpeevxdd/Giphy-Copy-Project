/**
 * Generates the HTML markup for the uploaded GIFs page.
 *
 * @param {string} gifsHtml - Rendered GIF cards HTML.
 * @returns {string} HTML string for the uploaded GIFs view.
 */
export const toUploadedView = (gifsHtml) => `
  <section class="uploaded">
    <div class="container-md text-center">
      <h2>My Uploaded GIFs</h2>
      <div class="gifs-container">
        ${gifsHtml || "<p>No uploaded GIFs yet.</p>"}
      </div>
    </div>
  </section>
`;
