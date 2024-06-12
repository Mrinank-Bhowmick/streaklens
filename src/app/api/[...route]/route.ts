import { Hono } from "hono";
import { cors } from "hono/cors";
import { env } from "hono/adapter";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { handle } from "hono/vercel";
//import { getAuth } from "@hono/clerk-auth";
import { BufferMemory } from "langchain/memory";
import { CloudflareD1MessageHistory } from "@langchain/cloudflare";
import { KVNamespace, D1Database, Fetcher } from "@cloudflare/workers-types";
export const runtime = "edge";
type Bindings = {
  KV: KVNamespace;
  AI: unknown; //use as fetcher when calling in binding
  DB: D1Database;
};

type EnvConfig = {
  CF_ACCOUNT_ID: string;
  KV_API_TOKEN: string;
  KV_NAMESPACE_ID: string;
};

const app = new Hono<{ Bindings: Bindings }>().basePath("/api");

app.use("/*", cors());

app.get("/news/top", async (ctx) => {
  const { CF_ACCOUNT_ID, KV_API_TOKEN, KV_NAMESPACE_ID } = env(ctx);

  try {
    const keys = ["business", "politics", "sports", "tech", "top"];
    const promises = keys.map((key) =>
      fetch(
        `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/storage/kv/namespaces/${KV_NAMESPACE_ID}/values/${key}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${KV_API_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      ).then((res) => res.json())
    );
    const [business_news, politics_news, sports_news, tech_news, top_news] =
      await Promise.all(promises);
    const news = {
      business: business_news,
      politics: politics_news,
      sports: sports_news,
      tech: tech_news,
      top: top_news,
    };
    //console.log(news); // Print the news object to the console
    return ctx.json(news);
  } catch (error) {
    //console.error("error: ", error);
    return ctx.json({ message: error });
  }
});
app.post("/chat-access", async (ctx) => {
  //const auth = getAuth(ctx);
  const body = await ctx.req.json();
  const chatID = body.chatID;
  const userID = body.userId;
  console.log(userID);
  const memory = new BufferMemory({
    memoryKey: "history",
    chatHistory: new CloudflareD1MessageHistory({
      tableName: "stored_message",
      sessionId: chatID,
      database: getRequestContext().env.DB,
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

export default app as never; // for deploying it to cf
export const GET = handle(app); // for deploying it to vercel
export const POST = handle(app);
