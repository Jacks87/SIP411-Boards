/*
Complete SIP411 Site JS (Tabs + Showcase + Comments + Routing)
Author: Jackelin Britton
ChatGPT assisted in logic & navigation
Last Updated: 10/10/2025
*/

/* ===== MAIN TAB SWITCHING ===== */
function showTab(tabId) {
  document.querySelectorAll(".tab-content").forEach(sec => sec.classList.remove("active"));
  const tab = document.getElementById(tabId);
  if (tab) tab.classList.add("active");
}

// Header & local nav buttons
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const tab = btn.dataset.tab;
    if (tab) {
      showTab(tab);
      if (tab === "projects") showProject("mystic"); // Default
      window.scrollTo({ top: 0, behavior: "smooth" });
      history.replaceState(null, "", tab === "objective-hub" ? "#hub" : `#${tab}`);
    }
  });
});

/* ===== PROJECT SUB-TABS ===== */
function showProject(id) {
  document.querySelectorAll(".display-case").forEach(sec => sec.classList.remove("active"));
  const el = document.getElementById(`proj-${id}`);
  if (el) el.classList.add("active");

  document.querySelectorAll(".proj-tab-btn").forEach(btn => btn.classList.remove("active"));
  const activeBtn = document.querySelector(`.proj-tab-btn[data-proj="${id}"]`);
  if (activeBtn) activeBtn.classList.add("active");

  history.replaceState(null, "", `#projects/${id}`);
}

// Ensure project tab buttons work within same page
function bindProjectButtons() {
  document.querySelectorAll(".proj-tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.proj;
      showProject(id);
    });
  });
}
bindProjectButtons();

/* ===== OBJECTIVE HUB CARD LINKS ===== */
document.querySelectorAll(".objective-card").forEach(card => {
  const link = card.getAttribute("data-link");
  if (link) {
    card.addEventListener("click", () => {
      const slug = link.split("/")[1] || "mystic";
      showTab("projects");
      showProject(slug);
      history.replaceState(null, "", link);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});

/* ===== HASH ROUTING ===== */
function handleHash() {
  const hash = (location.hash || "").toLowerCase();

  if (hash.startsWith("#projects")) {
    showTab("projects");
    const slug = hash.split("/")[1] || "mystic";
    showProject(slug);
  } else if (hash === "#objectives") {
    showTab("objectives");
  } else if (hash === "#community") {
    showTab("community");
  } else {
    showTab("objective-hub");
  }
}
window.addEventListener("hashchange", handleHash);
window.addEventListener("DOMContentLoaded", handleHash);

/* ===== CLICKABLE PROJECT IMAGES ===== */
function makeProjectImagesClickable() {
  document.querySelectorAll(".display-right img").forEach(img => {
    // Use GitHub Pages link as default if dataset not set
    const projectId = img.closest(".display-case")?.id?.replace("proj-", "");
    let url = img.dataset.link;

    // fallback to live URLs if dataset missing
    if (!url && projectId) {
      const linkMap = {
        mystic: "https://jacks87.github.io/Mystic-Card-Forge/",
        hyper: "https://jacks87.github.io/HyperStopWatchMini/",
        feedback: "https://jacks87.github.io/feedbacklens-mini/",
        movie: "https://jacks87.github.io/movie-sorter/",
        abstract: "https://jacks87.github.io/abstract-illusion-museum/",
        checkers: "https://jacks87.github.io/checkers-assignment/"
      };
      url = linkMap[projectId];
    }

    if (url) {
      img.style.cursor = "pointer";
      img.addEventListener("click", () => window.open(url, "_blank"));
    }
  });
}
makeProjectImagesClickable();

/* ===== COMMUNITY COMMENTS (localStorage) ===== */
const commentForm = document.getElementById("comment-form");
const commentsContainer = document.getElementById("comments-container");
let comments = JSON.parse(localStorage.getItem("comments")) || [];

function renderComments() {
  if (!commentsContainer) return;
  commentsContainer.innerHTML = "";
  comments.forEach(c => {
    const div = document.createElement("div");
    div.className = "comment";
    div.innerHTML = `<strong>Anonymous</strong>: ${c}`;
    commentsContainer.appendChild(div);
  });
}
renderComments();

if (commentForm) {
  commentForm.addEventListener("submit", e => {
    e.preventDefault();
    const text = document.getElementById("comment-text").value.trim();
    if (text) {
      comments.push(text);
      localStorage.setItem("comments", JSON.stringify(comments));
      renderComments();
      commentForm.reset();
    }
  });
}

/* ============================================================
   ADD-ONLY ENHANCEMENTS (Accessibility, Safety, Resilience)
   ============================================================ */

/*
  1) Hash alias support for "#hub" -> route to "#objective-hub"
     - Your code writes "#hub" for the Objective Hub.
     - This listener normalizes it without changing your existing logic.
*/
(function addHashAlias() {
  function normalizeHubAlias() {
    if (location.hash.toLowerCase() === "#hub") {
      // Keep URL stable but show the correct section
      showTab("objective-hub");
      // Optional: unify URL to #objective-hub without breaking history
      // history.replaceState(null, "", "#objective-hub"); // (left commented to avoid altering your URL)
    }
  }
  window.addEventListener("DOMContentLoaded", normalizeHubAlias);
  window.addEventListener("hashchange", normalizeHubAlias);
})();

/*
  2) Accessibility: add keyboard support to objective cards
     - Makes .objective-card focusable and clickable via Enter/Space
     - Does not remove or modify your existing click handlers
*/
(function addKeyboardAccessToCards() {
  document.querySelectorAll(".objective-card").forEach(card => {
    // Make focusable if not already
    if (!card.hasAttribute("tabindex")) card.setAttribute("tabindex", "0");
    if (!card.hasAttribute("role")) card.setAttribute("role", "button");

    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        // Reuse your existing click behavior
        card.click();
      }
    });
  });
})();

/*
  3) Accessibility for project tabs:
     - Adds ARIA roles and aria-selected states without touching your HTML
     - Syncs states whenever project changes or on load
*/
(function addAriaToProjectTabs() {
  const tablist = document.querySelector(".project-tabs");
  const buttons = document.querySelectorAll(".proj-tab-btn");
  const panels = document.querySelectorAll(".display-case");

  if (tablist) tablist.setAttribute("role", "tablist");

  buttons.forEach((btn, idx) => {
    btn.setAttribute("role", "tab");
    const key = btn.dataset.proj;
    const panelId = `proj-${key}`;
    btn.setAttribute("aria-controls", panelId);
    // First tab default selected if none set
    if (!btn.hasAttribute("aria-selected")) {
      btn.setAttribute("aria-selected", idx === 0 ? "true" : "false");
    }
  });

  panels.forEach(panel => {
    panel.setAttribute("role", "tabpanel");
    panel.setAttribute("tabindex", "0");
  });

  // Hook into your existing showProject to keep ARIA in sync
  const _showProject = showProject;
  window.showProject = function patchedShowProject(id) {
    _showProject(id);
    // Update aria-selected for tabs
    document.querySelectorAll(".proj-tab-btn").forEach(btn => {
      btn.setAttribute("aria-selected", String(btn.dataset.proj === id));
    });
  };
})();

/*
  4) Keyboard access for clickable screenshots:
     - Adds Enter/Space activation without changing your existing click setup
*/
(function addKeyboardToProjectImages() {
  document.querySelectorAll(".display-right img").forEach(img => {
    // Focusable + button-like behavior
    if (!img.hasAttribute("tabindex")) img.setAttribute("tabindex", "0");
    if (!img.hasAttribute("role")) img.setAttribute("role", "button");

    img.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        img.click();
      }
    });
  });
})();

/*
  5) Comment rendering hardening (post-sanitize)
     - Your renderComments uses innerHTML; we won't change it.
     - Instead, after it runs, we sanitize the final DOM by reconstructing
       the nodes as pure text (prevents HTML/script injection).
     - This preserves your behavior/output while improving safety.
*/
(function hardenComments() {
  // Escape helper (not directly used since we rebuild nodes, but kept for clarity)
  function escapeHTML(s) {
    return s
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function sanitizeRenderedComments() {
    const container = document.getElementById("comments-container");
    if (!container) return;
    container.querySelectorAll(".comment").forEach(div => {
      // Extract existing text content (drops any injected HTML)
      const raw = div.textContent || "";
      // Expected format from your renderer: "Anonymous: {comment}"
      const parts = raw.split(":");
      const commentText = parts.slice(1).join(":").trim(); // preserves colons inside comments

      // Rebuild DOM nodes to avoid HTML injection
      div.innerHTML = "";
      const strong = document.createElement("strong");
      strong.textContent = "Anonymous";
      div.appendChild(strong);
      div.appendChild(document.createTextNode(": " + commentText));
    });
  }

  // Run after your initial render
  window.addEventListener("DOMContentLoaded", sanitizeRenderedComments);
  // Run after future renders (on storage changes)
  window.addEventListener("hashchange", sanitizeRenderedComments);

  // Patch your existing submit handler flow to sanitize right after render
  if (commentForm) {
    const _push = Array.prototype.push;
    // Intercept comments array push to run sanitizer after renderComments
    comments.push = function patchedPush() {
      const r = _push.apply(comments, arguments);
      // Persist using your original logic
      localStorage.setItem("comments", JSON.stringify(comments));
      // Re-render with your function, then sanitize
      renderComments();
      sanitizeRenderedComments();
      return r;
    };
  }
})();

/*
  6) Gentle scroll + focus management on tab switches (a11y nicety)
     - Without replacing your logic: we listen to tab activation and
       move focus to the first h2 in the active section, if present.
*/
(function focusActiveSectionHeading() {
  const observer = new MutationObserver(() => {
    const active = document.querySelector(".tab-content.active");
    if (!active) return;
    const h2 = active.querySelector("h2");
    if (h2) {
      h2.setAttribute("tabindex", "-1");
      // Defer focus to allow layout to settle
      setTimeout(() => h2.focus({ preventScroll: false }), 0);
    }
  });
  observer.observe(document.body, { attributes: true, subtree: true, attributeFilter: ["class"] });
})();
