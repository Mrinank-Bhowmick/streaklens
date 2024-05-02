"use client";
import FeatureSection from "@/components/FeatureSection";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

interface Conversation {
  role: string;
  text: string;
}

const ChatApp = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [message, setMessage] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef?.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversations]);

  const handleNewMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setConversations([...conversations, { role: "User", text: message }]);

    try {
      const prompt = message;
      setMessage("");
      const res = await axios.post("/api/ideator", { messages: prompt }); // for testing : { data: "Random" };
      setConversations([
        ...conversations,
        { role: "User", text: message },
        { role: "Server", text: res.data },
      ]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="flex flex-col h-[80vh] overflow-auto">
        <FeatureSection
          title="Ideator"
          form={
            <div className="overflow-auto">
              {conversations.map((conversation, index) => (
                <div key={index} className="flex flex-col p-4 ">
                  <div className="font-bold">{conversation.role}:</div>
                  <div className="">{conversation.text}</div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          }
        />
        <form
          className="flex fixed bottom-0 left-0 right-0 p-4 md:ml-64"
          onSubmit={(e) => handleNewMessage(e)}
        >
          <input
            type="text"
            placeholder="Type prompt..."
            className="border border-gray-300 rounded-lg p-3 w-full "
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button className="bg-blue-700 rounded-md p-2 ml-2" type="submit">
            Send
          </button>
        </form>
      </div>
    </>
  );
};

export default ChatApp;
