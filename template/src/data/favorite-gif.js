const FAVORITE_GIF_KEY = 'favoriteGifId';

/**
 * Saves the chosen favorite GIF id in localStorage.
 *
 * @param {string} gifId - The GIF id to store as favorite.
 * @returns {void}
 */
export const setFavoriteGifId = (gifId) => {
  localStorage.setItem(FAVORITE_GIF_KEY, gifId);
};

/**
 * Gets the stored favorite GIF id from localStorage.
 *
 * @returns {string|null} The stored favorite GIF id or null if none exists.
 */
export const getFavoriteGifId = () => {
  return localStorage.getItem(FAVORITE_GIF_KEY);
};
