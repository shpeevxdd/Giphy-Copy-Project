import { HOME } from './common/constants.js';
import { loadPage } from './events/navigation-events.js';

/**
 * Initializes the application after the DOM content is fully loaded.
 * Sets up navigation event handling and loads the default home page.
 *
 * @returns {void}
 */
document.addEventListener('DOMContentLoaded', () => {

  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('nav-link')) {
      loadPage(e.target.getAttribute('data-page'));
    }
  });

  loadPage(HOME);
});
