"use client";
import Searchbar from "@/components/searchbar";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { BufferMemory } from "langchain/memory";
import { CloudflareD1MessageHistory } from "@langchain/cloudflare";
import { useAuth } from "@clerk/nextjs";

export default function Chat() {
  const params = useParams();
  const searchParams = useSearchParams();

  const chatID = params.id as string;
  const prompt = searchParams.get("prompt");
  const pageURL = searchParams.get("pageURL");
  const { userId } = useAuth();
  const didEffectRun = useRef(false);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    if (didEffectRun.current) return;
    didEffectRun.current = true;
    const checkAccess = async () => {
      console.log(userId);
      const response = await fetch("/api/chat-access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatID,
          userId,
        }),
      });

      const data = await response.json();
      console.log(data);
    };

    checkAccess();
  }, [chatID, userId]);

  const handleSubmit = (text: string) => {
    console.log("Submitted text:", text);
    // Implement your submit logic here
  };

  return (
    <div className="flex flex-col justify-between h-[90vh]">
      <div className="flex flex-col overflow-y-auto"></div>
      <div className="ml-4 mr-4">
        <Searchbar onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
