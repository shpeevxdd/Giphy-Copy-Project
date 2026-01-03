import { uploadGif } from "../requests/request-service.js";
import { addUploadedGif } from "../data/uploaded-gifs.js";

/**
 * Attaches event listeners for the GIF upload functionality.
 * Handles file selection, upload request, status messages,
 * and rendering the uploaded GIF preview.
 *
 * @returns {void}
 */
export const attachUploadEvents = () => {
  const uploadBtn = document.getElementById("upload-gif-btn");
  const fileInput = document.getElementById("gif-upload-input");
  const status = document.getElementById("upload-status");
  const gifContainer = document.getElementById("uploaded-gif");

  uploadBtn.addEventListener("click", () => {
    const file = fileInput.files[0];

    if (!file) {
      status.textContent = "Please select a GIF file.";
      return;
    }

    status.textContent = "Uploading...";
    gifContainer.innerHTML = "";

    uploadGif(file)
      .then((response) => {
        if (response.meta.status === 200) {
          status.textContent = "GIF uploaded successfully!";

          const gifId = response.data.id;
          addUploadedGif(gifId);
          const gifUrl = `https://media.giphy.com/media/${gifId}/giphy.gif`;

          gifContainer.innerHTML = `
            <img src="${gifUrl}" alt="Uploaded GIF" />
          `;
        } else {
          status.textContent = "Upload failed.";
        }
      })
      .catch(() => {
        status.textContent = "Error uploading GIF.";
      });
  });
};
