import { key } from '../common/constants.js';

export const loadTrending = () => {
  return fetch(`https://api.giphy.com/v1/gifs/trending?api_key=${key}&limit=25`)
    .then(res => res.json());
};