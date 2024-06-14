"use client";
import Searchbar from "@/components/searchbar";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState, useRef, useContext } from "react";
import { ChatContext } from "@/context/ChatContex";
export const runtime = "edge";

export default function Chat() {
  const params = useParams();
  const chatID = params.id as string;
  const chatData = useContext(ChatContext);

  if (!chatData) {
    throw new Error("Chat Data not received");
  }
  const { prompt, pageURL } = chatData;

  const didEffectRun = useRef(false);
  const [HumanMessage, setHumanMessage] = useState<Array<string>>([]);
  const [AIMessage, setAIMessage] = useState<Array<string>>([]);
  const [ChatHistory, setChatHistory] = useState<Array<React.JSX.Element>>([]);

  useEffect(() => {
    if (didEffectRun.current) return;
    didEffectRun.current = true;

    const checkAccess = async () => {
      const response = await fetch("/api/chat-access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatID,
        }),
      });

      const data: any = await response.json();
      console.log(data);

      const newHumanMessages: Array<string> = [];
      const newAIMessages: Array<string> = [];

      data.messageHistory.forEach((message: any) => {
        if (message.id.includes("HumanMessage")) {
          newHumanMessages.push(message.kwargs.content);
        } else if (message.id.includes("AIMessage")) {
          newAIMessages.push(message.kwargs.content);
        }
      });

      setHumanMessage(newHumanMessages);
      setAIMessage(newAIMessages);
    };

    if (prompt === "") {
      checkAccess();
    }
  }, [prompt, chatID]);

  useEffect(() => {
    const updatedChatHistory: Array<React.JSX.Element> = [];

    for (let i = 0; i < Math.max(HumanMessage.length, AIMessage.length); i++) {
      if (i < HumanMessage.length) {
        updatedChatHistory.push(
          <div key={`human-${i}`} className="flex justify-end">
            <div className="rounded-md bg-slate-800 p-4 mt-2 mb-2">
              {HumanMessage[i]}
            </div>
          </div>
        );
      }
      if (i < AIMessage.length) {
        updatedChatHistory.push(<div key={`ai-${i}`}>{AIMessage[i]}</div>);
      }
    }

    setChatHistory(updatedChatHistory);
  }, [HumanMessage, AIMessage]);

  const handleSubmit = async (text: string) => {
    console.log("Submitted text:", text);
    setChatHistory((prevChatHistory) => [
      ...prevChatHistory,
      <div key={`human-${prevChatHistory.length}`} className="flex justify-end">
        <div className="rounded-md bg-slate-800 p-4 mt-2 mb-2">{text}</div>
      </div>,
    ]);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: text,
        pageURL,
      }),
    });
    const data = await response.json();
    console.log(data);
  };

  return (
    <div className="flex flex-col justify-between h-[90vh]">
      <div className="overflow-x-auto">
        <div className="flex flex-col md:ml-8 md:mr-8 md:mb-16 ml-4 mr-4 mb-8">
          <div>ChatID: {chatID}</div>
          <div>Prompt: {prompt}</div>
          <div>PageURL: {pageURL}</div>
          <div>{ChatHistory.length > 0 ? ChatHistory : ""}</div>
        </div>
      </div>
      <div className="ml-4 mr-4">
        <Searchbar onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
