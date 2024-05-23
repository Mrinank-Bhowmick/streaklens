"use client";
import Image from "next/image";
import React from "react";
import logo from "../../../../../public/logo.svg";
import { ArrowUpRightFromSquare, Search } from "flowbite-react-icons/outline";

const page = () => {
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

  return (
    <div className="text-white">
      <div className="h-[70vh] md:h-[75vh] flex flex-col items-center justify-start">
        <div className="p-4 md:p-8">
          <Image src={logo} alt="StreakLens" width={50} height={50} />
        </div>
        <div className="flex flex-wrap w-full items-start justify-center md:gap-0 gap-2">
          <div className="flex flex-col items-center md:w-1/2">
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
          <div className="md:w-1/2 flex flex-col items-center">
            <div className="text-xl">Latest News</div>
            Get summaries...
            <button className="flex flex-col gap-1 md:h-[250px] md:w-[400px] h-[165px] w-[300px] overflow-y-scroll scrollbar-thin scrollbar-thumb-rose-500 scrollbar-track-transparent">
              {articles.map((article, index) => (
                <div
                  key={index}
                  className="flex bg-slate-900 border border-slate-600 rounded-xl w-[1000px] p-2 gap-2 hover:bg-slate-600"
                  onClick={() => {
                    console.log("clicked");
                  }}
                >
                  <ArrowUpRightFromSquare /> {article}
                </div>
              ))}
            </button>
          </div>
        </div>
      </div>
      <div className="h-[20vh] md:h-[10vh] flex items-start justify-center">
        <form className="w-full ml-8 mr-8 ">
          <div className="flex items-center gap-2 w-full justify-between rounded-3xl bg-slate-900 border border-slate-600 p-2">
            <div className="flex gap-2 items-center w-full">
              <Search className="h-6 w-6" />
              <input
                className="flex-grow bg-transparent outline-none placeholder-white placeholder-opacity-50"
                placeholder="Prompt..."
              />
            </div>
            <button
              onClick={() => {
                console.log("Button clicked");
              }}
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

export default page;
