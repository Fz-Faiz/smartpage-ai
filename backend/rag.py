from langchain_text_splitters import RecursiveCharacterTextSplitter
# ✅ new
from langchain_huggingface import HuggingFaceEmbeddings

from langchain_community.vectorstores import FAISS
from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
from dotenv import load_dotenv

load_dotenv()
# ----------------------
# Embeddings
# ----------------------
embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

# ----------------------
# LLM (Groq)
# ----------------------
llm = ChatGroq(
    model="llama-3.1-8b-instant",
    temperature=0.0
)

# ----------------------
# Prompt (context-based)
# ----------------------
PROMPT = PromptTemplate(
    input_variables=["context", "question"],
    template="""
You are an AI assistant.

Answer the question using ONLY the context below.
You may paraphrase and infer logically from the context.
If the context is insufficient, say so clearly.

CONTEXT:
{context}

QUESTION:
{question}
"""
)

# ----------------------
# Main RAG function
# ----------------------
def answer_with_rag(page_content: str, question: str) -> str:
    # 1️⃣ split text
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=800,
        chunk_overlap=150
    )
    chunks = splitter.split_text(page_content)

    # 2️⃣ create vector store (in-memory)
    vectorstore = FAISS.from_texts(chunks, embeddings)

    # 3️⃣ retrieve relevant chunks
    docs = vectorstore.similarity_search(question, k=4)
    context = "\n\n".join(d.page_content for d in docs)

    # 4️⃣ build prompt
    prompt = PROMPT.format(
        context=context,
        question=question
    )

    # 5️⃣ ask Groq
    response = llm.invoke(prompt)
    return response.content.strip()
