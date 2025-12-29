import { EMPTY_HEART, FULL_HEART, CONTAINER_SELECTOR } from '../common/constants.js';
import { toggleFavoriteGifId, getFavoriteGifIds } from '../data/favorites.js';
import { loadRandomGif } from '../requests/request-service.js';
import { toFavoritesView } from '../views/favorites-view.js';
import { toTrendingView } from '../views/trending-view.js';

/**
 * Attaches click handling for adding/removing favorite GIFs.
 *
 * @returns {void}
 */
export const attachFavoritesEvents = () => {
  document.addEventListener('click', onToggleFavoriteClick);
};

/**
 * Normalizes Random GIF API response so it works with the standard GIF card.
 *
 * @param {Object} gif
 * @returns {Object}
 */
const normalizeRandomGifForCard = (gif) => {
  const url =
    gif?.images?.fixed_height?.url ||
    gif?.images?.original?.url ||
    gif?.image_fixed_height_url ||
    gif?.image_original_url ||
    gif?.image_url ||
    '';

  return {
    ...gif,
    images: {
      ...gif.images,
      fixed_height: {
        ...(gif.images?.fixed_height || {}),
        url,
      },
    },
    title: gif?.title || 'Random GIF',
  };
};

/**
 * Shows empty favorites message and a random GIF.
 *
 * @returns {void}
 */
const showEmptyFavoritesStateWithRandomGif = () => {
  const container = document.querySelector(CONTAINER_SELECTOR);
  if (!container) return;

  container.innerHTML = toFavoritesView(
    'You have no favorites yet. Here is a random one:'
  );

  loadRandomGif().then((res) => {
    if (!res?.data) return;

    const randomGif = normalizeRandomGifForCard(res.data);
    const gifHtml = toTrendingView(randomGif, false);

    const firstCol = document.querySelector('#favorites-col-1');
    if (firstCol) {
      firstCol.insertAdjacentHTML('beforeend', gifHtml);
    }
  });
};

/**
 * Handles click events for toggling a GIF as favorite.
 *
 * @param {MouseEvent} e
 * @returns {void}
 */
const onToggleFavoriteClick = (e) => {
  const btn = e.target.closest('.toggle-favorite-btn');
  if (!btn) return;

  const gifId = btn.getAttribute('data-gif-id');
  const isNowFavorite = toggleFavoriteGifId(gifId);

  btn.textContent = isNowFavorite ? FULL_HEART : EMPTY_HEART;
  btn.setAttribute(
    'aria-label',
    isNowFavorite ? 'Remove from favorites' : 'Add to favorites'
  );

  const favoritesContainer = document.querySelector('#favorites');
  if (!favoritesContainer) return;

  const card = btn.closest('.gif-card');

  /**
   * REMOVING A FAVORITE
   */
  if (!isNowFavorite && card) {
    card.remove();

    const remainingCards = favoritesContainer.querySelectorAll('.gif-card');
    if (remainingCards.length === 0) {
      showEmptyFavoritesStateWithRandomGif();
    }

    return;
  }

  /**
   * ADDING A FAVORITE (from random empty-state GIF)
   * → remove the "no favorites" message
   */
  if (isNowFavorite) {
    const message = document.querySelector('.favorites p');
    if (message) {
      message.remove();
    }
  }
};
