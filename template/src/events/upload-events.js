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
  const chooseBtn = document.getElementById("choose-file-btn");
  const fileNameDisplay = document.getElementById("file-name-display");
  const status = document.getElementById("upload-status");
  const gifContainer = document.getElementById("uploaded-gif");

  // "Choose File" opens the hidden file input
  if (chooseBtn && fileInput) {
    chooseBtn.addEventListener("click", () => fileInput.click());
  }

  // Show chosen file name
  if (fileInput && fileNameDisplay) {
    fileInput.addEventListener("change", () => {
      const file = fileInput.files[0];
      fileNameDisplay.textContent = file ? file.name : "";
    });
  }

  if (!uploadBtn || !fileInput || !status || !gifContainer) {
    return;
  }

  uploadBtn.addEventListener("click", () => {
    const file = fileInput.files[0];

    if (!file) {
      status.textContent = "Please select a GIF file first.";
      status.className = "error";
      return;
    }

    status.textContent = "Uploading...";
    status.className = "";
    gifContainer.innerHTML = "";

    uploadGif(file)
      .then((response) => {
        if (response.meta.status === 200) {
          status.textContent = "GIF uploaded successfully!";
          status.className = "success";

          const gifId = response.data.id;
          addUploadedGif(gifId);
          const gifUrl = `https://media.giphy.com/media/${gifId}/giphy.gif`;

          gifContainer.innerHTML = `
            <img src="${gifUrl}" alt="Uploaded GIF" />
          `;
        } else {
          status.textContent = "Upload failed.";
          status.className = "error";
        }
      })
      .catch(() => {
        status.textContent = "Error uploading GIF.";
        status.className = "error";
      });
  });
};
