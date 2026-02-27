/**
 * Generates the HTML markup for the GIF upload page.
 *
 * @returns {string} HTML string representing the upload view.
 */
export const uploadView = () => `
  <section class="upload-section">
    <h2 class="section-title">Upload GIF</h2>

    <div class="upload-dropzone">
      <div class="upload-dropzone-icon">🎞️</div>
      <label for="gif-upload-input">Choose a GIF file to upload</label>
      <input type="file" id="gif-upload-input" accept="image/gif" />
      <button type="button" class="upload-file-btn" id="choose-file-btn">
        Choose File
      </button>
      <div class="file-name-display" id="file-name-display"></div>
    </div>

    <button id="upload-gif-btn">Upload</button>

    <p id="upload-status"></p>

    <div id="uploaded-gif"></div>
  </section>
`;
