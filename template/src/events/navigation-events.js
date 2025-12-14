import { ABOUT, CATEGORIES, CONTAINER_SELECTOR, FAVORITES, HOME } from '../common/constants.js';
import { loadCategories, loadCategory, loadMovies, loadSingleMovie } from '../requests/request-service.js';
import { toAboutView } from '../views/about-view.js';
import { toCategoriesView } from '../views/category-view.js';
import { toFavoritesView } from '../views/favorites-view.js';
import { toHomeView } from '../views/home-view.js';
import { toMoviesFromCategoryView, toSingleMovieView } from '../views/movie-views.js';
import { q, setActiveNav } from './helpers.js';
import { getFavorites } from '../data/favorites.js';
import { categories } from '../data/movies-data.js';

// public API
export const loadPage = (page = '') => {

  switch (page) {

    case HOME:
      setActiveNav(HOME);
      return renderHome();

    case CATEGORIES:
      setActiveNav(CATEGORIES);
      return renderCategories();

    case FAVORITES:
      setActiveNav(FAVORITES);
      return renderFavorites();

    case ABOUT:
      setActiveNav(ABOUT);
      return renderAbout();

    /* if the app supports error login, use default to log mapping errors */
    default: return null;
  }

};

export const renderMovieDetails = (id = null) => {
  const movie = loadSingleMovie(id);

  q(CONTAINER_SELECTOR).innerHTML = toSingleMovieView(movie);
};

export const renderCategory = (categoryId = null) => {
  loadCategory(categoryId)
  .then(category => {
      return Promise.all([
          category,
          loadMovies(category.id)
      ]);
  })
  .then(([category, movies]) => {
      q(CONTAINER_SELECTOR).innerHTML = toMoviesFromCategoryView(category, movies);
  });
};

// private functions

const renderHome = () => {
  q(CONTAINER_SELECTOR).innerHTML = toHomeView();
};

const renderCategories = () => {
  loadCategories().then(categories => {
    q(CONTAINER_SELECTOR).innerHTML = toCategoriesView(categories);
  })
};

const renderFavorites = () => {
  const favorites = getFavorites();
  const movies = favorites.map(id => loadSingleMovie(id));

  q(CONTAINER_SELECTOR).innerHTML = toFavoritesView(movies);
};

const renderAbout = () => {
  q(CONTAINER_SELECTOR).innerHTML = toAboutView();
};
