import { q, setActiveNav } from "./helpers.js";
import { TRENDING } from "../common/constants.js";
import { renderSearch, renderTrending } from "./render-events.js";

/**
 * Attaches search functionality to:
 * - Enter key in the input
 * - Search button click
 *
 * @returns {void}
 */
export const attachSearchEvents = () => {
  const input = q("#search");
  const button = q("#search-btn");

  if (!input || !button) {
    return;
  }

  const performSearch = () => {
    const query = (input.value || "").trim();

    if (!query) {
      setActiveNav(TRENDING);
      renderTrending();
      return;
    }

    setActiveNav(TRENDING);
    renderSearch(query);
  };

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      performSearch();
    }
  });

  button.addEventListener("click", performSearch);
};
