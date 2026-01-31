chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Message received:", request.type);

 
  if (request.type === "PREFILL_TEXT") {
    chrome.storage.local.set({ pendingText: request.text }, () => {
      sendResponse({ status: "saved" });
    });
    return true;
  }


  if (request.type === "POPUP_ASK") {
    handleChatRequest(request.text, sendResponse);
    return true; 
  }
});

async function handleChatRequest(userText, sendResponse) {
  try {
    
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) {
      sendResponse({ error: "No active tab found." });
      return;
    }
\
    const pageData = await new Promise((resolve) => {
      chrome.tabs.sendMessage(tab.id, { type: "GET_PAGE_CONTENT" }, (response) => {
        if (chrome.runtime.lastError) resolve({ text: "" });
        else resolve(response);
      });
    });

    const pageText = pageData?.text || "";
    const combinedPrompt = `Context: ${pageText.substring(0, 3000)}\n\nUser Question: ${userText}`;

    const response = await fetch("https://smartpage-ai.onrender.com/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: combinedPrompt })
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    sendResponse({ answer: data.answer });

  } catch (err) {
    console.error("Full Error:", err);
    sendResponse({ error: "AI is waking up or connection failed. Try again in 10 seconds." });
  }
}