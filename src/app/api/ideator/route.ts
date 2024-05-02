import { auth } from "@clerk/nextjs/server";
import axios from "axios";
import { NextResponse } from "next/server";

const cloudflare_acc_id = process.env.CLOUDFLARE_ACCOUNT_ID; // You will find in worker's page at right side
const cloudflare_ai_token = process.env.CLOUDFLARE_AUTH_TOKEN;

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    console.log(body);
    const { messages } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!cloudflare_ai_token || !cloudflare_acc_id) {
      return new NextResponse("CF not configured", { status: 500 });
    }
    if (!messages) {
      return new NextResponse("Messages are required", { status: 400 });
    }

    const response = await axios.post(
      `https://api.cloudflare.com/client/v4/accounts/${cloudflare_acc_id}/ai/run/@cf/meta/llama-3-8b-instruct`,
      {
        messages: [
          { role: "system", content: "You are a friendly assistant" },
          { role: "user", content: messages },
        ],
      },
      {
        headers: { Authorization: `Bearer ${cloudflare_ai_token}` },
      }
    );
    const { result } = response.data;
    const { response: message } = result;
    return NextResponse.json(message);
  } catch (error) {
    console.log("Ideator Error", error);
    return new NextResponse("Internal Erorr", { status: 500 });
  }
}
