import { CloudflareWorkersAI } from "@langchain/cloudflare";
import { ChatPromptTemplate } from "langchain/prompts";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { CloudflareWorkersAIEmbeddings } from "@langchain/cloudflare";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Document } from "langchain/document";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { Fetcher } from "@cloudflare/workers-types";

interface userRequest {
  userPrompt: string;
}

const runLLMChain = async (userPrompt: string) => {
  const encoder = new TextEncoder();
  const streamData = new TransformStream();
  const writer = streamData.writable.getWriter();

  const model = new CloudflareWorkersAI({
    model: "@cf/meta/llama-3-8b-instruct",
    cloudflareAccountId: env.ACCOUNT_ID,
    cloudflareApiToken: env.API_TOKEN,
    streaming: true,
    callbacks: [
      {
        async handleLLMNewToken(token) {
          await writer.ready;
          const encoded_text = encoder.encode(`${token}`);
          //console.log(encoded_text);
          await writer.write(encoded_text);
        },
        async handleLLMEnd() {
          await writer.ready;
          await writer.close();
        },
      },
    ],
  });

  const prompt = ChatPromptTemplate.fromTemplate(
    `answer the user's question. Context: {context} Question: {input}`
  );
  const web_data = await fetch(
    "https://r.jina.ai/https://www.apple.com/newsroom/2024/05/apple-introduces-m4-chip/"
  );
  const data = await web_data.text();
  const splitter = new RecursiveCharacterTextSplitter({
    //separators:['\n','\n\n'],
    chunkSize: 300,
    chunkOverlap: 20,
  });

  const splitDocs = await splitter.splitDocuments([
    new Document({ pageContent: data }),
  ]);
  //console.log(splitDocs);
  const embeddings = new CloudflareWorkersAIEmbeddings({
    binding: env.AI as Fetcher,
    model: "@cf/baai/bge-base-en-v1.5",
  });

  const vectorStore = await MemoryVectorStore.fromDocuments(
    splitDocs,
    embeddings
  );

  const retriver = vectorStore.asRetriever({ k: 2 });
  const chain = await createStuffDocumentsChain({
    llm: model,
    prompt: prompt,
  });
  const retrivalChain = await createRetrievalChain({
    combineDocsChain: chain,
    retriever: retriver,
  });

  retrivalChain.invoke({
    input: userPrompt,
  });

  return streamData.readable;
};

export default async function fetchy(
  request: Request,
  res: Response
): Promise<Response> {
  // This is for browser requests to avoid double calls
  if (request.url.endsWith("favicon.ico")) {
    return new Response(null, { status: 204 });
  }

  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let userPrompt = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    userPrompt += decoder.decode(value, { stream: true });
  }

  console.log("User Prompt:", userPrompt);
  const stream = runLLMChain(userPrompt);
  return new Response(await stream, {
    headers: {
      //'Content-Type': 'text/event-stream',
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
