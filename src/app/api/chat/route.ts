import { Configuration, OpenAIApi } from "openai-edge";
import {
  StreamingTextResponse,
  Message,
  generateText,
  GoogleGenerativeAIStream,
} from "ai";
import { createStreamableValue } from "ai/rsc";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getContext } from "@/lib/context";
import { db } from "@/lib/db";
import { chats, messages as _messages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const runtime = "edge";

// const config = new Configuration({
//   apiKey: process.env.GEMINI_API_KEY,
// });

// const openai = new OpenAIApi(config);

// import { createGoogleGenerativeAI } from "@ai-sdk/google";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
const model = genAI.getGenerativeModel({
  model: "gemini-pro",
});

export async function POST(req: Request) {
  try {
    const { messages, chatId } = await req.json();
    const _chat = await db.select().from(chats).where(eq(chats.id, chatId));
    if (_chat.length != 1) {
      return NextResponse.json(
        {
          error: "Chat not found",
        },
        { status: 404 }
      );
    }
    const fileKey = _chat[0].fileKey;
    const lastmessage = messages[messages.length - 1];

    const context = await getContext(lastmessage.content, fileKey);
    console.log("CONTEXT", context);
    const prompt = {
      role: "system",
      content: `AI assistant is a brand new, powerful, human-like artificial intelligence.
        The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
        AI is a well-behaved and well-mannered individual.
        BE short and concise with maximum 3 sentences.
        AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
        AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
        AI assistant is a big fan of Pinecone and Vercel.
        START CONTEXT BLOCK
        ${context}
        END OF CONTEXT BLOCK
        AI assistant will not repeat the previous response.
        AI assistant should give response in fewer sentences than the context.
        AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
        If the context does not provide the answer to question, the AI assistant will say, "I'm sorry, but I don't know the answer to that question".
        AI assistant will not apologize for previous responses, but instead will indicated new information was gained.
        AI assistant will not invent anything that is not drawn directly from the context.
        `,
    };
    const messagesWithPrompt = [
      prompt,
      ...messages.filter((message: Message) => message.role === "user"),
      {
        role: "user",
        content:
          "Only Answer the Last Question. Do not repeat the previous response.",
      },
    ];

    const finalPrompt = JSON.stringify(messagesWithPrompt);
    console.log("MESSAGES WITH PROMPT", messagesWithPrompt);

    const response = await model.generateContentStream(finalPrompt);
    const stream = GoogleGenerativeAIStream(response, {
      onStart: async () => {
        await db.insert(_messages).values({
          chatId: chatId,
          content: lastmessage.content,
          role: "user",
        });
      },
      onCompletion: async (result) => {
        await db.insert(_messages).values({
          chatId: chatId,
          content: result,
          role: "system",
        });
      },
    });
    return new StreamingTextResponse(stream);
  } catch (error) {
    return "error occured";
  }
}
