import { favoriteButtonView } from "./heart-view.js";
/**
 * Generates an HTML string displaying the details of a GIF.
 *
 * The view includes:
 * - A "Back to Trending" button
 * - The GIF title (or "Untitled GIF" if missing)
 * - The GIF image (choosing the best available URL)
 * - Author/username (or "Anonymous" if missing)
 * - GIF rating (or "N/A" if missing)
 *
 * @param {Object} gif - The GIF object containing data from the API.
 * @param {string} [gif.images.fixed_height.url] - URL of the fixed-height GIF.
 * @param {string} [gif.title] - The title of the GIF.
 * @param {string} [gif.username] - The author/username of the GIF.
 * @param {string} [gif.rating] - The rating of the GIF (e.g., "g", "pg").
 * @returns {string} HTML string representing the GIF details view.
 */
export const gifDetailsView = (gif, isFavorite = false) => {
  return `
    <div class="container-md text-center mt-4">
      <button class="btn btn-secondary mb-3" id="back-btn">
        ← Back to Trending
      </button>

      <h3 class="mb-3">${gif.title || "Untitled GIF"}</h3>

      <div class="gif-card mx-auto">
        <img
          src="${gif.images.fixed_height.url}"
          alt="${gif.title}"
          class="img-fluid mb-3"
        />
        ${favoriteButtonView(gif.id, isFavorite)}
      </div>

      <p><strong>Author:</strong> ${gif.username || "Anonymous"}</p>
      <p><strong>Rating:</strong> ${gif.rating || "N/A"}</p>
    </div>
  `;
};