const FAVORITES_KEY = "favoriteGifIds";

/**
 * Gets all stored favorite GIF ids from localStorage.
 *
 * @returns {string[]} Array of stored favorite GIF ids.
 */
export const getFavoriteGifIds = () => {
  const raw = localStorage.getItem(FAVORITES_KEY);

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

/**
 * Stores the provided favorite GIF ids array in localStorage.
 *
 * @param {string[]} ids - Array of favorite GIF ids.
 * @returns {void}
 */
const setFavoriteGifIds = (ids) => {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
};

/**
 * Checks whether a GIF id is currently in favorites.
 *
 * @param {string} gifId - The GIF id.
 * @returns {boolean} True if the GIF is favorited.
 */
export const isFavoriteGifId = (gifId) => {
  return getFavoriteGifIds().includes(gifId);
};

/**
 * Adds a GIF id to favorites (no duplicates).
 *
 * @param {string} gifId - The GIF id.
 * @returns {string[]} Updated favorites array.
 */
export const addFavoriteGifId = (gifId) => {
  const ids = getFavoriteGifIds();

  if (!ids.includes(gifId)) {
    ids.push(gifId);
    setFavoriteGifIds(ids);
  }

  return ids;
};

/**
 * Removes a GIF id from favorites.
 *
 * @param {string} gifId - The GIF id.
 * @returns {string[]} Updated favorites array.
 */
export const removeFavoriteGifId = (gifId) => {
  const ids = getFavoriteGifIds().filter((id) => id !== gifId);
  setFavoriteGifIds(ids);
  return ids;
};

/**
 * Toggles a GIF id in favorites.
 *
 * @param {string} gifId - The GIF id.
 * @returns {boolean} True if the GIF is now favorited; false if removed.
 */
export const toggleFavoriteGifId = (gifId) => {
  const ids = getFavoriteGifIds();

  if (ids.includes(gifId)) {
    setFavoriteGifIds(ids.filter((id) => id !== gifId));
    return false;
  }

  ids.push(gifId);
  setFavoriteGifIds(ids);
  return true;
};
