import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Recomenda+ | Plataforma Inteligente de Streaming e Recomendação",
  description:
    "Catálogo interativo de filmes e séries com recomendações personalizadas, controle de faixa etária e arquitetura multiparadigma.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${montserrat.variable} dark scroll-smooth`}>
      <body className="bg-zinc-950 text-zinc-100 font-sans antialiased min-h-screen selection:bg-purple-600 selection:text-white">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
