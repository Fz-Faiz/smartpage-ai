// src/background.js

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "POPUP_ASK") {
    // 1. Get the current active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];

      // 2. Ask the content script to scrape the page text
      chrome.tabs.sendMessage(activeTab.id, { type: "GET_PAGE_CONTENT" }, async (pageData) => {
        const pageText = pageData?.text || "No content found on page.";
        
        // 3. Combine user query with page context for the prompt
        const combinedPrompt = `Context from webpage: ${pageText}\n\nUser Question: ${request.text}`;

        try {
          // 4. Send to your FastAPI backend
          const response = await fetch("http://localhost:5001/ask", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: combinedPrompt })
          });

          const data = await response.json();
          sendResponse({ answer: data.answer });
        } catch (err) {
          console.error("Backend Error:", err);
          sendResponse({ error: "Could not connect to FastAPI server." });
        }
      });
    });
    return true; // Keeps the messaging channel open for the async fetch
  }
});