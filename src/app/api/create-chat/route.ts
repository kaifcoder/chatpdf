// api/create-chat

import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { loadS3intoPincone } from "@/lib/pinecone";
import { getS3Url } from "@/lib/s3";
import { auth } from "@clerk/nextjs";

import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }
  try {
    const body = await req.json();
    const { file_key, file_name } = body;
    await loadS3intoPincone(file_key);
    const chat_id = await db
      .insert(chats)
      .values({
        fileKey: file_key,
        pdfName: file_name,
        pdfUrl: getS3Url(file_key),
        userId: userId,
      })
      .returning({
        insertedId: chats.id,
      });
    return NextResponse.json(
      { chat_id: chat_id[0].insertedId },
      { status: 200 }
    );
  } catch (error) {
    console.log("CREATE CHAT API ERROR", error);
    return NextResponse.json(
      {
        error: "Something went wrong, Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}
