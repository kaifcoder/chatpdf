// api/create-chat

import { loadS3intoPincone } from "@/lib/pinecone";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json();
    const { file_key, file_name } = body;
    const pages = await loadS3intoPincone(file_key);
    console.log("PAGES", pages);
    return NextResponse.json({ pages });
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
