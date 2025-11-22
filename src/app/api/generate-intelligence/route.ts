import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_api_key,
});

export async function POST(req: NextRequest) {
  if (!process.env.OPENAI_api_key) {
    return NextResponse.json(
      { error: "Missing OPENAI_api_key in .env.local" },
      { status: 500 }
    );
  }

  const body = await req.json().catch(() => ({}));

  const {
    mode = "general",
    propertyNotes = "",
    clientType = "general",
    tone = "professional",
  } = body;

  const systemPrompt = `
You are Avillo — an elite real-estate AI assistant.
Tone: ${tone}
Client type: ${clientType}
Mode: ${mode}

Generate polished, accurate, high-quality real estate content.
Always format cleanly with clear titles and sections.
  `.trim();

  const userPrompt = `
Property Notes:
${propertyNotes}

Generate the appropriate output for:
Mode: ${mode}
  `.trim();

  let model = "gpt-4.1-mini"; // Fast + cheap for production

  const completion = await openai.chat.completions.create({
    model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.4,
  });

  const text = completion.choices[0]?.message?.content || "";

  return NextResponse.json({ text });
}
