import { addFavorite, getFavorites, removeFavorite } from '../data/favorites.js';
import { q, renderFavoriteStatus } from './helpers.js';


export const toggleFavoriteStatus = (movieId) => {
  const favorites = getFavorites();

  if (favorites.includes(movieId)) {
    removeFavorite(movieId);
  } else {
    addFavorite(movieId);
  }

  q(`span[data-movie-id="${movieId}"]`).innerHTML = renderFavoriteStatus(movieId);
};