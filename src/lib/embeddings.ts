import { OpenAIEmbeddings } from "langchain/embeddings/openai";

const embeddings = new OpenAIEmbeddings({
  maxConcurrency: 3,
});

export async function getEmbeddings(text: string) {
  try {
    const result = await embeddings.embedQuery(text);
    return result as number[];
  } catch (error) {
    console.log("ERROR GETTING EMBEDDINGS", error);
    throw error;
  }
}

export async function getEmbeddingsfrompython(text: string) {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/python", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: text,
      }),
    });

    const responseAppend = await fetch("http://127.0.0.1:8000/api/add_text", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: text,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();
    const bodyArray = JSON.parse(data.embeddings.body);
    return bodyArray[0] as number[];
  } catch (error) {
    console.log("ERROR GETTING EMBEDDINGS", error);
    throw error;
  }
}
