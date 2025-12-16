import { key } from '../common/constants.js';

/**
 * Fetches a list of trending GIFs from the Giphy API.
 *
 * @returns {Promise<Object>} A promise resolving to the trending GIFs response object.
 */
export const loadTrending = () => {
  return fetch(`https://api.giphy.com/v1/gifs/trending?api_key=${key}&limit=25`)
    .then(res => res.json());
};

/**
 * Uploads a GIF file to the Giphy API.
 *
 * @param {File} file - The GIF file selected by the user.
 * @returns {Promise<Object>} A promise resolving to the upload response object.
 */
export const uploadGif = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', key);

  return fetch('https://upload.giphy.com/v1/gifs', {
    method: 'POST',
    body: formData,
  }).then(res => res.json());
};

/**
 * Fetches multiple GIFs by their IDs.
 *
 * @param {string[]} ids - Array of GIF IDs.
 * @returns {Promise<Object>} Giphy API response containing the GIFs.
 */
export const loadGifsByIds = (ids) => {
  if (!ids.length) {
    return Promise.resolve({ data: [] });
  }

  return fetch(
    `https://api.giphy.com/v1/gifs?api_key=${key}&ids=${ids.join(',')}`
  ).then(res => res.json());
};
