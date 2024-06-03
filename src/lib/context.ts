import {
  Pinecone,
  PineconeRecord,
  RecordMetadata,
} from "@pinecone-database/pinecone";
import { convertToASCII } from "./utils";
import { getEmbeddings, getEmbeddingsfrompython } from "./embeddings";

export async function getMatchesfromEmbeddings(
  embeddings: number[],
  fileKey: string
) {
  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
  });

  const index = pinecone.Index("chatpdf");
  try {
    const namespace = convertToASCII(fileKey);

    const queryResult = await index.namespace(namespace).query({
      topK: 3,
      vector: embeddings,
      includeMetadata: true,
    });

    return queryResult.matches || [];
  } catch (error) {
    console.log("ERROR GETTING MATCHES", error);
  }
}

export async function getContext(query: string, fileKey: string) {
  const queryEmbeddings = await getEmbeddingsfrompython(query);

  const matches = await getMatchesfromEmbeddings(queryEmbeddings, fileKey);
  const qualifyingDocs = matches?.filter(
    (match) => match.score && match.score > 0.05
  );
  type metadata = {
    text: string;
    pageNumber: number;
  };
  let docs = qualifyingDocs?.map((doc) => (doc.metadata as metadata).text);

  return docs?.join("\n");
}
