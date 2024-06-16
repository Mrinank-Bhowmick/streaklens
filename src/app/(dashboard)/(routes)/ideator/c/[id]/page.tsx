"use client";
import Searchbar from "@/components/searchbar";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef, useContext } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { ChatContext } from "@/context/ChatContex";
export const runtime = "edge";

export default function Chat() {
  const params = useParams();
  const chatData = useContext(ChatContext);
  if (!chatData) {
    throw new Error("Chat Data not received");
  }
  const { prompt, pageURL } = chatData;

  const chatID = params.id as string;
  const { userId } = useAuth();
  const { user } = useUser();
  const didEffectRun = useRef(false);
  const [chat_history, set_chat_history] = useState<string[][]>([[]]);
  const [streamData, setStreamData] = useState("");
  const [input_when_streaming, set_input_when_streaming] = useState("");
  const [streaming, setStreaming] = useState(false);

  useEffect(() => {
    if (didEffectRun.current) return;
    didEffectRun.current = true;
    const checkAccess = async () => {
      const response = await fetch(
        "http://127.0.0.1:8787/backend/chat-access",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chatID,
            userID: userId,
          }),
        }
      );

      const data: any = await response.json();
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
    };
    console.log(prompt);
    const first_chat_conversation: string[][] = [];
    const first_chat_conversation_element: string[] = [];
    first_chat_conversation_element.push(prompt);

    if (prompt) {
      // new chat begins
      const first_chat = fetch("http://127.0.0.1:8787/backend/chat", {
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
        .then((response) => {
          if (!response.body) {
            throw new Error("Error while generating response");
          }
          const reader = response.body.getReader();
          let chunks = "";
          return new ReadableStream({
            start(controller) {
              function push() {
                reader.read().then(({ done, value }) => {
                  if (done) {
                    controller.close();
                    return;
                  }
                  chunks += new TextDecoder("utf-8").decode(value);
                  first_chat_conversation_element.push(chunks);
                  first_chat_conversation.push(first_chat_conversation_element);
                  console.log(first_chat_conversation);
                  set_chat_history(first_chat_conversation);
                  chunks = "";
                  controller.enqueue(value);
                  push();
                });
              }
              push();
            },
          });
        })
        .catch((error) => console.error(error));
    } else if (prompt === "") {
      checkAccess();
    }
  }, [user, prompt, chatID, userId]);

  const handleSubmit = async (text: string) => {
    let temp_chat_conversation = [];
    temp_chat_conversation.push(text);
    set_input_when_streaming(text);
    setStreaming(true);
    //console.log(chat_history);
    const response = await fetch("http://127.0.0.1:8787/backend/chat", {
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
      setStreamData(decoded_value);
    }

    temp_chat_conversation.push(chunks);
    setStreaming(false);
    set_chat_history((prevChatHistory) => [
      ...prevChatHistory,
      temp_chat_conversation,
    ]);
  };

  return (
    <div className="flex flex-col justify-between h-[90vh]">
      <div className="overflow-x-auto">
        <div className="flex flex-col md:ml-8 md:mr-8 md:mb-16 ml-4 mr-4 mb-8">
          <div>
            {chat_history.map((element, index) => (
              <div key={index}>
                <div className="flex justify-end">
                  <div className="rounded-md bg-slate-800 p-4 mt-2 mb-2">
                    {element[0]}
                  </div>
                </div>
                <div>{element[1]}</div>
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            {streaming ? (
              <div className="rounded-md bg-slate-800 p-4 mt-2 mb-2">
                {input_when_streaming}
              </div>
            ) : (
              ""
            )}
          </div>
          <div>{streaming ? streamData : ""}</div>
        </div>
      </div>
      <div className="ml-4 mr-4">
        <Searchbar onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
