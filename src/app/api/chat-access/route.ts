// pages/api/chat-access.js
import { BufferMemory } from "langchain/memory";
import { CloudflareD1MessageHistory } from "@langchain/cloudflare";
import { NextRequest } from "next/server";
import { getRequestContext } from "@cloudflare/next-on-pages";

export const runtime = "edge";
export const POST = async (request: NextRequest) => {
  const body: any = await request.json();
  const chatID = body.chatID;
  const userID = body.userId;

  const memory = new BufferMemory({
    memoryKey: "history",
    chatHistory: new CloudflareD1MessageHistory({
      tableName: "stored_message",
      sessionId: chatID,
      database: getRequestContext().env.DB, // Assuming DB is available in context.env
    }),
  });

  let { results } = await getRequestContext()
    .env.DB.prepare("select sessionid from users where userid = ?")
    .bind(userID)
    .all();

  let hasAccess = false;
  for (const session of results) {
    if (session.sessionid === chatID) {
      hasAccess = true;
      break;
    }
  }

  if (hasAccess) {
    return new Response(
      JSON.stringify({
        hasAccess,
        messageHistory: await memory.chatHistory.getMessages(),
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } else {
    return new Response(JSON.stringify({ hasAccess, messageHistory: "" }), {
      headers: { "Content-Type": "application/json" },
    });
  }
};
