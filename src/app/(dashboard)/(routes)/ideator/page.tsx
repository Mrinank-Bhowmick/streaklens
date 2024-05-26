"use client";
import Image from "next/image";
import React, { useEffect, useState, FormEvent, useRef } from "react";
import logo from "../../../../../public/logo.svg";
import { ArrowUpRightFromSquare, Search } from "flowbite-react-icons/outline";

const Page = () => {
  const examples = [
    "Give me SEO tips",
    "How to make blog",
    "Write a short story",
  ];
  const articles = [
    "RCB fever grips IPL playoffs as fans chant team's name during KKR vs SRH",
    "Article 2",
    "Article 3",
    "Article 4",
    "Article 5",
    "Article 6",
    "Article 7",
    "Article 8",
  ];
  const [showArticles, setArticles] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setArticles(true);
    }, 3000);

    // Cleanup function to clear the timeout if the component unmounts before the timeout finishes
    return () => clearTimeout(timer);
  }, []);

  const handlePromptSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    inputRef: React.RefObject<HTMLInputElement>
  ) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    console.log(formData.get("prompt"));

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="text-white">
      <div className="h-[70vh] md:h-[75vh] flex flex-col items-center justify-start">
        <div className="p-4 md:p-8">
          <Image src={logo} alt="StreakLens" width={50} height={50} />
        </div>
        <div className="flex flex-wrap w-full items-start justify-center md:gap-0 gap-2">
          <div className="flex flex-col items-center md:w-1/2 md:gap-2">
            <div className="text-xl">What can I do?</div>
            <button className="flex flex-col gap-1">
              {examples.map((example, index) => (
                <div
                  key={index}
                  className="flex bg-slate-900 border border-slate-600 rounded-xl gap-2 md:p-2 p-1 hover:bg-slate-600"
                  onClick={() => {
                    console.log("clicked");
                  }}
                >
                  <ArrowUpRightFromSquare />
                  {example}
                </div>
              ))}
            </button>
          </div>
          <div className="md:w-1/2 flex flex-col items-center md:gap-2">
            <div className="text-xl">Latest News</div>
            <div>Get summaries...</div>
            <button className="flex flex-col gap-1 md:h-[250px] md:w-[400px] h-[165px] w-[300px] overflow-y-scroll scrollbar-thin scrollbar-thumb-rose-500 scrollbar-track-transparent">
              {showArticles ? (
                articles.map((article, index) => (
                  <div
                    key={index}
                    className="flex bg-slate-900 border border-slate-600 rounded-xl w-[1000px] p-2 gap-2 hover:bg-slate-600"
                    onClick={() => {
                      console.log("clicked");
                    }}
                  >
                    <ArrowUpRightFromSquare /> {article}
                  </div>
                ))
              ) : (
                <div>
                  <div className="flex flex-col md:w-[380px] w-[280px] animate-pulse gap-2">
                    <div className="flex justify-start bg-slate-900 border border-slate-600 rounded-xl p-2 gap-2 ">
                      <ArrowUpRightFromSquare /> Loading...
                    </div>
                    <div className="flex justify-start bg-slate-900 border border-slate-600 rounded-xl p-2 gap-2 ">
                      <ArrowUpRightFromSquare /> Loading...
                    </div>
                    <div className="flex justify-start bg-slate-900 border border-slate-600 rounded-xl p-2 gap-2 ">
                      <ArrowUpRightFromSquare /> Loading...
                    </div>
                    <div className="flex justify-start bg-slate-900 border border-slate-600 rounded-xl p-2 gap-2 ">
                      <ArrowUpRightFromSquare /> Loading...
                    </div>
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
      <div className="h-[20vh] md:h-[10vh] flex items-start justify-center">
        <form
          onSubmit={(e) => handlePromptSubmit(e, inputRef)}
          className="w-full ml-8 mr-8"
        >
          <div className="flex items-center gap-2 w-full justify-between rounded-3xl bg-slate-900 border border-slate-600 p-2">
            <div className="flex gap-2 items-center w-full">
              <input
                type="text"
                name="prompt"
                ref={inputRef}
                className="flex-grow bg-transparent border-transparent outline-none placeholder-white placeholder-opacity-50 "
                placeholder="Prompt..."
              />
            </div>
            <button
              type="submit"
              className="bg-slate-700 rounded-lg px-3 py-1 hover:bg-slate-600"
            >
              Search
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;
