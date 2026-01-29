from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import uvicorn

from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, AIMessage

# ----------------------
# App setup
# ----------------------
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------
# Env & Model
# ----------------------
load_dotenv()

llm = ChatGroq(
    model="llama-3.1-8b-instant",
    temperature=0.7
)

# ----------------------
# Simple in-memory chat history
# ----------------------
chat_history = []  # list[HumanMessage | AIMessage]

# ----------------------
# Schema
# ----------------------
class AskRequest(BaseModel):
    text: str

class AskResponse(BaseModel):
    answer: str

# ----------------------
# Routes
# ----------------------
@app.get("/")
def greet():
    return {"message": "SmartPage AI backend running on port 5001"}

@app.post("/ask", response_model=AskResponse)
async def ask_ai(data: AskRequest):
    global chat_history

    # add user message
    chat_history.append(HumanMessage(content=data.text))

    # call model with full history
    response = await llm.ainvoke(chat_history)

    # add AI response
    chat_history.append(AIMessage(content=response.content))

    return {"answer": response.content}

@app.post("/reset")
def reset_chat():
    chat_history.clear()
    return {"message": "Chat history cleared"}

# ----------------------
# Run server
# ----------------------
if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=5001,
        reload=True
    )
