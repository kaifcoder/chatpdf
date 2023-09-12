import { cn } from "@/lib/utils";
import { Message } from "ai/react";
import { BotIcon, Loader2, UserIcon } from "lucide-react";
import React from "react";

type Props = {
  message: Message[];
  isLoading: boolean;
};

const MessageList = ({ message, isLoading }: Props) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }
  if (message.length === 0)
    return (
      <div className="flex items-center justify-center h-full text-black">
        No messages yet!
      </div>
    );
  return (
    <div className="flex flex-col gap-2 px-4 py-1">
      {message.map((msg) => (
        <div
          key={msg.id}
          className={cn("flex items-center mt-2", {
            "justify-end pl-5": msg.role === "user",
            "justify-start pr-5": msg.role === "assistant",
          })}
        >
          <div
            className={cn("rounded-lg", {
              "bg-blue-500 text-white": msg.role === "user",
              "bg-gray-200 text-gray-900": msg.role === "assistant",
            })}
          >
            <p className="p-2 text-sm">{msg.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
