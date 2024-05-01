"use client";
import React, { use, useEffect, useRef, useState } from "react";

const Page = () => {
  const [conversations, setConversations] = useState([
    { role: "User", text: "My prompt" },
    { role: "Server", text: "ok" },
    // Add more conversations here
  ]);
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef?.current.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [conversations]);

  const handleNewMessage = (event) => {
    if (event.key === "Enter") {
      setConversations([
        ...conversations,
        { role: "User", text: event.target.value },
        { role: "Server", text: "ok" },
      ]);
      event.target.value = "";
    }
  };
  return (
    <>
      <div className="flex flex-col h-[80vh]">
        <div className="overflow-auto">
          {conversations.map((conversation, index) => (
            <div
              key={index}
              className="flex flex-col items-start justify-start p-4"
            >
              <div className="font-bold">{conversation.role}:</div>
              <div className="">{conversation.text}</div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="fixed bottom-0 left-0 right-0 p-4 md:ml-64">
          <input
            type="text"
            placeholder="Type prompt..."
            className="border border-gray-300 rounded-lg p-3 w-full "
            onKeyDown={handleNewMessage}
          />
        </div>
      </div>
    </>
  );
};

export default Page;
