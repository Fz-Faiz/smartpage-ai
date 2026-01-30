import { useEffect, useState } from "react";
import Setting from "./Setting";
import "./Popup.css";
import {Settings} from "lucide-react"

export default function Popup() {
  const [page, setPage] = useState("popup");
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [dark, setDark] = useState(false);

  // LOAD dark mode when Popup mounts
  useEffect(() => {
    chrome.storage.sync.get({ darkMode: false }, (result) => {
      setDark(result.darkMode);
    });
  }, []);

  // Inside your useEffect
useEffect(() => {
  const checkPendingText = async () => {
    const data = await chrome.storage.local.get("pendingText");
    if (data.pendingText) {
      setInput(data.pendingText); // This puts the text into your <input>
      chrome.storage.local.remove("pendingText"); // Clear it so it doesn't repeat
    }
  };
  checkPendingText();
}, []);
  // AUTO-FILL selected text (Power Thesaurus behavior)
useEffect(() => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs[0]) return;

    chrome.tabs.sendMessage(
      tabs[0].id,
      { type: "GET_SELECTION" },
      (res) => {
        if (res?.text) {
          setInput(res.text);
        }
      }
    );
  });
}, []);


  if (page === "settings") {
    return (
      <Setting
        dark={dark}
        setDark={setDark}
        goBack={() => setPage("popup")}
      />
    );
  }

const handleAskAI = () => {
  if (!input.trim()) return;

  setResponse("🤖 Thinking...");

  chrome.runtime.sendMessage(
    {
      type: "POPUP_ASK",
      text: input,
    },
    (res) => {
      if (chrome.runtime.lastError) {
        setResponse("❌ Extension error");
        return;
      }

      if (res?.error) {
        setResponse(res.error);
      } else {
        setResponse(res.answer);
      }
    }
  );
};



  return (
    <div className={`popup-container ${dark ? "dark" : ""}`}>
      <div className="popup-header">
        <h3>SmartPageAI</h3>
        <button className="settings-btn" onClick={() => setPage("settings")}>
          <Settings size={16} strokeWidth={2}/>
        </button>
      </div>

      <input
        className="input"
        placeholder="Ask something..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if(e.key == "Enter"){
            handleAskAI()
          }
        }}
      />

      <button className="ask-btn" onClick={handleAskAI}>
        Ask
      </button>

      <div className="response-box">
        {response || "AI response will appear here"}
      </div>
    </div>
  );
}
