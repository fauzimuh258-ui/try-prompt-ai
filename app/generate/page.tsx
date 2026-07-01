"use client";

import { useState } from "react";
import InputAnalyzerForm from "../../components/generator/InputAnalyzerForm";
import PromptOutputCard from "../../components/generator/PromptOutputCard";
import type { PromptRequest } from "../../lib/types/prompt.types";

export default function GeneratePage() {
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  if (!task || !goal) return;
  setLoading(true);
  setOutput("");

  try {
    const res = await fetch("/api/generate-prompt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task, persona, goal, complexity, tone }),
    });

    if (!res.ok) {
      const err = await res.json();
      setOutput(`Error: ${err.error}`);
      return;
    }

    const reader = res.body?.getReader();
    if (!reader) return;

    let result = "";
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });

      // Parse SSE format dari AI SDK
      const lines = chunk.split("\n");
      for (const line of lines) {
        if (line.startsWith('0:"')) {
          result += line
            .slice(3)
            .replace(/\\n/g, "\n")
            .replace(/\\"/g, '"')
            .replace(/"$/, "");
        }
      }

      setOutput(result);
    }
  } catch (e) {
    setOutput(`Error: ${e instanceof Error ? e.message : "Gagal generate"}`);
  } finally {
    setLoading(false);
  }
      }
  

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 px-4 py-10">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="text-center">
          <h1 className={styles.title}>🚀 Try Prompt AI</h1>
<p>Generate prompt AI presisi tinggi dalam hitungan detik.</p>
        </div>

        <InputAnalyzerForm onSubmit={handleGenerate} isLoading={loading} />
        <PromptOutputCard content={output} isStreaming={loading} />
      </div>
    </main>
  );
}
