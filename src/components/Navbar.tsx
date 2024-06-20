"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();

  return (
    <div className="flex w-full p-4 justify-between fixed top-0 z-50">
      <div className="flex">
        <img src="/logo.svg" width={45} height={25} alt="Company Logo" />{" "}
        <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white ml-3">
          StreakLens
        </span>
      </div>
      <button
        onClick={() => router.push("/dashboard")}
        className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
      >
        <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
        <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
          Get Started
        </span>
      </button>
    </div>
  );
};

export default Navbar;
