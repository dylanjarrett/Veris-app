// src/app/api/generate-intelligence/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";
import type { VerisIntelligencePack } from "../../../types/veris";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.error("Missing OPENAI_API_KEY in environment");
      return NextResponse.json(
        { error: "Server is missing OPENAI_API_KEY" },
        { status: 500 }
      );
    }

    const { propertyText } = await req.json();

    if (!propertyText || typeof propertyText !== "string") {
      return NextResponse.json(
        { error: "propertyText is required" },
        { status: 400 }
      );
    }

    const systemPrompt = `
You are Veris, an AI assistant that generates a complete property marketing and intelligence pack for real estate professionals.

Return ONLY valid JSON with this exact shape (no extra keys, no explanations):

{
  "listing": {
    "long": string,
    "short": string,
    "bullets": string[]
  },
  "social": {
    "instagram_caption": string,
    "facebook_post": string,
    "linkedin_post": string,
    "tiktok_hook": string,
    "tiktok_script": string
  },
  "emails": {
    "buyer_email": string,
    "seller_email": string
  },
  "talking_points": {
    "highlights": string[],
    "buyer_concerns": string[],
    "responses": string[]
  },
  "marketability": {
    "score_1_to_10": number,
    "summary": string,
    "improvement_suggestions": string[]
  },
  "open_house_pitch": string,
  "vision_features": {
    "interior_style": string,
    "notable_amenities": string[],
    "exterior_notes": string[],
    "potential_ideal_buyer": string
  }
}

Writing style:
- Modern, clear, and professional.
- Avoid over-the-top hype or emojis (except where natural for Instagram/TikTok).
- Tailor everything to the specific property details provided.
    `.trim();

    const userPrompt = `
Property details from the agent:

${propertyText}
`.trim();

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini", // you can change this to another available model if needed
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    const raw = completion.choices[0]?.message?.content;

    if (!raw) {
      console.error("OpenAI returned no content:", completion);
      return NextResponse.json(
        { error: "No content returned from OpenAI" },
        { status: 500 }
      );
    }

    const parsed = JSON.parse(raw) as VerisIntelligencePack;

    return NextResponse.json(parsed);
  } catch (error: any) {
    console.error(
      "Error in generate-intelligence:",
      error?.response?.data ?? error
    );
    return NextResponse.json(
      {
        error:
          error?.message ??
          "Failed to generate intelligence pack (check server logs)",
      },
      { status: 500 }
    );
  }
}
