import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { HeroScrollDemo } from "@/components/Container";
import { techstacks } from "@/lib/constant";
import { LampDemo } from "@/components/ui/lamp";
import { CanvasRevealEffectDemo } from "@/components/Canvas";

const page = () => {
  return (
    <div className="text-white">
      <div>
        <Navbar />
      </div>
      <section className="bg-neutral-950 rounded-md  !overflow-visible relative flex flex-col items-center  antialiased">
        <div className="absolute inset-0  h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_35%,#223_100%)]"></div>
        <div className="flex flex-col mt-[-100px] md:mt-[-50px]">
          <HeroScrollDemo />
        </div>
      </section>
      <section>
        <LampDemo />
      </section>
      <section>
        <CanvasRevealEffectDemo />
      </section>
    </div>
  );
};

export default page;
