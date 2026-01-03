/**
 * Returns the first DOM element that matches the given selector.
 *
 * @param {string} selector - A valid CSS selector.
 * @returns {Element|null} The matched element or null if none is found.
 */
export const q = (selector) => document.querySelector(selector);

/**
 * Returns a NodeList of all DOM elements matching the given selector.
 *
 * @param {string} selector - A valid CSS selector.
 * @returns {NodeListOf<Element>} A list of matched elements.
 */
export const qs = (selector) => document.querySelectorAll(selector);

/**
 * Sets the active navigation link based on the current page.
 *
 * @param {string} page - The current page identifier.
 * @returns {void}
 */
export const setActiveNav = (page) => {
  const navs = qs("a.nav-link");

  Array.from(navs).forEach((element) =>
    element.getAttribute("data-page") === page
      ? element.classList.add("active")
      : element.classList.remove("active")
  );
};
