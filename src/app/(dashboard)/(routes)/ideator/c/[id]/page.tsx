"use client";
import Searchbar from "@/components/searchbar";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef, useContext } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { ChatContext } from "@/context/ChatContex";
import Markdown from "react-markdown";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";

export const runtime = "edge";

export default function Chat() {
  const params = useParams();
  const chatData = useContext(ChatContext);
  if (!chatData) {
    throw new Error("Chat Data not received");
  }
  const { prompt, pageURL, pageDescription, ImageURL, title } = chatData;

  const chatID = params.id as string;
  const { userId } = useAuth();
  const { user } = useUser();
  const didEffectRun = useRef(false);
  const [chat_history, set_chat_history] = useState<string[][]>([[]]);
  const [streamData, setStreamData] = useState("");
  const [input_when_streaming, set_input_when_streaming] = useState("");
  const [streaming, setStreaming] = useState(false);
  let basePath = "";
  try {
    basePath =
      process.env.NODE_ENV === "development"
        ? "http://127.0.0.1:8787/backend"
        : "/backend";
  } catch {
    basePath = "/backend";
  }
  useEffect(() => {
    if (!user || didEffectRun.current) return;
    didEffectRun.current = true;
    const checkAccess = async () => {
      const response = await fetch(`${basePath}/chat-access`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatID,
          username: user?.firstName,
          userID: userId,
        }),
      });

      const data: any = await response.json();
      if (data.hasAccess === false) {
        toast.error("Unable to load conversation (Refresh)");
      } else if (data.messageHistory.length > 0) {
        const chatConversation: string[][] = [];
        let chatConversationElement: string[] = [];

        data.messageHistory.forEach((message: any, index: number) => {
          if (message.id.includes("HumanMessage")) {
            chatConversationElement.push(message.kwargs.content);
          } else if (message.id.includes("AIMessage")) {
            chatConversationElement.push(message.kwargs.content);
          }

          // If we have a pair of messages or we're at the last message, push the pair to the chatConversation
          if (
            chatConversationElement.length === 2 ||
            index === data.messageHistory.length - 1
          ) {
            chatConversation.push(chatConversationElement);
            chatConversationElement = []; // Reset for the next pair
          }
        });

        console.log(chatConversation);
        set_chat_history(chatConversation);
      }
    };

    if (prompt) {
      const first_chat_conversation: string[][] = [];
      const first_chat_conversation_element: string[] = [];
      first_chat_conversation_element.push(prompt);
      setStreaming(true);
      set_input_when_streaming(prompt);
      const first_chat = fetch(`${basePath}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt,
          pageURL,
          chatID,
          userID: userId,
          username: user?.firstName,
          chat_history: chat_history,
        }),
      })
        .then(async (response) => {
          if (!response.body) {
            throw new Error("Error while generating response");
          }
          const decoder = new TextDecoder("utf-8");
          const reader = response.body.getReader();
          let chunks = "";
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              setStreaming(false);
              first_chat_conversation_element.push(chunks);
              first_chat_conversation.push(first_chat_conversation_element);
              set_chat_history(first_chat_conversation);
              break;
            }
            const decoded_value = decoder.decode(value);
            chunks += decoded_value;
            setStreamData(chunks);
          }
        })
        .catch((error) => console.error(error));
    } else if (prompt === "") {
      console.log(user?.firstName);
      checkAccess();
    }
  }, [user?.firstName]);

  const handleSubmit = async (text: string) => {
    let temp_chat_conversation = [];
    temp_chat_conversation.push(text);
    setStreamData("");
    set_input_when_streaming(text);
    setStreaming(true);
    console.log(pageURL);

    const response = await fetch(`${basePath}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: text,
        pageURL,
        chatID,
        userID: userId,
        username: user?.firstName,
        chat_history: chat_history,
      }),
    });
    if (!response.body) {
      throw new Error("Error while generating response");
    }

    const decoder = new TextDecoder("utf-8");
    const reader = response.body.getReader();
    let chunks = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      const decoded_value = decoder.decode(value);
      chunks += decoded_value;
      setStreamData(chunks);
    }

    temp_chat_conversation.push(chunks);
    setStreaming(false);
    set_chat_history((prevChatHistory) => [
      ...prevChatHistory,
      temp_chat_conversation,
    ]);
  };

  return (
    <div className="text-white h-fill-available">
      <Toaster
        toastOptions={{
          duration: 10000,
        }}
      />
      <div className="flex flex-col justify-between h-[90dvh]">
        <div className="overflow-x-auto">
          <div className="flex flex-col md:ml-8 md:mr-8 md:mb-16 ml-4 mr-4 mb-8">
            <div className="flex">
              {pageURL ? (
                <div className="flex flex-col w-full">
                  <div className="mt-6 flex justify-center">
                    <img
                      src={ImageURL as string}
                      style={{ width: "100dvh", height: "35dvh" }}
                    />
                  </div>
                  <div className="text-2xl md:text-4xl mt-3">{title}</div>
                  <div className="mt-2">{pageDescription}</div>
                  <Link href={pageURL} className="flex text-blue-500 mt-2">
                    Visit The Original Article
                  </Link>
                  <div>
                    This article&apos;s information will be automatically
                    removed after 24 hours
                  </div>
                </div>
              ) : null}
            </div>
            <div>
              {chat_history.map((element, index) => (
                <div key={index}>
                  <div className="flex justify-end">
                    <div className="rounded-md bg-slate-800 p-4 mt-2 mb-2">
                      {element[0]}
                    </div>
                  </div>
                  <div>
                    <Markdown>{element[1]}</Markdown>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              {streaming ? (
                <div className="rounded-md bg-slate-800 p-4 mt-2 mb-2">
                  {input_when_streaming}
                </div>
              ) : null}
            </div>
            <div>{streaming ? <Markdown>{streamData}</Markdown> : ""}</div>
          </div>
        </div>
        <div className="ml-4 mr-4">
          <Searchbar onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
}
