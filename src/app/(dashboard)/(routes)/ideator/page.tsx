"use client";
import Image from "next/image";
import React, { useEffect, useState, FormEvent, useRef } from "react";
import {
  ArrowUpRightFromSquare,
  Search,
  ChartLineUp,
  BookOpen,
  UserCircle,
} from "flowbite-react-icons/outline";
export const runtime = "edge";
const Page = () => {
  const examples = [
    { icon: <ChartLineUp />, description: "Give me SEO tips" },
    { icon: <BookOpen />, description: "How to write blog" },
    { icon: <UserCircle />, description: "Write a Linkedin Bio" },
  ];
  const articles = [
    {
      img: "https://i.cdn.newsbytesapp.com/images/l47620240529113808.jpeg",
      title: "Blending age-old traditions with modern accessories",
    },
    {
      img: "https://www.goodreturns.in/img/2024/05/gold-rates-1716967382.jpg",
      title:
        "Gold Rates Bangalore: 24K/100 Grams Gold Jumps By Rs 2,700, Silver Up By Rs 6,200 In 3-Days https://www.goodreturns.in/img/2024/05/gold-rates-1716967382.jpg",
    },
    {
      img: "https://i.cdn.newsbytesapp.com/images/l47620240529113808.jpeg",
      title: "Blending age-old traditions with modern accessories",
    },
    {
      img: "https://www.goodreturns.in/img/2024/05/gold-rates-1716967382.jpg",
      title:
        "Gold Rates Bangalore: 24K/100 Grams Gold Jumps By Rs 2,700, Silver Up By Rs 6,200 In 3-Days https://www.goodreturns.in/img/2024/05/gold-rates-1716967382.jpg",
    },
    {
      img: "https://i.cdn.newsbytesapp.com/images/l47620240529113808.jpeg",
      title: "Blending age-old traditions with modern accessories",
    },
    {
      img: "https://www.goodreturns.in/img/2024/05/gold-rates-1716967382.jpg",
      title:
        "Gold Rates Bangalore: 24K/100 Grams Gold Jumps By Rs 2,700, Silver Up By Rs 6,200 In 3-Days https://www.goodreturns.in/img/2024/05/gold-rates-1716967382.jpg",
    },
    {
      img: "https://i.cdn.newsbytesapp.com/images/l47620240529113808.jpeg",
      title: "Blending age-old traditions with modern accessories",
    },
    {
      img: "https://www.goodreturns.in/img/2024/05/gold-rates-1716967382.jpg",
      title:
        "Gold Rates Bangalore: 24K/100 Grams Gold Jumps By Rs 2,700, Silver Up By Rs 6,200 In 3-Days https://www.goodreturns.in/img/2024/05/gold-rates-1716967382.jpg",
    },
    {
      img: "https://i.cdn.newsbytesapp.com/images/l47620240529113808.jpeg",
      title: "Blending age-old traditions with modern accessories",
    },
    {
      img: "https://www.goodreturns.in/img/2024/05/gold-rates-1716967382.jpg",
      title:
        "Gold Rates Bangalore: 24K/100 Grams Gold Jumps By Rs 2,700, Silver Up By Rs 6,200 In 3-Days https://www.goodreturns.in/img/2024/05/gold-rates-1716967382.jpg",
    },
    {
      img: "https://i.cdn.newsbytesapp.com/images/l47620240529113808.jpeg",
      title: "Blending age-old traditions with modern accessories",
    },
    {
      img: "https://www.goodreturns.in/img/2024/05/gold-rates-1716967382.jpg",
      title:
        "Gold Rates Bangalore: 24K/100 Grams Gold Jumps By Rs 2,700, Silver Up By Rs 6,200 In 3-Days https://www.goodreturns.in/img/2024/05/gold-rates-1716967382.jpg",
    },
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
      <div className="h-[70vh] md:h-[75vh] flex flex-col items-start justify-start">
        <div className="w-[78vw] mt-4 ml-4">
          <div className="text-xl flex justify-between items-end">
            Latest News<div className="text-xs"> &lt;-Scroll-&gt;</div>
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide flex-nowrap mt-1">
            {articles.map((article, index) => (
              <button
                key={index}
                className="box h-[25vh] w-[20vh] rounded-lg bg-slate-800 flex-shrink-0 flex items-end p-2 text-sm"
                style={{
                  backgroundImage: `url(${article.img})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                onClick={() => (window.location.href = article.img)} // Example click handler
              >
                <span className="text-white bg-black bg-opacity-50 p-1 text-left rounded-lg">
                  {article.title.substring(0, 50)}...
                </span>
              </button>
            ))}
          </div>
        </div>
        <div className="w-full mt-4 flex flex-col md:items-center">
          <div className="text-xl">What Can I do for you?</div>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide flex-nowrap mt-1">
            {examples.map((example, index) => (
              <div
                key={index}
                className="box h-[15vh] w-[20vh] rounded-xl border-slate-800 hover:bg-slate-800 border flex flex-col  flex-shrink-0 text-sm p-2 gap-2"
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
          className="w-full px-4"
        >
          <div className="flex items-center gap-2 w-full justify-between rounded-3xl bg-slate-900 border border-slate-600 p-2">
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
