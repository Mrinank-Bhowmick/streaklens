import { NextApiRequest, NextApiResponse } from "next";

const account = "bhowmickmrinank@gmail.com";
const token = process.env.cloudflare_ai_token;

const llamaApi = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const prompt = req.body.prompt;
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${account}/ai/run/@cf/meta-llama/llama-2-7b-chat-hf-lora`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        raw: true,
        lora: "00000000-0000-0000-0000-000000000",
        stream: true,
      }),
    }
  );

  const result = await response.json();

  return res.json(result);
};

export default llamaApi;
