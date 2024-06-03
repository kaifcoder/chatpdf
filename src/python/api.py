import numpy as np
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from sentence_transformers import SentenceTransformer
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

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


@app.post("/api/python")
def generate_embeddings(text: Item):
    model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
    embeddings = model.encode([text.text])
    return {"embeddings": JSONResponse(np.array(embeddings).tolist())}
