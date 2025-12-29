let uploadedGifs = JSON.parse(localStorage.getItem('uploadedGifs')) || [];

/**
 * Stores an uploaded GIF ID in localStorage.
 *
 * @param {string} gifId - The unique identifier of the uploaded GIF.
 * @returns {void}
 */
export const addUploadedGif = (gifId) => {
  if (uploadedGifs.includes(gifId)) {
    return;
  }

  uploadedGifs.push(gifId);
  localStorage.setItem('uploadedGifs', JSON.stringify(uploadedGifs));
};

/**
 * Removes an uploaded GIF ID from localStorage.
 *
 * @param {string} gifId - The unique identifier of the uploaded GIF.
 * @returns {void}
 */
export const removeUploadedGif = (gifId) => {
  uploadedGifs = uploadedGifs.filter((id) => id !== gifId);
  localStorage.setItem('uploadedGifs', JSON.stringify(uploadedGifs));
};

/**
 * Returns a copy of all uploaded GIF IDs.
 *
 * @returns {string[]} Array of uploaded GIF IDs.
 */
export const getUploadedGifs = () => [...uploadedGifs];
