let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

/**
 * Adds a GIF ID to the favorites list and persists it in localStorage.
 *
 * @param {string} movieId - The unique identifier of the GIF to add.
 * @returns {void}
 */
export const addFavorite = (movieId) => {
  if (favorites.find(id => id === movieId)) {
    // GIF has already been added to favorites
    return;
  }

  favorites.push(movieId);
  localStorage.setItem('favorites', JSON.stringify(favorites));
};

/**
 * Removes a GIF ID from the favorites list and updates localStorage.
 *
 * @param {string} movieId - The unique identifier of the GIF to remove.
 * @returns {void}
 */
export const removeFavorite = (movieId) => {
  favorites = favorites.filter(id => id !== movieId);
  localStorage.setItem('favorites', JSON.stringify(favorites));
};

/**
 * Returns a copy of the current favorites list.
 *
 * @returns {string[]} An array of favorite GIF IDs.
 */
export const getFavorites = () => [...favorites];
