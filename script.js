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
