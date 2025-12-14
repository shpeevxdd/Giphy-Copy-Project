import { getCategories, getMoviesGeneralInfo, getMoviesFullInfo, getMovieById, getCategory } from '../data/movies.js';

export const loadCategories = () => {
  return fetch(`http://localhost:3000/categories`)
    .then(response => response.json());
};

export const loadCategory = (id = null) => {
  return fetch(`http://localhost:3000/categories/${id}`)
    .then(response => response.json());
}

export const loadMovies = (categoryId = null) => {
  const movies = getMoviesGeneralInfo(categoryId);

  return movies;
};

export const loadMoviesDetails = (categoryId = null) => {
  const movies = getMoviesFullInfo(categoryId);

  return movies;
};

export const loadSingleMovie = (id) => {
  const movie = getMovieById(id);

  return movie;  
};

export const searchMovies = (searchTerm = '') => {
  const movies = searchMovies(searchTerm);

  return movies;
};
