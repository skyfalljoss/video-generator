
import { createClient } from "@deepgram/sdk";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { text, model } = await req.json();

    if (!text || !model) {
      return NextResponse.json(
        { error: "Missing text or model" },
        { status: 400 }
      );
    }

    const apiKey = process.env.DEEPGRAM_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Deepgram API key not configured" },
        { status: 500 }
      );
    }

    const deepgram = createClient(apiKey);

    const response = await deepgram.speak.request(
      { text },
      {
        model: model,
        encoding: "linear16",
        container: "wav",
      }
    );

    const stream = await response.getStream();

    if (!stream) {
        return NextResponse.json(
            { error: "Error generating audio" },
            { status: 500 }
        );
    }

    return new NextResponse(stream, {
        headers: {
            "Content-Type": "audio/wav",
        },
    });

  } catch (error) {
    console.error("Deepgram TTS error:", error);
    return NextResponse.json(
      { error: "Error generating audio" },
      { status: 500 }
    );
  }
}
