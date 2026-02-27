import { favoriteButtonView } from "./heart-view.js";
/**
 * Generates an HTML string displaying the details of a GIF.
 *
 * @param {Object} gif - The GIF object containing data from the API.
 * @param {boolean} isFavorite - Whether the GIF is in favorites.
 * @returns {string} HTML string representing the GIF details view.
 */
export const gifDetailsView = (gif, isFavorite = false) => {
  return `
    <div class="detail-view">
      <button id="back-btn">← Back</button>

      <h3 class="section-title">${gif.title || "Untitled GIF"}</h3>

      <div class="gif-card">
        <img
          src="${gif.images.fixed_height.url}"
          alt="${gif.title || "GIF"}"
          class="img-fluid"
        />
        ${favoriteButtonView(gif.id, isFavorite)}
      </div>

      <div class="detail-meta">
        <span><strong>Author:</strong> ${gif.username || "Anonymous"}</span>
        <span><strong>Rating:</strong> ${(gif.rating || "n/a").toUpperCase()}</span>
      </div>
    </div>
  `;
};