import LandingPage from "@/components/LandingPage";
import MaintenancePage from "@/components/MaintenancePage";

export default function Home() {
  // Modo pausa: con MAINTENANCE_MODE=1 (variable de entorno en Vercel) el sitio
  // muestra solo la página de pausa; nada más carga (ni tracking ni chat).
  // El equipo puede seguir revisando el landing completo en /preview.
  // Para reactivar: eliminar la variable y redesplegar.
  if (process.env.MAINTENANCE_MODE === "1") {
    return <MaintenancePage />;
  }

  return <LandingPage />;
}
