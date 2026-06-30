import "./globals.css";

export const metadata = {
  title: "Try Prompt AI — Generate Prompt AI Presisi Tinggi",
  description: "AI prompt generator gratis. Oleh Vazi, founder 17 tahun dari Indonesia.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: "#0f172a", color: "#f1f5f9", minHeight: "100vh" }}>
        {children}
      </body>
    </html>
  );
}
