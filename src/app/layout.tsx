import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Vereadora Cássia | PT - Caraguatatuba",
  description: "Site oficial da Vereadora Cássia (PT) - Caraguatatuba/SP. Trabalhando por uma cidade mais humana e inclusiva, em defesa das mulheres, cultura e moradia digna.",
  keywords: ["vereadora", "cássia", "PT", "caraguatatuba", "câmara municipal", "moradia", "mulheres", "cultura"],
  authors: [{ name: "Gabinete Vereadora Cássia" }],
  openGraph: {
    title: "Vereadora Cássia | PT - Caraguatatuba",
    description: "Por uma Caraguatatuba mais humana e inclusiva. Sua voz na Câmara Municipal.",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
