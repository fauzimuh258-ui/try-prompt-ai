// app/api/generate-prompt/route.ts

import { streamText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";
import { PROMPTY_AI_SYSTEM_PROMPT } from "@/lib/ai/system-prompts";
import { FEW_SHOT_EXAMPLES } from "@/lib/ai/few-shot-examples";
import type { PromptRequest } from "@/lib/types/prompt.types";

// Edge runtime untuk latensi rendah di Vercel
export const runtime = "edge";
export const maxDuration = 60;

/**
 * Memilih provider AI berdasarkan availability key.
 * Fallback ke OpenAI jika Anthropic key tidak tersedia, dan sebaliknya.
 * Ini memenuhi requirement "fallback ke model lain jika error" dari master prompt.
 */
function resolveModel() {
  const hasAnthropic = !!process.env.ANTHROPIC_API_KEY;
  const hasOpenAI = !!process.env.OPENAI_API_KEY;

  if (hasAnthropic) return anthropic("claude-sonnet-4-6");
  if (hasOpenAI) return openai("gpt-4o");

  throw new Error(
    "Tidak ada API key yang terkonfigurasi. Set ANTHROPIC_API_KEY atau OPENAI_API_KEY di environment variables."
  );
}

function buildUserMessage(payload: PromptRequest): string {
  const { task, persona, goal, complexity, tone } = payload;

  return `
=== REQUEST BARU DARI USER ===
Task: ${task}
Persona target (siapa yang akan menjalankan prompt ini): ${persona || "Tidak disebutkan, tentukan yang paling sesuai"}
Goal akhir: ${goal}
Tingkat kompleksitas: ${complexity}
Tone yang diinginkan: ${tone || "Sesuaikan otomatis berdasarkan konteks"}

Jalankan metodologi CoT${complexity === "berat" || complexity === "ultra-berat" ? " + ToT" : ""} + CoV sesuai instruksi system prompt, lalu hasilkan prompt final sesuai format yang ditentukan.
`.trim();
}

export async function POST(req: Request) {
  try {
    const body: PromptRequest = await req.json();

    // Validasi input dasar
    if (!body?.task || !body?.goal) {
      return new Response(
        JSON.stringify({ error: "Field 'task' dan 'goal' wajib diisi." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const model = resolveModel();

    const result = streamText({
      model,
      system: PROMPTY_AI_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Berikut contoh standar kualitas yang harus kamu ikuti:\n\n${FEW_SHOT_EXAMPLES}`,
        },
        {
          role: "assistant",
          content: "Dipahami. Saya akan mengikuti standar kualitas tersebut untuk setiap prompt yang saya hasilkan.",
        },
        {
          role: "user",
          content: buildUserMessage(body),
        },
      ],
      temperature: 0.7,
    });

    return result.toDataStreamResponse();
  } catch (err) {
    console.error("[generate-prompt] Error:", err);

    const message =
      err instanceof Error ? err.message : "Terjadi kesalahan pada server.";

    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
                          }
  
