import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Grupo RCA | Soluciones Logisticas - Montacargas en Venezuela y LATAM",
  description:
    "34+ anos liderando soluciones logisticas. Venta, alquiler y servicio tecnico de montacargas nuevos y usados. Megalift, Mitsubishi, Doosan. Presentes en el futuro.",
  keywords:
    "montacargas, montacargas usados, montacargas nuevos, Megalift, alquiler montacargas, Venezuela, Colombia, Panama, servicio tecnico, repuestos, Grupo RCA",
  openGraph: {
    title: "Grupo RCA | Soluciones Logisticas",
    description:
      "34+ anos de experiencia. Montacargas nuevos y usados, alquiler, servicio tecnico y repuestos en Venezuela y LATAM.",
    type: "website",
    locale: "es_VE",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased`}>
        <I18nProvider>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
