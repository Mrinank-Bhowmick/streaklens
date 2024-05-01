"use client";
import React, { useState, useEffect, useRef } from "react";

interface Chat {
  userMessage: string;
  serverResponse: string;
}

const SimpleForm: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [chats, setChats] = useState<Chat[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chats]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newChat: Chat = {
      userMessage: inputValue,
      serverResponse: "Accepted", // Assuming a fixed response for now
    };
    setChats([...chats, newChat]);
    setInputValue("");
  };

  return (
    <>
      <div className="flex flex-col items-center justify-end h-screen p-4">
        <div className="flex flex-col w-full h-100vh overflow-y-auto">
          {chats.map((chat, index) => (
            <div key={index} className="my-2">
              <div>User: {chat.userMessage}</div>
              <div>Server: {chat.serverResponse}</div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div>
        <form onSubmit={handleSubmit} className="w-full p-4 flex">
          <label className="block flex-grow">
            Enter your message:
            <input
              className="border border-gray-400 rounded p-2 w-full"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </label>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-2 py-2 mt-1 ml-2 rounded"
            type="submit"
          >
            Send
          </button>
        </form>
      </div>
    </>
  );
};

export default SimpleForm;
