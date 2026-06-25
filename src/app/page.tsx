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
// import PartsQuoter from "@/components/PartsQuoter"; // oculto temporalmente
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

export default function Home() {
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
        {/* Oculto temporalmente: cotizador rápido de repuestos */}
        {/* <PartsQuoter /> */}
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
