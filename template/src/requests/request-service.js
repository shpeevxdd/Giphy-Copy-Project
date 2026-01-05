import { key, LIMIT } from "../common/constants.js";

/**
 * Handles Giphy API responses:
 * - Throws on non-2xx HTTP status (fetch doesn't throw by default)
 * - Parses JSON on success
 * - Tries to extract a useful error message from JSON on failure
 *
 * @param {Response} res
 * @returns {Promise<any>}
 */
const handleResponse = async (res) => {
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    const message =
      errorBody?.message || errorBody?.meta?.msg || `HTTP error ${res.status}`;

    throw new Error(message);
  }

  return res.json();
};

/**
 * Fetches a list of trending GIFs from the Giphy API.
 *
 * @param {number} [offset=0] - Pagination offset (number of GIFs to skip).
 * @returns {Promise<Object>} A promise resolving to the trending GIFs response object.
 */
export const loadTrending = (offset = 0) => {
  return fetch(
    `https://api.giphy.com/v1/gifs/trending?api_key=${key}&limit=${LIMIT}&offset=${offset}`
  ).then(handleResponse);
};

/**
 * Searches for GIFs by query using the Giphy Search endpoint.
 *
 * Docs: https://developers.giphy.com/docs/api/endpoint/#search
 *
 * @param {string} query - User-provided search query (q).
 * @param {number} [offset=0] - Pagination offset (number of GIFs to skip).
 * @returns {Promise<Object>} A promise resolving to the search response object.
 */
export const searchGifs = (query, offset = 0) => {
  const q = encodeURIComponent(query || "");
  return fetch(
    `https://api.giphy.com/v1/gifs/search?api_key=${key}&q=${q}&limit=${LIMIT}&offset=${offset}`
  ).then(handleResponse);
};

/**
 * Uploads a GIF file to the Giphy API.
 *
 * @param {File} file - The GIF file selected by the user.
 * @returns {Promise<Object>} A promise resolving to the upload response object.
 */
export const uploadGif = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", key);

  return fetch("https://upload.giphy.com/v1/gifs", {
    method: "POST",
    body: formData,
  }).then(handleResponse);
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
    `https://api.giphy.com/v1/gifs?api_key=${key}&ids=${ids.join(",")}`
  ).then(handleResponse);
};

/**
 * Fetches a single GIF by id from the Giphy API.
 *
 * @param {string} gifId - The GIF id.
 * @returns {Promise<Object>} Giphy API response for the GIF.
 */
export const loadGifById = (gifId) => {
  return fetch(`https://api.giphy.com/v1/gifs/${gifId}?api_key=${key}`).then(
    handleResponse
  );
};

/**
 * Fetches a random GIF from the Giphy API.
 *
 * @returns {Promise<Object>} Giphy API response for a random GIF.
 */
export const loadRandomGif = () => {
  return fetch(`https://api.giphy.com/v1/gifs/random?api_key=${key}`).then(
    handleResponse
  );
};
