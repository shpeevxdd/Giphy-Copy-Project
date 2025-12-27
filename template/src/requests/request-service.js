import { key, LIMIT } from '../common/constants.js';

/**
 * Fetches a list of trending GIFs from the Giphy API.
 *
 * @returns {Promise<Object>} A promise resolving to the trending GIFs response object.
 */
export const loadTrending = (offset = 0) => {
  return fetch(`https://api.giphy.com/v1/gifs/trending?api_key=${key}&limit=${LIMIT}&offset=${offset}`)
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

/**
 * Fetches a single GIF by id from the Giphy API.
 *
 * @param {string} gifId - The GIF id.
 * @returns {Promise<Object>} Giphy API response for the GIF.
 */
export const loadGifById = (gifId) => {
  return fetch(`https://api.giphy.com/v1/gifs/${gifId}?api_key=${key}`)
    .then(res => res.json());
};

/**
 * Fetches a random GIF from the Giphy API.
 *
 * @returns {Promise<Object>} Giphy API response for a random GIF.
 */
export const loadRandomGif = () => {
  return fetch(`https://api.giphy.com/v1/gifs/random?api_key=${key}`)
    .then(res => res.json());
};

