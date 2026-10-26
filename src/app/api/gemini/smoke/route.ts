import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY?.trim() || "";
  const model = process.env.GEMINI_MODEL?.trim() || "gemini-2.0-flash";

  if (!apiKey) {
    return NextResponse.json({
      configured: false,
      status: "unconfigured",
      model,
      message: "GEMINI_API_KEY is not configured in .env.local",
      maskedKey: null,
      latencyMs: 0,
      sampleResponse: null,
    });
  }

  const maskedKey = apiKey.length > 6
    ? `••••${apiKey.slice(-4)}`
    : "••••";

  const startTime = Date.now();
  try {
    const ai = new GoogleGenAI({ apiKey });

    // Lightweight verification request
    const res = await ai.models.generateContent({
      model,
      contents: "Return a JSON object with: { \"status\": \"connected\", \"model\": \"" + model + "\", \"timestamp\": " + Date.now() + " }",
      config: {
        responseMimeType: "application/json",
        temperature: 0.1,
      },
    });

    const latencyMs = Date.now() - startTime;
    let parsed: any = null;
    try {
      parsed = JSON.parse(res.text || "{}");
    } catch {
      parsed = { rawText: res.text };
    }

    return NextResponse.json({
      configured: true,
      status: "success",
      model,
      maskedKey,
      latencyMs,
      sampleResponse: parsed,
    });
  } catch (err: any) {
    const latencyMs = Date.now() - startTime;
    return NextResponse.json(
      {
        configured: true,
        status: "error",
        model,
        maskedKey,
        latencyMs,
        error: err?.message || "Unknown error calling Gemini API",
      },
      { status: 502 }
    );
  }
}
