"use client";
import React, { createContext, useState } from "react";

interface ChatData {
  prompt: string;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  pageURL: string | null;
  setPageURL: React.Dispatch<React.SetStateAction<string | null>>;
}

export const ChatContext = createContext<ChatData | null>(null);

const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [prompt, setPrompt] = useState("");
  const [pageURL, setPageURL] = useState<string | null>(null);

  return (
    <div>
      <ChatContext.Provider value={{ prompt, setPrompt, pageURL, setPageURL }}>
        {children}
      </ChatContext.Provider>
    </div>
  );
};

export default ChatProvider;
