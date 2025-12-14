import { EMPTY_HEART, FULL_HEART } from '../common/constants.js';
import { getFavorites } from '../data/favorites.js';

export const q = (selector) => document.querySelector(selector);

export const qs = (selector) => document.querySelectorAll(selector);

export const setActiveNav = (page) => {
  const navs = qs('a.nav-link');

  Array
    .from(navs)
    .forEach(element => element
      .getAttribute('data-page') === page
      ? element.classList.add('active')
      : element.classList.remove('active')
      );
};

export const renderFavoriteStatus = (movieId) => {
  const favorites = getFavorites();

  return favorites.includes(movieId)
    ? `<span class="favorite active" data-movie-id="${movieId}">${FULL_HEART}</span>`
    : `<span class="favorite" data-movie-id="${movieId}">${EMPTY_HEART}</span>`;
};
