// app/api/generate-prompt/route.ts

import { streamText } from "ai";
import { groq } from "@ai-sdk/groq";
import { deepseek } from "@ai-sdk/deepseek";
import { PROMPTY_AI_SYSTEM_PROMPT } from "../../../lib/ai/system-prompts";
import { FEW_SHOT_EXAMPLES } from "../../../lib/ai/few-shot-examples";
import type { PromptRequest } from "../../../lib/types/prompt.types";

export const runtime = "edge";
export const maxDuration = 60;

/**
 * Memilih provider GRATIS.
 * Utama: Groq (Llama 3.3). Fallback: DeepSeek.
 */
function resolveModel() {
  const hasGroq = !!process.env.GROQ_API_KEY;
  const hasDeepSeek = !!process.env.DEEPSEEK_API_KEY;

  if (hasGroq) return groq("llama-3.3-70b-versatile");
  if (hasDeepSeek) return deepseek("deepseek-chat");

  throw new Error(
    "Tidak ada API key gratis yang terkonfigurasi. Set GROQ_API_KEY atau DEEPSEEK_API_KEY."
  );
}

function buildUserMessage(payload: PromptRequest): string {
  const { task, persona, goal, complexity, tone } = payload;

  return `
=== REQUEST BARU DARI USER ===
Task: ${task}
Persona target: ${persona || "Tidak disebutkan"}
Goal akhir: ${goal}
Tingkat kompleksitas: ${complexity}
Tone: ${tone || "Sesuaikan otomatis"}

Jalankan metodologi CoT${complexity === "berat" || complexity === "ultra-berat" ? " + ToT" : ""} + CoV, lalu hasilkan prompt final.
`.trim();
}

export async function POST(req: Request) {
  try {
    const body: PromptRequest = await req.json();

    if (!body?.task || !body?.goal) {
      return new Response(
        JSON.stringify({ error: "Field 'task' dan 'goal' wajib diisi." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const model = resolveModel();

    const result = await streamText({  // ← TAMBAH await
      model,
      system: TRY_PROMPT_AI_ENGINE_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Contoh standar kualitas:\n\n${FEW_SHOT_EXAMPLES}`,
        },
        {
          role: "assistant",
          content: "Dipahami. Saya akan mengikuti standar tersebut.",
        },
        {
          role: "user",
          content: buildUserMessage(body),
        },
      ],
      temperature: 0.7,
    });

    return (await result).toDataStreamResponse();
  } catch (err) {
    console.error("[generate-prompt] Error:", err);
    const message = err instanceof Error ? err.message : "Terjadi kesalahan server.";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}        
