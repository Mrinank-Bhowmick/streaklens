import { Hono } from "hono";
import { cors } from "hono/cors";
import { BufferMemory } from "langchain/memory";
import { CloudflareD1MessageHistory } from "@langchain/cloudflare";
import { KVNamespace, D1Database, Fetcher } from "@cloudflare/workers-types";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ConversationChain } from "langchain/chains";
import { streamText } from "hono/streaming";

type Bindings = {
  KV: KVNamespace;
  AI: unknown; //use as fetcher type when calling in binding in llm
  DB: D1Database;
  GEMINI_API_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>().basePath("/backend/");

app.use("/*", cors());

app.get("/", async (c) => {
  return c.json({ message: "Hello world" });
});

app.get("/hello", async (c) => {
  return c.json({ message: "Hello" });
});

app.post("/chat-access", async (ctx) => {
  //const auth = getAuth(ctx);
  const body = await ctx.req.json();
  //console.log(body);
  const chatID = body.chatID;
  const userID = body.userID;
  const username = body.username;
  //console.log(userID);
  const memory = new BufferMemory({
    memoryKey: "history",
    chatHistory: new CloudflareD1MessageHistory({
      tableName: "stored_message",
      sessionId: chatID,
      database: ctx.env.DB,
    }),
  });
  let { results } = await ctx.env.DB.prepare(
    "select sessionid from users where userid = ?"
  )
    .bind(userID)
    .all();
  let hasAccess = false;
  for (const session of results) {
    if (session.sessionid === chatID) {
      hasAccess = true;
      break;
    }
  }
  // console.log(JSON.stringify(await memory.chatHistory.getMessages()));
  if (hasAccess) {
    return ctx.json({
      hasAccess,
      messageHistory: await memory.chatHistory.getMessages(),
    });
  } else {
    const result = (
      await ctx.env.DB.prepare(
        "INSERT INTO users (userid,sessionid,free_tier_count,username) VALUES (?1,?2,?3,?4)"
      )
        .bind(userID, chatID, 100, username)
        .run()
    ).success;
    console.log("Insert result:", result);
    return ctx.json({ hasAccess, messageHistory: "" });
  }
});
app.post("/chat", (ctx) => {
  return streamText(ctx, async (stream) => {
    console.log("Request received");
    const body = await ctx.req.json();
    const prompt = body.prompt;
    const chatHistory = body?.chat_history;
    const chatID = body.chatID;
    const userID = body.userID;
    const username = body.username;
    const pageURL = body?.pageURL;

    const memory = new BufferMemory({
      memoryKey: "history",
      chatHistory: new CloudflareD1MessageHistory({
        tableName: "stored_message",
        sessionId: chatID,
        database: ctx.env.DB,
      }),
    });

    if (pageURL) {
      console.log("Handling article response...");
    } else {
      const model = new ChatGoogleGenerativeAI({
        model: "gemini-1.5-flash-latest",
        apiKey: ctx.env.GEMINI_API_KEY,
        streaming: true,
        callbacks: [
          {
            async handleLLMNewToken(token) {
              const chunk = token;
              console.log(JSON.stringify(chunk));
              await stream.write(chunk);
            },
          },
        ],
      });

      const chain = new ConversationChain({ llm: model, memory });
      await chain.invoke({ input: prompt });
    }
  });
});

export default app;
