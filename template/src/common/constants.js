export const HOME = "home";
export const TRENDING = "trending";
export const ABOUT = "about";
export const UPLOAD = "upload";
export const UPLOADED = "uploaded";

export const CONTAINER_SELECTOR = "#container";
export const FAVORITES = "favorites";

export const FULL_HEART = "❤";
export const EMPTY_HEART = "♡";

// Giphy public beta key — safe for client-side demos
export const key = "WGZE6THab8arUPRsvqPP6js7Kkcf5w3z";
export const LIMIT = 25;

/**
 * Normalizes a GIF object (especially from the Random endpoint) so it
 * always has `images.fixed_height.url` set, which our card views expect.
 *
 * @param {Object} gif - GIF object from any Giphy endpoint.
 * @returns {Object} GIF object with a guaranteed `images.fixed_height.url`.
 */
export const normalizeGif = (gif) => {
  const url =
    gif?.images?.fixed_height?.url ||
    gif?.images?.original?.url ||
    gif?.image_url ||
    gif?.image_original_url ||
    gif?.image_fixed_height_url ||
    "";

  return {
    ...gif,
    images: {
      ...(gif.images || {}),
      fixed_height: {
        ...(gif.images?.fixed_height || {}),
        url,
      },
    },
    title: gif?.title || "Untitled GIF",
  };
};
