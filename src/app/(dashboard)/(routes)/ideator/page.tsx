"use client";
import Image from "next/image";
import React, {
  useEffect,
  useState,
  FormEvent,
  useRef,
  useContext,
} from "react";
import { uuid } from "@cfworker/uuid";
import { ChatContext } from "@/context/ChatContex";
import {
  ArrowUpRightFromSquare,
  Search,
  ChartLineUp,
  BookOpen,
  UserCircle,
  Pen,
} from "flowbite-react-icons/outline";
import Modal from "@/components/Modal";
import { useRouter } from "next/navigation";
import Searchbar from "@/components/searchbar";

export const runtime = "edge";

const Page = () => {
  const router = useRouter();
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
  const chatContext = useContext(ChatContext);
  if (!chatContext) {
    throw new Error("Chat Context Error");
  }
  const { setPageURL, setPrompt } = chatContext;

  const getnews = async () => {
    console.log("clicked");
    try {
      const response = await fetch("/api/topnews");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const { data, Worker_KV }: any = await response.json();
      console.log(data);
      console.log(Worker_KV);
      setDropDownArticles(data as NewsData);
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
    } catch (error) {
      console.error("Error fetching news: ", error);
      setTopArticles([{ title: "Error Fetching from server", image_url: "" }]);
    }
  };

  const handleSubmit = (text: string) => {
    const chatID = uuid();
    setPrompt(text);
    router.push(`/ideator/c/${chatID}`);
  };
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="text-white">
      <div className="h-[70vh] md:h-[75vh] flex flex-col items-start justify-start">
        <div className="w-[95vw] md:w-[78vw] mt-4 ml-4">
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
              <button
                onClick={getnews}
                className="p-4 hover:bg-slate-500 bg-slate-600 active:bg-slate-800 rounded-lg transition duration-150"
              >
                Get here
              </button>
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

      <div className="h-[20vh] md:h-[10vh] flex flex-col items-start justify-center w-full">
        {dropDownArticles ? (
          <Modal
            article={dropDownArticles}
            selectArticle={selectArticle}
            setSelectArticle={setSelectArticle}
            setPageURL={setPageURL}
          />
        ) : (
          "Loading"
        )}
        <div className="mr-4 ml-4 md:w-[75vw] w-[95vw]">
          <Searchbar onSubmit={(text) => handleSubmit(text)} />
        </div>
      </div>
    </div>
  );
};

export default Page;
