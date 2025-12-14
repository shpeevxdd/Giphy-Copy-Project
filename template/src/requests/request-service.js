import { key } from '../index.js';

export const loadTrending = (id = null) => {
  return fetch(`https://api.giphy.com/v1/gifs/trending?api_key=${key}`)
    .then(response => response.json());
}

