// src/content.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "GET_PAGE_CONTENT") {
    // Get visible text, remove extra spaces, and trim to avoid token limits
    const text = document.body.innerText
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 8000); // Send roughly 2000-3000 tokens of context
    
    sendResponse({ text: text });
  }
  return true;
});