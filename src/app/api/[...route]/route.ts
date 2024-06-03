import { Hono } from "hono";

export const runtime = "edge";

const app = new Hono().basePath("/api");

app.get("/news/top", (c) => {
  return c.json({});
});

// export const GET = handle(app) // for deploying it to vercel

export default app as never; // for deploying it to cf
