"use client";

import { useState } from "react";

export default function GeneratePage() {
  const [task, setTask] = useState("");
  const [persona, setPersona] = useState("");
  const [goal, setGoal] = useState("");
  const [complexity, setComplexity] = useState("menengah");
  const [tone, setTone] = useState("");
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
    <main style={{ minHeight: "100vh", backgroundColor: "#0f172a", color: "#f1f5f9", padding: "2rem 1rem" }}>
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 700 }}>🚀 Try Prompt AI</h1>
          <p style={{ color: "#94a3b8", marginTop: "0.5rem" }}>Generate prompt AI presisi tinggi dalam hitungan detik.</p>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            background: "rgba(30, 41, 59, 0.8)",
            border: "1px solid #334155",
            borderRadius: "12px",
            padding: "1.5rem",
            marginBottom: "2rem",
          }}
        >
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, marginBottom: "0.25rem" }}>
              Tugas *
            </label>
            <textarea
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="Contoh: Buat prompt untuk email follow-up ke klien yang belum membalas"
              rows={3}
              style={{
                width: "100%",
                padding: "0.5rem 0.75rem",
                background: "#1e293b",
                border: "1px solid #475569",
                borderRadius: "8px",
                color: "#f1f5f9",
                fontSize: "0.875rem",
                resize: "vertical",
              }}
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, marginBottom: "0.25rem" }}>
              Persona (opsional)
            </label>
            <input
              value={persona}
              onChange={(e) => setPersona(e.target.value)}
              placeholder="Contoh: Sales Manager B2B"
              style={{
                width: "100%",
                padding: "0.5rem 0.75rem",
                background: "#1e293b",
                border: "1px solid #475569",
                borderRadius: "8px",
                color: "#f1f5f9",
                fontSize: "0.875rem",
              }}
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, marginBottom: "0.25rem" }}>
              Goal *
            </label>
            <input
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="Contoh: Klien terdorong membalas dan jadwalkan meeting"
              style={{
                width: "100%",
                padding: "0.5rem 0.75rem",
                background: "#1e293b",
                border: "1px solid #475569",
                borderRadius: "8px",
                color: "#f1f5f9",
                fontSize: "0.875rem",
              }}
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, marginBottom: "0.25rem" }}>
              Kompleksitas
            </label>
            <select
              value={complexity}
              onChange={(e) => setComplexity(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem 0.75rem",
                background: "#1e293b",
                border: "1px solid #475569",
                borderRadius: "8px",
                color: "#f1f5f9",
                fontSize: "0.875rem",
              }}
            >
              <option value="ringan">Ringan</option>
              <option value="menengah">Menengah</option>
              <option value="berat">Berat</option>
              <option value="ultra-berat">Ultra Berat</option>
            </select>
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, marginBottom: "0.25rem" }}>
              Tone (opsional)
            </label>
            <input
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              placeholder="Contoh: formal, santai, teknis"
              style={{
                width: "100%",
                padding: "0.5rem 0.75rem",
                background: "#1e293b",
                border: "1px solid #475569",
                borderRadius: "8px",
                color: "#f1f5f9",
                fontSize: "0.875rem",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "0.75rem",
              background: "#f59e0b",
              color: "#0f172a",
              fontWeight: 600,
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "0.875rem",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "Menyusun..." : "Generate Prompt"}
          </button>
        </form>

        {output && (
          <div
            style={{
              background: "rgba(30, 41, 59, 0.8)",
              border: "1px solid #334155",
              borderRadius: "12px",
              padding: "1.5rem",
              fontFamily: "monospace",
              whiteSpace: "pre-wrap",
              fontSize: "0.875rem",
              lineHeight: 1.6,
            }}
          >
            {output}
          </div>
        )}
      </div>
    </main>
  );
    }
