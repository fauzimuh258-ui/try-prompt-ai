import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-slate-100 px-4 text-center">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
        🚀 Try Prompt AI
      </h1>
      <p className="mt-4 max-w-md text-slate-400">
        Generate prompt AI presisi tinggi dalam hitungan detik. Gratis. Oleh Vazi, founder 17 tahun.
      </p>
      <Link
        href="/generate"
        className="mt-8 rounded-lg bg-amber-500 px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-amber-400 transition-colors"
      >
        Mulai Generate →
      </Link>
    </main>
  );
}
