/* 
Disclaimer: The project idea, design, and concept belong to me (Jackelin Britton).
ChatGPT only assisted in helping me put the code together and organize into a tabbed portfolio.
Last update: 9/21/2025
*/
/* Handles tab switching on click */
function showTab(tabId) {
  // Hide all sections
  document.querySelectorAll('.tab-section').forEach(sec => sec.classList.remove('active'));
  // Show only the one user clicked
  document.getElementById(tabId).classList.add('active');
}
