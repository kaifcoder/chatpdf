import { PineconeClient } from "@pinecone-database/pinecone";
import { convertToASCII } from "./utils";
import { getEmbeddings } from "./embeddings";

export async function getMatchesfromEmbeddings(
  embeddings: number[],
  fileKey: string
) {
  const pinecone = new PineconeClient();
  await pinecone.init({
    environment: process.env.PINECONE_ENVIRONMENT!,
    apiKey: process.env.PINECONE_API_KEY!,
  });

  const index = pinecone.Index("pdfintelliquery");
  try {
    const namespace = convertToASCII(fileKey);

    const queryResult = await index.query({
      queryRequest: {
        topK: 3,
        vector: embeddings,
        includeMetadata: true,
        namespace,
      },
    });
    return queryResult.matches || [];
  } catch (error) {
    console.log("ERROR GETTING MATCHES", error);
  }
}

export async function getContext(query: string, fileKey: string) {
  const queryEmbeddings = await getEmbeddings(query);

  const matches = await getMatchesfromEmbeddings(queryEmbeddings, fileKey);
  const qualifyingDocs = matches?.filter(
    (match) => match.score && match.score > 0.7
  );
  type metadata = {
    text: string;
    pageNumber: number;
  };
  let docs = qualifyingDocs?.map((doc) => (doc.metadata as metadata).text);
  // 5 para from 5 vectors
  return docs?.join("\n").substring(0, 3000);
}
