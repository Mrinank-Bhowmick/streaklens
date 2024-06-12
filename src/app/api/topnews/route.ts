import { getRequestContext } from "@cloudflare/next-on-pages";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    console.log("it came here");
    const { KV } = getRequestContext().env;

    const keys = ["business", "politics", "sports", "tech", "top"]; // Changed the last key to "top"
    const promises = keys.map((key) => KV.get(key));

    const [business_news, politics_news, sports_news, tech_news, top_news] =
      await Promise.all(promises);

    const news = {
      business: JSON.parse(business_news || "null"),
      politics: JSON.parse(politics_news || "null"),
      sports: JSON.parse(sports_news || "null"),
      tech: JSON.parse(tech_news || "null"),
      top: JSON.parse(top_news || "null"),
    };

    return new Response(JSON.stringify(news));
  } catch (error) {
    console.error("error: ", error);
    return new Response(JSON.stringify({ message: error }));
  }
}
