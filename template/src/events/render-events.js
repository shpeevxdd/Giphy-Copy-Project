import { loadTrending } from '../requests/request-service.js';
import { toTrendingView } from '../views/trending-view.js';
import { toAboutView } from '../views/about-view.js';
import { q } from './helpers.js';
import { CONTAINER_SELECTOR } from '../common/constants.js';

export const renderTrending = () => {
  loadTrending().then(res => {
    const gifsHtml = res.data
      .map(gif => toTrendingView(gif))
      .join('');

    q(CONTAINER_SELECTOR).innerHTML = gifsHtml;
  });
};

export const renderAbout = () => {
  q(CONTAINER_SELECTOR).innerHTML = toAboutView();
};