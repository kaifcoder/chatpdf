"use client";
import { DrizzleChat } from "@/lib/db/schema";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { MessageCircle, PlusCircle, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  chats: DrizzleChat[];
  chatId: number;
};

const ChatSidebar = ({ chatId, chats }: Props) => {
  return (
    <div className="flex flex-col justify-between w-full h-screen p-4 text-gray-200 bg-gray-900 ">
      <div>
        <Link href={"/"}>
          <Button className="w-full border border-white border-dashed">
            <PlusCircle className="mr-2 " />
            New Chat
          </Button>
        </Link>
        <div className="flex flex-col gap-2 mt-4">
          {chats.map((chat) => (
            <Link key={chat.id} href={`/chat/${chat.id}`}>
              <div
                className={cn(
                  "w-full rounded-lg text-slate-300 flex items-center p-2",
                  {
                    "bg-blue-500 text-white": chat.id === chatId,
                    "hover: text-white": chat.id !== chatId,
                  }
                )}
              >
                <MessageCircle className="mr-2" />
                <p className="w-full overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis">
                  {chat.pdfName}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="">
        <div className="">
          <Button className="w-full mb-2 transition-all duration-100 bg-gradient-to-r from-gray-700 via-gray-900 to-gray-700 hover:text-lg">
            <Zap className="mr-2" />
            Upgrade
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 text-sm text-gray-300 ">
          <Link href={"/"} className="hover:text-white">
            Home
          </Link>
          <Link href={"/"} className="hover:text-white">
            Source
          </Link>
        </div>
        <div>
          <p className="text-xs text-slate-300">Made with ❤️ by Mohd Kaif</p>
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;
