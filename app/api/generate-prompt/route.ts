import { TRY_PROMPT_AI_ENGINE_SYSTEM_PROMPT } from "../../../lib/ai/system-prompts";
import { FEW_SHOT_EXAMPLES } from "../../../lib/ai/few-shot-examples";

export const runtime = "edge";
export const maxDuration = 60;

const GATEWAY_URL = "https://zey-ai.vercel.app/api/chat";
const GATEWAY_KEY = "vvbam988";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { task, persona, goal, complexity, tone } = body;

    if (!task || !goal) {
      return new Response(
        JSON.stringify({ error: "Field 'task' dan 'goal' wajib diisi." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const userMessage = `=== REQUEST BARU DARI USER ===
Task: ${task}
Persona target: ${persona || "Tidak disebutkan"}
Goal akhir: ${goal}
Tingkat kompleksitas: ${complexity}
Tone: ${tone || "Sesuaikan otomatis"}

${TRY_PROMPT_AI_ENGINE_SYSTEM_PROMPT}

Contoh standar kualitas:
${FEW_SHOT_EXAMPLES}`;

    const res = await fetch(GATEWAY_URL, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": GATEWAY_KEY,
  },
  body: JSON.stringify({
    messages: [{ role: "user", content: userMessage }],
    model: "gpt-oss-120b",
    max_tokens: 2048,
    temperature: 0.7,
    stream: false,  // ← TAMBAH INI
  }),
});

console.log("Status:", res.status);
const data = await res.json();
console.log("Full response:", JSON.stringify(data).slice(0, 500));

const content =
  data?.content ||
  data?.choices?.[0]?.message?.content ||
  data?.error ||
  JSON.stringify(data);

return Response.json({ content });
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Terjadi kesalahan." },
      { status: 500 }
    );
  }
                }
