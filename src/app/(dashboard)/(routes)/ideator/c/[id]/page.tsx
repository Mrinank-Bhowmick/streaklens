"use client";
import Searchbar from "@/components/searchbar";
import { useParams, useSearchParams } from "next/navigation";

export default function Chat() {
  const params = useParams();
  const searchParams = useSearchParams();

  const id = params.id;
  const message = searchParams.get("prompt");
  const pageURL = searchParams.get("pageURL");

  const handleSubmit = (text: string) => {
    console.log("Submitted text:", text);
    // Implement your submit logic here
  };

  return (
    <div className="flex flex-col justify-between h-[90vh]">
      <div>
        <h1>Chat Session: {id}</h1>
        <p>Message: {message}</p>
        <p>Article: {pageURL}</p>
      </div>
      <div className="ml-4 mr-4">
        <Searchbar onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
