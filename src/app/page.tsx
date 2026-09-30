import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProblemStatement from "@/components/ProblemStatement";
import EquipmentFinder from "@/components/EquipmentFinder";
import EquipmentGrid from "@/components/EquipmentGrid";
import EquipmentCompare from "@/components/EquipmentCompare";
import CompareOptions from "@/components/CompareOptions";
// import CostCalculator from "@/components/CostCalculator"; // oculto temporalmente
import TCOCalculator from "@/components/TCOCalculator";
import Repuestos from "@/components/Repuestos";
import PartsQuoter from "@/components/PartsQuoter";
import ServiceTimeline from "@/components/ServiceTimeline";
// import ServiceTracker from "@/components/ServiceTracker"; // oculto temporalmente
// import FreightEstimator from "@/components/FreightEstimator"; // oculto temporalmente
import WhyUs from "@/components/WhyUs";
import Testimonials from "@/components/Testimonials";
import KnowledgeCenter from "@/components/KnowledgeCenter";
import QuoteForm from "@/components/QuoteForm";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import ScrollToTop from "@/components/ScrollToTop";
import EquipmentChatbot from "@/components/EquipmentChatbot";
import LiveChat from "@/components/LiveChat";
import VisitorTracker from "@/components/VisitorTracker";
import PrivacyNotice from "@/components/PrivacyNotice";
import MaintenancePage from "@/components/MaintenancePage";

export default function Home() {
  // Modo pausa: con MAINTENANCE_MODE=1 (variable de entorno en Vercel) el sitio
  // muestra solo la página de pausa; nada más carga (ni tracking ni chat).
  // Para reactivar: eliminar la variable y redesplegar.
  if (process.env.MAINTENANCE_MODE === "1") {
    return <MaintenancePage />;
  }

  return (
    <>
      <Header />
      <main>
        <Hero />
        <ProblemStatement />
        <EquipmentFinder />
        <EquipmentGrid />
        <EquipmentCompare />
        <CompareOptions />
        {/* Oculto temporalmente: calculadora Compra vs Alquiler vs Leasing */}
        {/* <CostCalculator /> */}
        <TCOCalculator />
        <Repuestos />
        <PartsQuoter />
        <ServiceTimeline />
        {/* Oculto temporalmente: seguimiento de servicio */}
        {/* <ServiceTracker /> */}
        {/* Oculto temporalmente: estimador de flete */}
        {/* <FreightEstimator /> */}
        <WhyUs />
        <Testimonials />
        <KnowledgeCenter />
        <QuoteForm />
      </main>
      <Footer />
      <WhatsAppFloat />
      <ScrollToTop />
      <EquipmentChatbot />
      <LiveChat />
      <VisitorTracker />
      <PrivacyNotice />
    </>
  );
}
