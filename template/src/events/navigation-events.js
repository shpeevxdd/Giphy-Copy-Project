import {
  HOME,
  TRENDING,
  ABOUT,
  UPLOAD,
  UPLOADED,
  FAVORITEGIF,
} from "../common/constants.js";
import {
  renderTrending,
  renderAbout,
  renderUpload,
  renderUploaded,
  renderFavoriteGif,
} from "./render-events.js";

/**
 * Loads and renders a page based on the given page identifier.
 *
 * @param {string} page - The page constant that determines which view to render.
 * @returns {void|null} Renders the corresponding page or returns null if page is invalid.
 */
export const loadPage = (page) => {
  switch (page) {
    case HOME:

    case TRENDING:
      return renderTrending();

    case ABOUT:
      return renderAbout();

    case UPLOAD:
      return renderUpload();

    case UPLOADED:
      return renderUploaded();

    case FAVORITEGIF:
      return renderFavoriteGif();

    default:
      return null;
  }
};
