import { useEffect, useState } from "react";

export default function SidePanel() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // Load first AI response when panel opens
  useEffect(() => {
    chrome.storage.local.get("aiResponse", (res) => {
      if (res.aiResponse) {
        setMessages([{ role: "ai", text: res.aiResponse }]);
      }
    });
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // send follow-up to backend
    const res = await fetch("http://localhost:5001/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: input }),
    });

    const data = await res.json();

    setMessages((prev) => [
      ...prev,
      { role: "ai", text: data.answer || "No response" },
    ]);
  };

  const closePanel = () => {
    chrome.sidePanel.setOptions({ enabled: false });
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div
        style={{
          padding: "8px 12px",
          borderBottom: "1px solid #ddd",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <strong>SmartPage AI</strong>
        <button onClick={closePanel}>✕</button>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          padding: 12,
          overflowY: "auto",
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              marginBottom: 10,
              textAlign: m.role === "user" ? "right" : "left",
            }}
          >
            <div
              style={{
                display: "inline-block",
                padding: "8px 10px",
                borderRadius: 8,
                background: m.role === "user" ? "#6366f1" : "#f1f1f1",
                color: m.role === "user" ? "white" : "black",
                maxWidth: "85%",
              }}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div style={{ padding: 8, borderTop: "1px solid #ddd" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask a follow-up..."
          style={{
            width: "100%",
            padding: 8,
            borderRadius: 6,
            border: "1px solid #ccc",
          }}
        />
      </div>
    </div>
  );
}
