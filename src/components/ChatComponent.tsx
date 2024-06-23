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
import Markdown from "./Markdown";

type Props = {
  chatId: number;
};

const ChatComponent = ({ chatId }: Props) => {
  const inputref = useRef<HTMLInputElement>(null);
  const formref = useRef<HTMLFormElement>(null);

  const [summary, setSummary] = useState<string>("");

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

  // call localhost:8000/api/summarize to get the summary of the document
  const getSummary = async () => {
    const response = await fetch("http://127.0.0.1:8000/api/summarize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await response.json();
    setSummary(data.summary);

    // insert this summary to the chat

    return data;
  };

  useEffect(() => {
    getSummary();
  }, []);

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
        <p>
          <p className="ml-4 text-sm font-semibold">Summary of the PDF:</p>
          {summary && summary.length > 0 ? (
            <div className="max-w-xl p-2 m-4 text-gray-900 bg-gray-100 rounded-md text-md">
              <Markdown text={`${summary}`} />
            </div>
          ) : null}
        </p>
        <MessageList message={messages} isLoading={isLoading} />
      </div>
      <form
        ref={formref}
        onSubmit={handleSubmit}
        className="inset-x-0 flex px-1 py-3 mx-1 bg-white sticy"
      >
        <Input
          value={input}
          ref={inputref}
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
