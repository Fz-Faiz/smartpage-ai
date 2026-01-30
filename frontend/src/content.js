let floatingButton = null;


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "GET_PAGE_CONTENT") {
    const text = document.body.innerText.replace(/\s+/g, ' ').trim().substring(0, 3000);
    sendResponse({ text: text });
  }
  return true;
});

document.addEventListener("mouseup", (event) => {
  const selection = window.getSelection();
  const selectedText = selection.toString().trim();

  if (floatingButton) {
    if (floatingButton.contains(event.target)) return;
    floatingButton.remove();
    floatingButton = null;
  }

  if (selectedText.length > 0) {
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    floatingButton = document.createElement("button");
    floatingButton.innerText = "✨ Ask SmartPage";
    
    
    Object.assign(floatingButton.style, {
      position: 'fixed',
      left: `${rect.left}px`,
      top: `${rect.bottom + 5}px`,
      zIndex: '2147483647', 
      backgroundColor: '#6366f1',
      color: 'white',
      border: 'none',
      padding: '8px 16px',
      borderRadius: '20px',
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: 'bold',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      pointerEvents: 'auto',
      userSelect: 'none'
    });

    floatingButton.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();


      if (!chrome.runtime?.id) {
        alert("Extension reloaded. Please refresh the page!");
        return;
      }

      chrome.runtime.sendMessage({ 
        type: "PREFILL_TEXT", 
        text: selectedText 
      });

    
      floatingButton.innerText = "✅ Saved! Click icon";
      floatingButton.style.backgroundColor = "#10b981"; 
      
      setTimeout(() => {
        if (floatingButton) {
          floatingButton.remove();
          floatingButton = null;
        }
      }, 2000);
    };

    document.body.appendChild(floatingButton);
  }
});

document.addEventListener("mousedown", (e) => {
  if (floatingButton && !floatingButton.contains(e.target)) {
    floatingButton.remove();
    floatingButton = null;
  }
});