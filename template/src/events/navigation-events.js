import { HOME, TRENDING, ABOUT } from '../common/constants.js';
import { renderTrending, renderAbout } from './render-events.js';

export const loadPage = (page) => {
  switch (page) {
    case HOME:
    case TRENDING:
      return renderTrending();

    case ABOUT:
      return renderAbout();

    default:
      return null;
  }
};