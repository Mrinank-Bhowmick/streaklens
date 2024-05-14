"use client";

import { FormEvent, useState } from "react";

export default function Home() {
  const [streamedData, setStreamedData] = useState("");

  const handleChatSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStreamedData("Running...");

    const formData = new FormData(e.currentTarget);

    const response = await fetch("https://dv", {
      method: "POST",
      body: JSON.stringify({
        userPrompt: formData.get("prompt"),
      }),
    });
    const ans = response.body;
    console.log(ans);
    const reader = ans.getReader();

    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }
      setStreamedData(
        (prevData) => prevData + decoder.decode(value, { stream: true })
      );
    }
  };

  const handleClearChat = () => {
    setStreamedData("");
  };

  return (
    <main className="flex max-w-6xl mx-auto items-center justify-center p-24">
      <div className="flex flex-col gap-12">
        <h1 className="text-gray-200 font-extrabold text-6xl text-center">
          LangChain JS Demo 🦜🔗
        </h1>

        <form onSubmit={handleChatSubmit}>
          <div className="flex flex-col gap-2">
            <input
              className="py-2 px-4 rounded-md bg-gray-600 text-white w-full"
              placeholder="Enter prompt"
              name="prompt"
              required
            ></input>
          </div>

          <div className="flex justify-center gap-4 py-4">
            <button
              type="submit"
              className="py-2 px-4 rounded-md text-sm bg-lime-700 text-white hover:opacity-80 transition-opacity"
            >
              Send Chat
            </button>

            <button
              type="button"
              onClick={handleClearChat}
              className="py-2 px-4 rounded-md text-sm bg-red-700 text-white hover:opacity-80 transition-opacity"
            >
              Clear Chat
            </button>
          </div>
        </form>

        <div>
          <h3 className="text-2xl text-gray-400">AI Assistant</h3>
          <p className="text-gray-200 rounded-md bg-gray-700 p-4">
            {streamedData}
          </p>
        </div>
      </div>
    </main>
  );
}
