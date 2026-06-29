// components/generator/PromptOutputCard.tsx
"use client";

import { useState } from "react";

interface PromptOutputCardProps {
  content: string;
  isStreaming: boolean;
}

export default function PromptOutputCard({ content, isStreaming }: PromptOutputCardProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!content) return;
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API gagal (misal browser lama / permission ditolak) — abaikan secara senyap
    }
  }

  if (!content && !isStreaming) {
    return (
      <div className="flex min-h-[240px] w-full max-w-2xl items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 p-8 text-center">
        <p className="text-sm text-slate-500">
          Hasil prompt akan muncul di sini setelah kamu mengisi form dan menekan Generate.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-slate-100">Hasil Prompt</h3>
          {isStreaming && (
            <span className="flex items-center gap-1.5 text-xs text-amber-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
              Menyusun...
            </span>
          )}
        </div>
        <button
          onClick={handleCopy}
          disabled={!content}
          className="rounded-md border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-slate-600 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {copied ? "Tersalin ✓" : "Copy"}
        </button>
      </div>

      <div className="px-6 py-5">
        <pre className="whitespace-pre-wrap break-words font-mono text-sm leading-relaxed text-slate-200">
          {content}
          {isStreaming && <span className="ml-0.5 inline-block h-4 w-2 animate-pulse bg-amber-400 align-middle" />}
        </pre>
      </div>
    </div>
  );
  }
