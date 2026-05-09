// app/api/lex/route.ts

import { NextRequest, NextResponse } from "next/server";
import {
  LexRuntimeV2Client,
  RecognizeTextCommand,
} from "@aws-sdk/client-lex-runtime-v2";

const client = new LexRuntimeV2Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    sessionToken: process.env.AWS_SESSION_TOKEN,  // añade esto
  },
});

export async function POST(req: NextRequest) {
  try {
    const { message, sessionId } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "El campo 'message' es requerido" },
        { status: 400 }
      );
    }

    const command = new RecognizeTextCommand({
      botId: process.env.LEX_BOT_ID!,
      botAliasId: process.env.LEX_BOT_ALIAS_ID!,
      localeId: "es_ES",
      sessionId: sessionId ?? `session-${Date.now()}`,
      text: message,
    });

    const response = await client.send(command);

    const messageText =
      response.messages
        ?.map((m) => m.content ?? "")
        .filter(Boolean)
        .join("\n") ?? "Lo siento, no tengo una respuesta en este momento.";

    return NextResponse.json({ message: messageText });
  } catch (error: unknown) {
    console.error("[LEX ERROR]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error interno" },
      { status: 500 }
    );
  }
}