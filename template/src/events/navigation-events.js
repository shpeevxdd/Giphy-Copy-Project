import {
  HOME,
  TRENDING,
  ABOUT,
  UPLOAD,
  UPLOADED,
  FAVORITES,
} from "../common/constants.js";
import {
  renderTrending,
  renderAbout,
  renderUpload,
  renderUploaded,
  renderFavorites,
  exitTrending,
  exitSearch,
} from "./render-events.js";
import { setActiveNav } from "./helpers.js";

/**
 * Loads and renders a page based on the given page identifier.
 *
 * @param {string} page - The page constant that determines which view to render.
 * @returns {void|null} Renders the corresponding page or returns null if page is invalid.
 */
export const loadPage = (page) => {
  exitTrending();
  exitSearch();

  switch (page) {
    case HOME:
    case TRENDING:
      setActiveNav(TRENDING);
      return renderTrending();

    case ABOUT:
      setActiveNav(ABOUT);
      return renderAbout();

    case UPLOAD:
      setActiveNav(UPLOAD);
      return renderUpload();

    case UPLOADED:
      setActiveNav(UPLOADED);
      return renderUploaded();

    case FAVORITES:
      setActiveNav(FAVORITES);
      return renderFavorites();

    default:
      return null;
  }
};
