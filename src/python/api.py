import numpy as np
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from sentence_transformers import SentenceTransformer
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from langchain.chains.combine_documents.stuff import StuffDocumentsChain
from langchain.chains.llm import LLMChain
from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate
import dotenv

dotenv.load_dotenv()
app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/python")
def hello_world():
    return {"message": "Hello World"}


class Item(BaseModel):
    text: str


texts = []


@app.post("/api/python")
def generate_embeddings(text: Item):
    print(text)
    model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
    embeddings = model.encode([text.text])
    return {"embeddings": JSONResponse(np.array(embeddings).tolist())}


@app.post("/api/add_text")
def add_text(item: Item):
    # Add the new chunk of text to the list
    texts.append(item.text)
    return {"message": "Text added successfully."}


@app.post("/api/summarize")
def summarize_text():

    textInput = ' '.join(texts)

    prompt_template = """Write a concise summary of the following:
                        "{textInput}"
                        CONCISE SUMMARY:"""
    prompt = PromptTemplate.from_template(prompt_template)
    # Define LLM chain
    llm = ChatOpenAI(temperature=0, model="gpt-3.5-turbo")
    llm_chain = LLMChain(llm=llm, prompt=prompt)

    # Define StuffDocumentsChain
    summary = llm_chain.run(textInput=textInput)

    # Get the summary
    print(summary)

    return {"summary": summary}
