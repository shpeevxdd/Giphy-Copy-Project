import { HOME } from "./common/constants.js";
import { loadPage } from "./events/navigation-events.js";
import { attachFavoritesEvents } from "./events/favorites-events.js";
import { attachUploadedEvents } from "./events/uploaded-events.js";
import { attachSearchEvents } from "./events/search-events.js";

/**
 * Initializes the application after the DOM content is fully loaded.
 * Sets up navigation event handling and loads the default home page.
 *
 * @returns {void}
 */
document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("click", (e) => {
    const navLink = e.target.closest("[data-page]");
    if (navLink) {
      e.preventDefault();
      loadPage(navLink.getAttribute("data-page"));
    }
  });

  attachSearchEvents();
  attachFavoritesEvents();
  attachUploadedEvents();

  loadPage(HOME);
});
