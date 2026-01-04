/**
 * Generates the HTML markup for the GIF upload page.
 *
 * @returns {string} HTML string representing the upload view.
 */
export const uploadView = () => `
  <section class="upload">
    <div class="container-md text-center">
      <h2>Upload GIF</h2>

      <input type="file" id="gif-upload-input" accept="image/gif" />
      <button id="upload-gif-btn">Upload</button>

      <p id="upload-status"></p>

      <div id="uploaded-gif"></div>
    </div>
  </section>
`;
