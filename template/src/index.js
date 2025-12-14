import { HOME } from './common/constants.js';
import { loadPage } from './events/navigation-events.js';
import { q } from './events/helpers.js';

document.addEventListener('DOMContentLoaded', () => {

  document.addEventListener('click', e => {
    if (e.target.classList.contains('nav-link')) {
      loadPage(e.target.getAttribute('data-page'));
    }
  });

  loadPage(HOME);
});