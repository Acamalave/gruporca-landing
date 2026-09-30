import type { Metadata } from "next";
import LandingPage from "@/components/LandingPage";

// Vista previa interna: muestra el landing completo aunque el sitio público
// esté en pausa, para que el equipo revise las modificaciones en curso.
// No se indexa (robots) y no cuenta visitas en las estadísticas.
export const metadata: Metadata = {
  title: "Vista previa — Grupo RCA",
  robots: { index: false, follow: false },
};

export default function PreviewPage() {
  return (
    <>
      <LandingPage trackVisits={false} />
      <div className="fixed bottom-0 inset-x-0 z-[80] bg-amber-400 text-brand-navy text-center text-xs font-bold py-1.5">
        Vista previa interna — el sitio público está en pausa
      </div>
    </>
  );
}
