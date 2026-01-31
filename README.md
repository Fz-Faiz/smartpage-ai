# 🚀 SmartPage-AI

**SmartPage-AI** is a full-stack Chrome extension that lets you **chat with any webpage**.  
Powered by **Groq's Llama 3.1**, it analyzes page content or selected text to deliver instant, context-aware answers.

> 💡 Think of it as **ChatGPT for every webpage you open.**

---

# 🌟 Preview

## 💬 Popup Interface

> Replace these with your latest popup screenshots.

![Popup Screenshot 1](https://github.com/Fz-Faiz/smartpage-ai/blob/main/images/SP%20%20popup.png)

---

## ⚙️ Settings Page

> Replace these with your settings screenshots.

![Settings Screenshot 1](https://github.com/Fz-Faiz/smartpage-ai/blob/main/images/SP%20setting.png)

---

# ✨ Features

✅ **Smart Selection**  
Highlight text on any webpage and click the floating button to instantly pre-fill your query.

✅ **Page Context Awareness**  
The AI reads the current webpage and answers questions specifically about what you're viewing.

✅ **Blazing Fast Responses**  
Powered by **Groq’s Llama-3.1-8b-instant** for near-zero latency.

✅ **Cloud Hosted**  
Backend runs on Render for reliable availability.

✅ **Follow-up Conversations**  
Ask deeper questions without losing context.

---

# 🛠️ Tech Stack

### Frontend
- React  
- Vite  
- Chrome Extension API (Manifest V3)

### Backend
- FastAPI (Python)  
- LangChain  

### AI
- Llama 3.1 8B via Groq Cloud  

### Deployment
- Render  

---

# 📥 Direct Installation (For Users)

Install the extension locally in under a minute.

## Step 1 — Download
Go to the **Releases** page and download: SmartPage-AI-v1.0.zip


## Step 2 — Unzip
Extract it to a folder on your computer.

Example: Documents/SmartPage-AI


## Step 3 — Load into Chrome

1. Open: chrome://extensions/


2. Enable **Developer Mode** (top-right)  
3. Click **Load unpacked**  
4. Select the folder containing `manifest.json`

✅ Done!

---

# ☕ Important: Wake Up the Server

Since the backend is hosted on **Render Free Tier**, it sleeps after **15 minutes of inactivity**.

👉 Click the link below before using the extension: https://smartpage-ai.onrender.com

**Wake Up SmartPage AI Backend**

If you see: {"status": "online"}


You’re ready to chat!

---


📖 Usage Guide
1. Select Text
Highlight any sentence on a website.

2. Ask SmartPage
Click the ✨ floating button.

3. Open Popup
Click the extension icon — your selected text is already there.

4. Chat Freely
Ask follow-up questions about the page.

## ⚠️ Important Notes
✅ Cold Starts
If the server is asleep, the first request may take ~30 seconds.

✅ Token Limits
Optimized for Groq Free Tier (6,000 tokens/min). Extremely long articles may be truncated for stability.

## 🔥 Why This Project Matters
SmartPage-AI demonstrates real-world engineering skills:

- AI-powered product development

- Chrome Extension architecture

- Full-stack system design

- Context-aware LLM integration

- FastAPI + LangChain orchestration

- Cloud deployment

## ⭐ Future Improvements
- Conversation history

- Multi-page memory

- Voice input

- One-click summaries

- Team knowledge assistant mode








