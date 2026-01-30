from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import uvicorn

from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, AIMessage


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

load_dotenv()

llm = ChatGroq(
    model="llama-3.1-8b-instant",
    temperature=0.7
)


chat_history = [] 


class AskRequest(BaseModel):
    text: str

class AskResponse(BaseModel):
    answer: str


@app.get("/")
def greet():
    return {"message": "SmartPage AI backend running on port 5001"}

@app.post("/ask", response_model=AskResponse)
async def ask_ai(data: AskRequest):
    global chat_history

    chat_history.append(HumanMessage(content=data.text))

    response = await llm.ainvoke(chat_history)

    chat_history.append(AIMessage(content=response.content))

    return {"answer": response.content}

@app.post("/reset")
def reset_chat():
    chat_history.clear()
    return {"message": "Chat history cleared"}

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=5001,
        reload=True
    )
