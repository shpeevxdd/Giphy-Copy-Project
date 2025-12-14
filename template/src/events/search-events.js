import { CONTAINER_SELECTOR } from '../common/constants.js';
import { searchMovies } from '../data/movies.js';
import { toSearchView } from '../views/search-view.js';
import { q } from './helpers.js';

export const renderSearchItems = (searchTerm) => {
  const movies = searchMovies(searchTerm);

  q(CONTAINER_SELECTOR).innerHTML = toSearchView(movies, searchTerm);
};
