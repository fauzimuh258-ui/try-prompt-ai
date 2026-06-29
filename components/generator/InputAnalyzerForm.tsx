// components/generator/InputAnalyzerForm.tsx
"use client";

import { useState, FormEvent } from "react";
import type { Complexity, PromptRequest } from "@/lib/types/prompt.types";

interface InputAnalyzerFormProps {
  onSubmit: (payload: PromptRequest) => void;
  isLoading: boolean;
}

const COMPLEXITY_OPTIONS: { value: Complexity; label: string; hint: string }[] = [
  { value: "ringan", label: "Ringan", hint: "Caption, email singkat, ide cepat" },
  { value: "menengah", label: "Menengah", hint: "Artikel, copywriting, dokumen kerja" },
  { value: "berat", label: "Berat", hint: "Analisis, riset, strategi multi-langkah" },
  { value: "ultra-berat", label: "Ultra-berat", hint: "Sistem kompleks, arsitektur, multi-agent" },
];

export default function InputAnalyzerForm({ onSubmit, isLoading }: InputAnalyzerFormProps) {
  const [task, setTask] = useState("");
  const [persona, setPersona] = useState("");
  const [goal, setGoal] = useState("");
  const [complexity, setComplexity] = useState<Complexity>("menengah");
  const [tone, setTone] = useState("");
  const [errors, setErrors] = useState<{ task?: string; goal?: string }>({});

  function validate(): boolean {
    const nextErrors: { task?: string; goal?: string } = {};
    if (!task.trim()) nextErrors.task = "Jelaskan dulu tugas yang ingin diselesaikan.";
    if (!goal.trim()) nextErrors.goal = "Jelaskan hasil akhir yang kamu inginkan.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      task: task.trim(),
      persona: persona.trim() || undefined,
      goal: goal.trim(),
      complexity,
      tone: tone.trim() || undefined,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl space-y-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-sm sm:p-8"
    >
      <div>
        <h2 className="text-lg font-semibold text-slate-100">Input Analyzer</h2>
        <p className="mt-1 text-sm text-slate-400">
          Jelaskan kebutuhanmu, Prompty AI akan menyusun prompt presisi tinggi.
        </p>
      </div>

      {/* Task */}
      <div className="space-y-1.5">
        <label htmlFor="task" className="block text-sm font-medium text-slate-200">
          Tugas yang ingin diselesaikan <span className="text-amber-400">*</span>
        </label>
        <textarea
          id="task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Contoh: Buat prompt untuk menulis email follow-up ke klien yang belum membalas"
          rows={3}
          className="w-full resize-none rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
        />
        {errors.task && <p className="text-xs text-red-400">{errors.task}</p>}
      </div>

      {/* Persona */}
      <div className="space-y-1.5">
        <label htmlFor="persona" className="block text-sm font-medium text-slate-200">
          Target persona AI <span className="text-slate-500">(opsional)</span>
        </label>
        <input
          id="persona"
          type="text"
          value={persona}
          onChange={(e) => setPersona(e.target.value)}
          placeholder="Contoh: Sales Manager B2B, Copywriter, Data Analyst"
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
        />
      </div>

      {/* Goal */}
      <div className="space-y-1.5">
        <label htmlFor="goal" className="block text-sm font-medium text-slate-200">
          Hasil akhir yang diinginkan <span className="text-amber-400">*</span>
        </label>
        <input
          id="goal"
          type="text"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="Contoh: Klien jadi terdorong untuk membalas dan jadwalkan meeting"
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
        />
        {errors.goal && <p className="text-xs text-red-400">{errors.goal}</p>}
      </div>

      {/* Complexity */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-200">Tingkat kompleksitas</label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {COMPLEXITY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setComplexity(opt.value)}
              title={opt.hint}
              className={`rounded-lg border px-3 py-2.5 text-xs font-medium transition-colors ${
                complexity === opt.value
                  ? "border-amber-500 bg-amber-500/10 text-amber-300"
                  : "border-slate-700 bg-slate-950 text-slate-400 hover:border-slate-600 hover:text-slate-200"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-500">
          {COMPLEXITY_OPTIONS.find((o) => o.value === complexity)?.hint}
        </p>
      </div>

      {/* Tone */}
      <div className="space-y-1.5">
        <label htmlFor="tone" className="block text-sm font-medium text-slate-200">
          Tone <span className="text-slate-500">(opsional)</span>
        </label>
        <input
          id="tone"
          type="text"
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          placeholder="Contoh: formal, santai, teknis, persuasif"
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-lg bg-amber-500 px-4 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? "Menyusun prompt..." : "Generate Prompt"}
      </button>
    </form>
  );
}
