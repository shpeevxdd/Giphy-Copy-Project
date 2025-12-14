import { renderFavoriteStatus } from '../events/helpers.js';

export const toMoviesFromCategoryView = (category, movies) => `
<div id="movies">
  <h1>${category.name} movies:</h1>
  <div class="content">
    ${movies.map(toMovieSimple).join('\n')}
  </div>
</div>
`;

export const toSingleMovieView = (movie) => `
<div id="movies">
  <h1>${movie.title} (${movie.year})</h1>
  <div class="content">
    ${toMovieDetailed(movie)}
  </div>
</div>
`;

export const toMovieSimple = (movie) => `
<div class="movie">
  <h1>${movie.title}</h1>
  <h2>${movie.year}</h2>
  <img src="${movie.poster}"><br>
  <button class="view-movie-btn" data-movie-id="${movie.id}">View details</button>
  ${renderFavoriteStatus(movie.id)}
</div>
`;

const toMovieDetailed = (movie) => `
<div class="movie-detailed">
  <div class="poster">
    <img src="${movie.poster}">
  </div>
  <div class="movie-info">
    <p>Genre: ${movie.genre}</p>
    <p>Director: ${movie.director}</p>
    <p>Staring: ${movie.stars.join(', ')}</p>
    <p>Plot: ${movie.description}</p>
  </div>
</div>
`;
