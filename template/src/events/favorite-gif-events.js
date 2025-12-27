import { setFavoriteGifId } from '../data/favorite-gif.js';

/**
 * Attaches click handling for setting a favorite GIF.
 * Uses event delegation to work with infinite scroll.
 *
 * @returns {void}
 */
export const attachFavoriteGifEvents = () => {
  document.addEventListener('click', onSetFavoriteClick);
};

/**
 * Handles click events for setting a favorite GIF.
 *
 * @param {MouseEvent} e - The click event.
 * @returns {void}
 */
const onSetFavoriteClick = (e) => {
  if (!e.target.classList.contains('set-favorite-btn')) {
    return;
  }

  const gifId = e.target.getAttribute('data-gif-id');
  setFavoriteGifId(gifId);

  e.target.textContent = 'Favorite Saved ✔';
};
