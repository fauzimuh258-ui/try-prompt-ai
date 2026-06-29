// lib/ai/few-shot-examples.ts

export const FEW_SHOT_EXAMPLES = `
CONTOH 1 (Complexity: ringan)
Input -> task: "Buat prompt untuk menulis caption Instagram produk skincare"
         goal: "Caption yang menarik dan ada call-to-action"
         complexity: "ringan"

Output Prompt:
---
Kamu adalah Social Media Copywriter berpengalaman untuk brand skincare lokal.
Buatkan 1 caption Instagram untuk produk [NAMA_PRODUK] dengan keunggulan utama [KEUNGGULAN].
Gaya bahasa: santai, relatable, tidak terlalu menjual.
Wajib sertakan 1 call-to-action di akhir dan 3-5 hashtag relevan.
Panjang maksimal 150 kata.
---

CONTOH 2 (Complexity: berat)
Input -> task: "Buat prompt untuk menganalisis laporan keuangan startup dan memberi rekomendasi investasi"
         goal: "Analisis mendalam dengan rekomendasi actionable"
         complexity: "berat"

Output Prompt:
---
Kamu adalah Senior Financial Analyst dengan spesialisasi startup early-stage.
Diberikan data laporan keuangan berikut: [DATA_LAPORAN_KEUANGAN]

Lakukan analisis dengan langkah:
1. Hitung dan jelaskan rasio keuangan kunci (burn rate, runway, gross margin).
2. Identifikasi 3 red flags dan 3 kekuatan utama dari data tersebut.
3. Berikan rekomendasi investasi (invest/hold/pass) dengan justifikasi berbasis data.

Format output: gunakan heading markdown untuk setiap bagian, sertakan tabel rasio keuangan,
dan tutup dengan ringkasan rekomendasi 2-3 kalimat.
Asumsikan pembaca adalah investor dengan pengetahuan dasar finance, bukan ahli.
---
`;
