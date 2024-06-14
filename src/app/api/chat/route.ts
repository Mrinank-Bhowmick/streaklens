import { NextRequest } from "next/server";

// pages/api/chat.js
export const runtime = "edge";
export const POST = async (request: NextRequest) => {
  const body: any = await request.json();
  const prompt = body.prompt;
  const pageURL = body.pageURL;

  // Your logic for handling /chat endpoint
  console.log("Came");
  console.log(prompt);
  console.log(pageURL);

  return new Response(JSON.stringify({ message: "" }), {
    headers: { "Content-Type": "application/json" },
  });
};
