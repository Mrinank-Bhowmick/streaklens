import { Hono } from "hono";
//import { getRequestContext } from "@cloudflare/next-on-pages";
//import { handle } from "hono/vercel";
import { getAuth } from "@hono/clerk-auth";
import { BufferMemory } from "langchain/memory";
import { CloudflareD1MessageHistory } from "@langchain/cloudflare";
import { KVNamespace, D1Database, Fetcher } from "@cloudflare/workers-types";

export const runtime = "edge";

type Bindings = {
  KV: KVNamespace;
  AI: unknown; //use as fetcher when calling in binding
  DB: D1Database;
  UPSTASH_TOKEN: string;
  UPSTASH_INDEX_URL: string;
};

const app = new Hono<{ Bindings: Bindings }>().basePath("/api");

app.get("/news/top", async (ctx) => {
  try {
    const business_news: string = (await ctx.env.KV.get("business")) as string;
    const politics_news: string = (await ctx.env.KV.get("politics")) as string;
    const sports_news: string = (await ctx.env.KV.get("sports")) as string;
    const tech_news: string = (await ctx.env.KV.get("tech")) as string;
    const top_news: string = (await ctx.env.KV.get("business")) as string;

    const news = {
      business: JSON.parse(business_news),
      politics: JSON.parse(politics_news),
      sports: JSON.parse(sports_news),
      tech: JSON.parse(tech_news),
      top: JSON.parse(top_news),
    };
    //console.log(news);
    return ctx.json(news);
  } catch (error) {
    console.error("error: ", error);
    return ctx.json({ message: "Internal server error" });
  }
});

app.post("/chat-access", async (ctx) => {
  const auth = getAuth(ctx);
  const body = await ctx.req.json();
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
  // await memory.saveContext(
  //   { input: "My name is Tom" },
  //   { output: "Ok got it" }
  // );
  //console.log(await memory.loadMemoryVariables({}));
  // await ctx.env.DB.exec(
  //   "create table users(userid text,sessionid text)"
  // );

  // const stmt = ctx.env.DB.prepare(
  //   "INSERT INTO users (userid, sessionid) VALUES (?, ?)"
  // );
  // await stmt.bind("user_2fjb9p4oIu4bB9iQlAbPZqUB5Jj", "example4").run();

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

app.get("/page", async (ctx) => {});

// export const GET = handle(app); // for deploying it to vercel
// export const POST = handle(app);

export default app as never; // for deploying it to cf
