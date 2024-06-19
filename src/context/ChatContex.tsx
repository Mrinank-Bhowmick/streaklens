"use client";
import React, { createContext, useState } from "react";

interface ChatData {
  prompt: string;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  pageURL: string | null;
  setPageURL: React.Dispatch<React.SetStateAction<string | null>>;
  pageDescription: string | null;
  setPageDescription: React.Dispatch<React.SetStateAction<string | null>>;
  ImageURL: string | null;
  setImageURL: React.Dispatch<React.SetStateAction<string | null>>;
  title: string | null;
  setTitle: React.Dispatch<React.SetStateAction<string | null>>;
}

export const ChatContext = createContext<ChatData | null>(null);

const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [prompt, setPrompt] = useState("");
  const [pageURL, setPageURL] = useState<string | null>(null);
  const [pageDescription, setPageDescription] = useState<string | null>(null);
  const [ImageURL, setImageURL] = useState<string | null>(null);
  const [title, setTitle] = useState<string | null>(null);

  return (
    <div>
      <ChatContext.Provider
        value={{
          prompt,
          setPrompt,
          pageURL,
          setPageURL,
          pageDescription,
          setPageDescription,
          ImageURL,
          setImageURL,
          title,
          setTitle,
        }}
      >
        {children}
      </ChatContext.Provider>
    </div>
  );
};

export default ChatProvider;
