import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { prompt, files, model } = await req.json();

    if (!prompt || !files || !model) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const response = await openai.chat.completions.create({
      model: model,
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that provides feedback on academic papers.",
        },
        {
          role: "user",
          content: `
            Rubric/Instructions:
            ${prompt}

            Paper content:
            ${files.map((f: any) => f.content).join("\n\n")}
          `,
        },
      ],
    });

    return NextResponse.json({ feedback: response.choices[0].message.content });
  } catch (error) {
    console.error("OpenAI API error:", error);
    return NextResponse.json(
      { error: "Error generating feedback" },
      { status: 500 }
    );
  }
}
