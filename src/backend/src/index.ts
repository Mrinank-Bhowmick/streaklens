import { Hono } from "hono";
import { cors } from "hono/cors";
import { BufferMemory } from "langchain/memory";
import { CloudflareD1MessageHistory } from "@langchain/cloudflare";
import { KVNamespace, D1Database, Fetcher } from "@cloudflare/workers-types";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ConversationChain } from "langchain/chains";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { streamText } from "hono/streaming";
import { UpstashVectorStore } from "@langchain/community/vectorstores/upstash";
import { Index } from "@upstash/vector";
import { CloudflareWorkersAIEmbeddings } from "@langchain/cloudflare";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";

type Bindings = {
  KV: KVNamespace;
  AI: any;
  DB: D1Database;
  UPSTASH_INDEX_URL: string;
  UPSTASH_API_TOKEN: string;
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
    try {
      const result = (
        await ctx.env.DB.prepare(
          "INSERT INTO users (userid,sessionid,free_tier_count,username) VALUES (?1,?2,?3,?4)"
        )
          .bind(userID, chatID, 100, username)
          .run()
      ).success;
      if (result === true) {
        return ctx.json({ hasAccess: true, messageHistory: "" });
      }
    } catch {
      // handle the error here
      console.error("Error occurred while inserting into the database.");
      return ctx.json({ hasAccess, messageHistory: "" });
    }
  }
});
app.post("/chat", (ctx) => {
  return streamText(ctx, async (stream) => {
    const body = await ctx.req.json();
    const prompt = body.prompt;
    const chatHistory = body?.chat_history;
    const chatID = body.chatID;
    const userID = body.userID;
    const username = body.username;
    const pageURL: string = body?.pageURL;

    const memory = new BufferMemory({
      memoryKey: "history",
      chatHistory: new CloudflareD1MessageHistory({
        tableName: "stored_message",
        sessionId: chatID,
        database: ctx.env.DB,
      }),
    });

    let fullchunk = "";
    const model = new ChatGoogleGenerativeAI({
      model: "gemini-1.5-flash-latest",
      apiKey: ctx.env.GEMINI_API_KEY,
      streaming: true,
      callbacks: [
        {
          async handleLLMNewToken(token) {
            const chunk = token;
            fullchunk += chunk;
            console.log(JSON.stringify(chunk));
            await stream.write(chunk);
          },
          async handleLLMEnd() {
            if (pageURL) {
              await memory.saveContext(
                { input: prompt },
                { output: fullchunk }
              );
            }
          },
        },
      ],
    });

    if (pageURL) {
      console.log(pageURL);
      const embeddings = new CloudflareWorkersAIEmbeddings({
        binding: ctx.env.AI,
        model: "@cf/baai/bge-base-en-v1.5",
      });

      const index = new Index({
        url: ctx.env.UPSTASH_INDEX_URL,
        token: ctx.env.UPSTASH_API_TOKEN,
        cache: false,
      });

      const vectorStore = await UpstashVectorStore.fromExistingIndex(
        embeddings,
        { index }
      );

      const retriever = vectorStore.asRetriever({
        k: 6,
        filter: `pageURL='${pageURL}'`,
      });

      const retrieverPrompt = ChatPromptTemplate.fromMessages([
        new MessagesPlaceholder("chat_history"),
        ["user", `{input}`],
        [
          "user",
          `Given the above conversation, generate a search query to look up in order to get information relevant to the conversation`,
        ],
      ]);

      const retrieverChain = await createHistoryAwareRetriever({
        llm: model,
        retriever,
        rephrasePrompt: retrieverPrompt,
      });

      const chat_history = await memory.chatHistory.getMessages();

      const prompt_template = ChatPromptTemplate.fromMessages([
        [
          "system",
          `You are Streaklens AI Ideator a helpful news journalist assistant.Answer user's question based on following context : {context}, 
				in a simple way. Don't try to give imaginary answers, 
				if you don't know something just say, sorry I don't know.`,
        ],
        new MessagesPlaceholder("chat_history"),
        ["user", `{input}`],
      ]);

      const chain = await createStuffDocumentsChain({
        llm: model,
        prompt: prompt_template,
      });

      const conversationChain = await createRetrievalChain({
        combineDocsChain: chain,
        retriever: retrieverChain,
      });

      await conversationChain.invoke({
        chat_history: chat_history,
        input: prompt,
        memory: memory,
      });
    } else {
      const chain = new ConversationChain({ llm: model, memory });
      await chain.invoke({ input: prompt });
    }
  });
});

export default app;
