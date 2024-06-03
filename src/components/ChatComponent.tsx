"use client";
import React, { useEffect, useRef, useState } from "react";
import { Input } from "./ui/input";
import { useChat } from "ai/react";
import MessageList from "./MessageList";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Message } from "ai";
type Props = {
  chatId: number;
};

const ChatComponent = ({ chatId }: Props) => {
  const inputref = useRef<HTMLInputElement>();

  const { data, isLoading } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      const response = await axios.post<Message[]>("/api/get-messages", {
        chatId,
      });
      return response.data;
    },
  });

  const { input, handleInputChange, handleSubmit, messages } = useChat({
    api: "/api/chat",
    body: {
      chatId,
    },
    initialMessages: data || [],
  });

  useEffect(() => {}, []);

  useEffect(() => {
    const messageContainer = document.getElementById("message-container");
    if (messageContainer) {
      messageContainer.scrollTo({
        top: messageContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div className="flex flex-col justify-between w-full h-full bg-white">
      <div
        className="flex flex-col h-full overflow-auto"
        id="message-container"
      >
        <div className="sticky inset-x-0 top-0 p-3 bg-gray-200">
          <h3 className="text-xl font-bold">Chat</h3>
        </div>
        <p className="max-w-xl p-2 m-4 text-lg text-center text-gray-500 bg-gray-100 rounded-md">
          {
            "This is a chat component. You can ask any question and get a response from the AI model."
          }
        </p>
        <MessageList message={messages} isLoading={isLoading} />
      </div>
      <form
        onSubmit={handleSubmit}
        className="inset-x-0 flex px-1 py-3 mx-1 bg-white sticy"
      >
        <Input
          value={input}
          onChange={handleInputChange}
          placeholder="Ask any question"
          className="w-full"
        />
        <Button className="ml-2 bg-blue-500">
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
};

export default ChatComponent;
