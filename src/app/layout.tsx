import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.gruporca.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Grupo RCA | Soluciones Logísticas - Montacargas en Venezuela y LATAM",
  description:
    "36+ años liderando soluciones logísticas. Venta, alquiler y servicio técnico de montacargas nuevos y usados. Megalift, Mitsubishi, Doosan. Presentes en el futuro.",
  keywords:
    "montacargas, montacargas usados, montacargas nuevos, Megalift, alquiler montacargas, Venezuela, Colombia, Panamá, servicio técnico, repuestos, Grupo RCA",
  openGraph: {
    title: "Grupo RCA | Soluciones Logísticas",
    description:
      "36+ años de experiencia. Montacargas nuevos y usados, alquiler, servicio técnico y repuestos en Venezuela y LATAM.",
    type: "website",
    locale: "es_VE",
    siteName: "Grupo RCA",
    images: [
      {
        url: "/slogan-banner.png",
        width: 1200,
        height: 630,
        alt: "Grupo RCA - Soluciones Logísticas",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Grupo RCA | Soluciones Logísticas",
    description:
      "36+ años de experiencia en montacargas nuevos y usados, alquiler, servicio técnico y repuestos en Venezuela y LATAM.",
    images: ["/slogan-banner.png"],
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
