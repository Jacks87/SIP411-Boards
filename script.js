/* 
SIP411 Boards Presentation
Author: Jackelin Britton
ChatGPT assisted in debugging & structuring
Last Updated: 9/28/2025
*/

/* Handles tab switching */
function showTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(sec => sec.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
}

// Attach tab switching to buttons
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => showTab(btn.dataset.tab));
});

/* ===== COMMENT SECTION LOGIC ===== */
const commentForm = document.getElementById("comment-form");
const commentsContainer = document.getElementById("comments-container");
let comments = JSON.parse(localStorage.getItem("comments")) || [];

// Render saved comments
function renderComments() {
  commentsContainer.innerHTML = "";
  comments.forEach(c => {
    const div = document.createElement("div");
    div.className = "comment";
    div.innerHTML = `<strong>Anonymous</strong>: ${c}`;
    commentsContainer.appendChild(div);
  });
}
renderComments();

// Add new comment
if (commentForm) {
  commentForm.addEventListener("submit", e => {
    e.preventDefault();
    const text = document.getElementById("comment-text").value;
    if (text.trim()) {
      comments.push(text);
      localStorage.setItem("comments", JSON.stringify(comments));
      renderComments();
      commentForm.reset();
    }
  });
}
