"use client";

import React from "react";
import { Button } from "./ui/button";
import { redirect, useRouter } from "next/navigation";

type Props = {
  auth: boolean;
};

const GoToChats = ({ auth }: Props) => {
  const router = useRouter();
  const handleclick = () => {
    if (!auth) {
      router.replace("/sign-in");
    }
    router.push("/chat/1");
  };
  return (
    <div className="flex mt-3">
      {auth && <Button onClick={handleclick}>Go to Chats</Button>}
    </div>
  );
};

export default GoToChats;
