import { HOME } from './common/constants.js';
import { toggleFavoriteStatus } from './events/favorites-events.js';
import { q } from './events/helpers.js';
import { loadPage, renderCategory, renderMovieDetails } from './events/navigation-events.js';
import { renderSearchItems } from './events/search-events.js';

document.addEventListener('DOMContentLoaded', () => {

  // add global listener
  document.addEventListener('click', e => {

    // nav events
    if (e.target.classList.contains('nav-link')) {

      loadPage(e.target.getAttribute('data-page'));
    }

    // show category events
    if (e.target.classList.contains('view-category-btn')) {
      renderCategory(+e.target.getAttribute('data-category-id'));
    }

    // show movie events
    if (e.target.classList.contains('view-movie-btn')) {
      renderMovieDetails(+e.target.getAttribute('data-movie-id'));
    }

    // toggle favorite event
    if (e.target.classList.contains('favorite')) {
      toggleFavoriteStatus(+e.target.getAttribute('data-movie-id'));
    }

  });

  // search events
  q('input#search').addEventListener('input', e => {
    renderSearchItems(e.target.value);
  });

  loadPage(HOME);

});