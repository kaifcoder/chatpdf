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
