import { Hono } from "hono";
import { KVNamespace } from "@cloudflare/workers-types";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { handle } from "hono/vercel";
export const runtime = "edge";

type Bindings = {
  KV: KVNamespace;
  AI: unknown;
  UPSTASH_TOKEN: string;
  UPSTASH_INDEX_URL: string;
};

const app = new Hono<{ Bindings: Bindings }>().basePath("/api");

app.get("/news/top", async (ctx) => {
  try {
    const business_news: string = (await getRequestContext().env.KV.get(
      "business"
    )) as string;
    const politics_news: string = (await getRequestContext().env.KV.get(
      "politics"
    )) as string;
    const sports_news: string = (await getRequestContext().env.KV.get(
      "sports"
    )) as string;
    const tech_news: string = (await getRequestContext().env.KV.get(
      "tech"
    )) as string;
    const top_news: string = (await getRequestContext().env.KV.get(
      "business"
    )) as string;

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

export const GET = handle(app); // for deploying it to vercel

export default app as never; // for deploying it to cf
