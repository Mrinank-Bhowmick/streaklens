import React from "react";
import Link from "next/link";

const page = () => {
  return (
    <div className="text-white">
      Landing page
      <div>Under Development</div>
      <Link href="/dashboard">
        <button className="rounded-xl p-4 bg-slate-800">Visit Dashboard</button>
      </Link>
      <div></div>
    </div>
  );
};

export default page;
