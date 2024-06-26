import {
  Pinecone,
  PineconeRecord,
  RecordMetadata,
} from "@pinecone-database/pinecone";
import { downloadFromS3 } from "./s3-server";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import {
  Document,
  RecursiveCharacterTextSplitter,
} from "@pinecone-database/doc-splitter";
import { getEmbeddingsfrompython } from "./embeddings";
import md5 from "md5";
import { convertToASCII } from "./utils";
import { Vector } from "@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch";

let pinecone: Pinecone | null = null;

export const getPineconeClient = async () => {
  if (!pinecone) {
    pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });
  }
  return pinecone;
};

type PDFPage = {
  pageContent: string;
  metadata: {
    loc: {
      pageNumber: number;
    };
  };
};

export async function loadS3intoPincone(file_key: string) {
  const file_name = await downloadFromS3(file_key);
  if (!file_name) {
    throw new Error("Error downloading file from s3");
  }
  const loader = new PDFLoader(file_name);
  const pages = (await loader.load()) as PDFPage[];

  //2. Split the pages into chunks of 1000
  const docs = await Promise.all(pages.map(prepareDocument));

  //3. vectorize the documents
  // docs = [[doc1, doc2], [doc3, doc4]] -> [doc1, doc2, doc3, doc4]
  const vectors = await processDocs(docs.flat());

  //4. upload the vectors to pinecone
  const client = await getPineconeClient();
  const pineconeIndex = client.Index("chatpdf");
  const namespace = convertToASCII(file_key);
  await pineconeIndex
    .namespace(namespace)
    .upsert(vectors as PineconeRecord<RecordMetadata>[]);

  return docs[0];
}

async function processDocs(docs: Document[]) {
  const vectors = [];

  for (let i = 0; i < docs.length; i++) {
    const doc = docs[i];
    try {
      const vector = await embeddDocs(doc);
      vectors.push(vector);
    } catch (error) {
      console.error("ERROR PROCESSING DOC", error);
    }
  }

  return vectors;
}

async function embeddDocs(doc: Document) {
  try {
    const embedding = await getEmbeddingsfrompython(doc.pageContent);
    const hash = md5(doc.pageContent);
    return {
      id: hash,
      values: embedding, // embedding will look like -> [0.1, 0.2, 0.3, 0.4, .......] 384 dimensions
      metadata: {
        text: doc.metadata.text,
        pageNumber: doc.metadata.pageNumber,
      },
    } as Vector;
  } catch (error) {
    console.log("ERROR EMBEDDING DOCS", error);
    throw error;
  }
}

export const truncateStringsByBytes = (str: string, numBytes: number) => {
  const encoder = new TextEncoder();
  return new TextDecoder("utf-8").decode(
    encoder.encode(str).slice(0, numBytes)
  );
};

async function prepareDocument(page: PDFPage) {
  let { pageContent, metadata } = page;
  pageContent = pageContent.replace(/\n/g, " ");
  //split the page content into chunks of 1000 characters
  const splitter = new RecursiveCharacterTextSplitter();
  const docs = await splitter.splitDocuments([
    new Document({
      pageContent,
      metadata: {
        pageNumber: metadata.loc.pageNumber,
        text: truncateStringsByBytes(pageContent, 46000),
      },
    }),
  ]);
  return docs;
}
