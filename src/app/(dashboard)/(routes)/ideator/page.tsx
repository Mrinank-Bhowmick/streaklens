"use client";
import Image from "next/image";
import React, { useEffect, useState, FormEvent, useRef } from "react";
import {
  ArrowUpRightFromSquare,
  Search,
  ChartLineUp,
  BookOpen,
  UserCircle,
  Pen,
} from "flowbite-react-icons/outline";
import Modal from "@/components/Modal";

export const runtime = "edge";

const Page = () => {
  const examples = [
    {
      icon: <Pen />,
      description: "Create a Instagram planner",
      prompt:
        "Create a content calendar for a Instagram account on reviewing real estate listings.",
    },
    {
      icon: <ChartLineUp />,
      description: "Give me SEO tips",
      prompt:
        "Provide a comprehensive list of SEO tips to improve the search engine ranking of a blog focused on technology reviews.",
    },
    {
      icon: <BookOpen />,
      description: "How to write blog",
      prompt:
        "Give detailed steps and best practices for writing a successful blog post on sustainable living, including structure, content, and promotion strategies.",
    },
    {
      icon: <UserCircle />,
      description: "Write a Linkedin Bio",
      prompt:
        "Craft a professional LinkedIn bio for a software engineer with 10 years of experience in full-stack development, highlighting key skills, achievements, and career goals.",
    },
  ];

  const [topArticles, setTopArticles] = useState<topArticle[] | null>(null);
  const [dropDownArticles, setDropDownArticles] = useState<NewsData | null>(
    null
  );
  const [selectArticle, setSelectArticle] = useState("Select Article");

  useEffect(() => {
    fetch("/api/news/top")
      .then((response) => response.json())
      .then((data) => {
        //console.log(data);
        setDropDownArticles(data as NewsData);
        //console.log(dropDownArticles);

        const article_list: topArticle[] = [];

        Object.keys(data as NewsData).forEach((category) => {
          (data as any)[category].slice(0, 2).forEach((items: Article) => {
            const item: topArticle = {
              title: items.title,
              image_url: items.image_url,
            };
            article_list.push(item);
          });
        });

        setTopArticles(article_list);
      });
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
      <div className="h-[70vh] md:h-[75vh] flex flex-col items-start justify-start">
        <div className="w-[90vw] md:w-[78vw] mt-4 ml-4">
          <div className="text-xl flex justify-between items-end">
            Latest News<div className="text-xs"> &lt;-Scroll-&gt;</div>
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide flex-nowrap mt-1">
            {topArticles ? (
              topArticles.map((article, index) => (
                <button
                  key={index}
                  className="box h-[25vh] w-[20vh] rounded-lg bg-slate-800 flex-col justify-between flex-shrink-0 flex items-end p-2 text-sm"
                  style={{
                    backgroundImage: `url(${article.image_url})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                  onClick={() => (window.location.href = article.image_url)} // Example click handler
                >
                  <ArrowUpRightFromSquare />
                  <span className="text-white bg-black bg-opacity-60 p-1 text-left rounded-lg">
                    {article.title.substring(0, 50)}...
                  </span>
                </button>
              ))
            ) : (
              <p>Loading</p>
            )}
          </div>
        </div>
        <div className="w-full mt-4 flex flex-col md:items-center md:ml-0 ml-4">
          <div className="text-xl">What Can I do for you?</div>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide flex-nowrap mt-1">
            {examples.map((example, index) => (
              <div
                key={index}
                className="box h-[15vh] w-[20vh] rounded-lg border-slate-800 hover:bg-slate-800 border flex flex-col  flex-shrink-0 text-sm p-2 gap-2 cursor-pointer"
                onClick={() => {
                  console.log("clicked");
                }}
              >
                {example.icon}
                {example.description}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="h-[20vh] md:h-[10vh] flex flex-col items-start justify-center">
        <form
          onSubmit={(e) => handlePromptSubmit(e, inputRef)}
          className="w-full px-4 flex flex-col md:gap-2 gap-1"
        >
          {dropDownArticles ? (
            <Modal
              article={dropDownArticles}
              selectArticle={selectArticle}
              setSelectArticle={setSelectArticle}
            />
          ) : (
            "Loading"
          )}
          <div className="flex items-center gap-2 w-full justify-between rounded-lg bg-slate-900 border border-slate-600 p-2">
            <div className="flex gap-2 items-center w-full">
              <input
                type="text"
                name="prompt"
                ref={inputRef}
                className="flex-grow bg-transparent border-transparent outline-none placeholder-white placeholder-opacity-50 "
                placeholder="Ask anything..."
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
