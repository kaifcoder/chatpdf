import ChatComponent from "@/components/ChatComponent";
import ChatSidebar from "@/components/ChatSidebar";
import PDFViewer from "@/components/PDFViewer";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

type Props = {
  params: {
    chatId: string;
  };
};

const page = async ({ params: { chatId } }: Props) => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/sign-in");
  }
  const _chats = await db.select().from(chats).where(eq(chats.userId, userId));
  if (!_chats) {
    return redirect("/");
  }
  if (!_chats.find((chat) => chat.id === parseInt(chatId))) {
    return redirect("/");
  }
  const currentChat = _chats.find((chat) => chat.id === parseInt(chatId));
  return (
    <div className="flex max-h-screen overflow-auto">
      <div className="flex w-full overflow-auto max-h-screeen">
        <div className="flex-[2] max-w-sm">
          <ChatSidebar chats={_chats} chatId={parseInt(chatId)} />
        </div>
        <div className="max-h-screen p-4 flex-[5] overflow-auto">
          <PDFViewer pdf_url={currentChat?.pdfUrl!} />
        </div>
        <div className="flex-[3] border-l-2 max-h-screen border-l-slate-500">
          <ChatComponent chatId={parseInt(chatId)} />
        </div>
      </div>
    </div>
  );
};

export default page;
