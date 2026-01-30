

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  

console.log("Message received:", request.type); 

  if (request.type === "PREFILL_TEXT") {
    chrome.storage.local.set({ pendingText: request.text }, () => {
      console.log("Text saved successfully");
      sendResponse({ status: "saved" }); 
    });
    return true; 
  }

  if (request.type === "POPUP_ASK") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (!activeTab?.id) {
        sendResponse({ error: "No active tab found." });
        return;
      }

    
      chrome.tabs.sendMessage(activeTab.id, { type: "GET_PAGE_CONTENT" }, async (pageData) => {
        if (chrome.runtime.lastError) {
          sendResponse({ error: "Cannot read this page. Try refreshing." });
          return;
        }

        const pageText = pageData?.text || "No content found on page.";
        const combinedPrompt = `Context from webpage: ${pageText}\n\nUser Question: ${request.text}`;

        try {
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
    return true; 
  }
});