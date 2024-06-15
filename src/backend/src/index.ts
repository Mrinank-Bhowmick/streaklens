import { Hono } from "hono";
import { cors } from "hono/cors";
import { BufferMemory } from "langchain/memory";
import { CloudflareD1MessageHistory } from "@langchain/cloudflare";
import { KVNamespace, D1Database, Fetcher } from "@cloudflare/workers-types";

type Bindings = {
  KV: KVNamespace;
  AI: unknown; //use as fetcher type when calling in binding in llm
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use("/*", cors());

app.get("/", async (c) => {
  const tables = await c.env.DB.prepare(
    "SELECT name FROM sqlite_master WHERE type='table'"
  ).all();
  return c.json(tables);
});

app.post("/chat-access", async (ctx) => {
  //const auth = getAuth(ctx);
  const body = await ctx.req.json();
  console.log(body);
  const chatID = body.chatID;
  const userID = body.userId;
  console.log(userID);
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
    return ctx.json({ hasAccess, messageHistory: "" });
  }
});
app.post("/chat", async (ctx) => {
  const body = await ctx.req.json();
  const prompt = body.prompt;
  const pageURL = body.pageURL;
  console.log("Came");
  console.log(prompt);
  console.log(pageURL);
  return ctx.json({ message: "" });
});

export default app;
