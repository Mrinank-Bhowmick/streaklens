"use client";
import { Brain } from "flowbite-react-icons/outline";
import Link from "next/link";
import React from "react";

const tools = [
  {
    label: "AI Ideator",
    icon: Brain,
    color: "text-violet-500",
    bgColor: "bg-violet-500",
    href: "/ideator",
    description: "Get innovative ideas for your next move",
  },
  {
    label: "AI Thumbnail maker",
    icon: Brain,
    color: "text-violet-500",
    bgColor: "bg-violet-500",
    href: "/thumbnail",
    description: "Your AI thumbnail maker",
  },
];

const page = () => {
  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h2 className="max-w-lg text-3xl font-semibold leading-normal text-gray-900 dark:text-white">
        StreakLens Creations Studio
      </h2>
      <h4 className="font-playfair text-l italic text-center">
        Welcome to our AI-powered platform for content creators! <br />
        Boost your creativity and efficiency with our suite of tools designed to
        enhance your content creation process.
      </h4>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool, index) => (
          <Link
            key={index}
            href={tool.href}
            className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
          >
            <h5 className="max-w-lg text-2xl font-semibold leading-normal text-gray-900 dark:text-white">
              {tool.label}
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              {tool.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default page;
