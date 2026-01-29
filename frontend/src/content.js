// src/content.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "GET_PAGE_CONTENT") {
    // 1. Try to find the main article or body
    const mainContent = document.querySelector('article') || document.body;
    const text = mainContent.innerText.replace(/\s+/g, ' ').trim();

    // 2. Return the text, or an explicit error if it's too short
    if (text.length < 100) {
      sendResponse({ error: "PAGE_EMPTY", text: "" });
    } else {
      sendResponse({ text: text.substring(0, 10000) });
    }
  }
  return true;
});