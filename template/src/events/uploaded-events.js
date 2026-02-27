import { removeUploadedGif } from "../data/uploaded-gifs.js";

/**
 * Ensures each uploaded GIF card has a Delete button.
 *
 * @returns {void}
 */
const ensureDeleteButtons = () => {
  const uploadedSection = document.querySelector(".uploaded");
  if (!uploadedSection) {
    return;
  }

  const cards = uploadedSection.querySelectorAll(".gif-card");

  cards.forEach((card) => {
    const gifId = card.getAttribute("data-gif-id");
    if (!gifId) {
      return;
    }

    if (card.querySelector(".delete-upload-btn")) {
      return;
    }

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "delete-upload-btn";
    deleteBtn.setAttribute("data-gif-id", gifId);
    deleteBtn.textContent = "Delete";

    const existingActionBtn = card.querySelector("button");
    if (existingActionBtn && existingActionBtn.parentElement === card) {
      existingActionBtn.insertAdjacentElement("afterend", deleteBtn);
    } else {
      card.appendChild(deleteBtn);
    }
  });
};

/**
 * Handles deleting an uploaded GIF from storage and the UI.
 * IMPORTANT: Runs in the capture phase (see attachUploadedEvents) to prevent
 * the global "open-details" click handler from firing.
 *
 * @param {MouseEvent} e
 * @returns {void}
 */
const onDeleteUploadClick = (e) => {
  const btn = e.target.closest(".delete-upload-btn");
  if (!btn) {
    return;
  }

  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();

  const gifId = btn.getAttribute("data-gif-id");
  if (!gifId) {
    return;
  }

  removeUploadedGif(gifId);

  const card = btn.closest(".gif-card");
  if (card) {
    card.remove();
  }

  const uploadedSection = document.querySelector(".uploaded");
  if (!uploadedSection) {
    return;
  }

  const remaining = uploadedSection.querySelectorAll(".gif-card");
  if (remaining.length === 0) {
    const container = uploadedSection.querySelector(".gifs-container");
    if (container) {
      container.innerHTML = '<p class="empty-state">No uploaded GIFs yet.</p>';
    }
  }
};

/**
 * Attaches events to support deleting uploaded GIFs on the "My Uploads" page.
 * Uses:
 * - event delegation for delete clicks (CAPTURE PHASE to beat open-details handler)
 * - a MutationObserver to add delete buttons whenever the uploads page is rendered
 *
 * @returns {void}
 */
export const attachUploadedEvents = () => {
  document.addEventListener("click", onDeleteUploadClick, true);

  ensureDeleteButtons();

  const root = document.querySelector("#container") || document.body;

  const observer = new MutationObserver(() => {
    ensureDeleteButtons();
  });

  observer.observe(root, { childList: true, subtree: true });
};
