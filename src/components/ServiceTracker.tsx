"use client";
import { useState } from "react";
import { useInView } from "@/hooks/useInView";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

const WA = "584241700600";

type ServiceStatus = "recibido" | "diagnostico" | "cotizacion" | "aprobado" | "en-proceso" | "completado" | "entregado";

const statusSteps: { key: ServiceStatus; label: string; icon: string }[] = [
  { key: "recibido", label: "Recibido", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  { key: "diagnostico", label: "Diagnóstico", icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" },
  { key: "cotizacion", label: "Cotización", icon: "M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" },
  { key: "aprobado", label: "Aprobado", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
  { key: "en-proceso", label: "En proceso", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" },
  { key: "completado", label: "Completado", icon: "M5 13l4 4L19 7" },
  { key: "entregado", label: "Entregado", icon: "M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" },
];

type ServiceOrder = {
  orderNumber: string;
  clientName: string;
  equipment: string;
  status: ServiceStatus;
  description: string;
  estimatedDate: string;
  technician: string;
  updates: { date: string; note: string }[];
};

// Demo data for when Firebase is not configured
const demoOrders: Record<string, ServiceOrder> = {
  "SRV-2024-001": {
    orderNumber: "SRV-2024-001",
    clientName: "Distribuidora Oriental",
    equipment: "Montacargas Diésel 5T - Mitsubishi FD50",
    status: "en-proceso",
    description: "Mantenimiento preventivo 4000 horas + cambio de cadenas de elevación",
    estimatedDate: "2024-04-05",
    technician: "Carlos Méndez",
    updates: [
      { date: "2024-03-28", note: "Equipo recibido en taller" },
      { date: "2024-03-29", note: "Diagnóstico completado. Se identificaron cadenas con desgaste y filtros vencidos" },
      { date: "2024-03-30", note: "Cotización enviada y aprobada por cliente" },
      { date: "2024-04-01", note: "Repuestos recibidos. Inicio de trabajos" },
    ],
  },
  "SRV-2024-002": {
    orderNumber: "SRV-2024-002",
    clientName: "Almacenes Premium",
    equipment: "Apilador Eléctrico 1.6T - Megalift",
    status: "cotizacion",
    description: "Reparación sistema hidráulico - fuga en cilindro de elevación",
    estimatedDate: "2024-04-10",
    technician: "José Rodríguez",
    updates: [
      { date: "2024-04-01", note: "Equipo recibido" },
      { date: "2024-04-02", note: "Diagnóstico: cilindro de elevación requiere cambio de sellos y revisión de bomba" },
      { date: "2024-04-03", note: "Cotización enviada al cliente - pendiente aprobación" },
    ],
  },
};

export default function ServiceTracker() {
  const [orderNumber, setOrderNumber] = useState("");
  const [order, setOrder] = useState<ServiceOrder | null>(null);
  const [searching, setSearching] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const { ref, visible } = useInView();

  const handleSearch = async () => {
    if (!orderNumber.trim()) return;
    setSearching(true);
    setNotFound(false);
    setOrder(null);

    try {
      // Try Firebase first
      const docRef = doc(db, "serviceOrders", orderNumber.trim().toUpperCase());
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setOrder(docSnap.data() as ServiceOrder);
      } else {
        // Fallback to demo data
        const demo = demoOrders[orderNumber.trim().toUpperCase()];
        if (demo) {
          setOrder(demo);
        } else {
          setNotFound(true);
        }
      }
    } catch {
      // Firebase not configured - use demo data
      const demo = demoOrders[orderNumber.trim().toUpperCase()];
      if (demo) {
        setOrder(demo);
      } else {
        setNotFound(true);
      }
    }
    setSearching(false);
  };

  const currentIdx = order ? statusSteps.findIndex((s) => s.key === order.status) : -1;

  return (
    <section id="seguimiento" className="py-20 bg-brand-navy">
      <div ref={ref} className={`max-w-7xl mx-auto px-4 sm:px-6 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <div className="mb-12">
          <div className="rca-tag text-brand-gold font-bold text-sm uppercase tracking-widest mb-3">Portal de cliente</div>
          <h2 className="text-3xl sm:text-4xl font-black text-white">Seguimiento de servicio</h2>
          <p className="text-white/50 mt-3 max-w-lg">Consulta el estado de tu equipo en tiempo real. Ingresa tu número de orden.</p>
        </div>

        {/* Search */}
        <div className="max-w-xl mx-auto mb-10">
          <div className="flex gap-3">
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Ej: SRV-2024-001"
              className="flex-1 bg-white/[0.06] border border-white/10 text-white placeholder:text-white/30 rounded-xl px-5 py-3.5 text-sm outline-none focus:border-brand-gold transition-colors"
            />
            <button
              onClick={handleSearch}
              disabled={searching}
              className="bg-brand-gold hover:bg-brand-gold-light disabled:bg-brand-gold/50 text-brand-navy font-bold px-6 py-3.5 rounded-xl text-sm transition-all flex items-center gap-2"
            >
              {searching ? (
                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              )}
              Buscar
            </button>
          </div>
          <p className="text-white/30 text-xs mt-2">Prueba con: SRV-2024-001 o SRV-2024-002</p>
        </div>

        {/* Not found */}
        {notFound && (
          <div className="max-w-xl mx-auto text-center bg-white/[0.04] rounded-2xl p-8 border border-white/10">
            <svg className="w-12 h-12 text-white/20 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <p className="text-white/60 mb-4">No encontramos una orden con ese número.</p>
            <a href={`https://wa.me/${WA}?text=${encodeURIComponent(`Hola, quiero consultar el estado de mi servicio. Mi número de orden es: ${orderNumber}`)}`} target="_blank" rel="noopener noreferrer" className="text-brand-gold text-sm font-semibold hover:underline">
              Contactar por WhatsApp
            </a>
          </div>
        )}

        {/* Order details */}
        {order && (
          <div className="max-w-4xl mx-auto animate-fade-in-up">
            {/* Header */}
            <div className="bg-white/[0.06] rounded-2xl border border-white/10 p-6 mb-6">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div>
                  <p className="text-brand-gold font-bold text-lg">{order.orderNumber}</p>
                  <p className="text-white font-bold text-xl mt-1">{order.equipment}</p>
                  <p className="text-white/50 text-sm mt-1">{order.clientName}</p>
                </div>
                <div className="text-right">
                  <p className="text-white/40 text-xs">Técnico asignado</p>
                  <p className="text-white font-semibold text-sm">{order.technician}</p>
                  <p className="text-white/40 text-xs mt-2">Fecha estimada</p>
                  <p className="text-brand-gold font-semibold text-sm">{order.estimatedDate}</p>
                </div>
              </div>
              <p className="text-white/60 text-sm bg-white/[0.04] rounded-xl p-4">{order.description}</p>
            </div>

            {/* Progress steps */}
            <div className="bg-white/[0.06] rounded-2xl border border-white/10 p-6 mb-6">
              <h4 className="text-white font-bold text-sm mb-6">Progreso</h4>
              <div className="flex items-center justify-between overflow-x-auto pb-2 gap-1">
                {statusSteps.map((step, i) => {
                  const isDone = i <= currentIdx;
                  const isCurrent = i === currentIdx;
                  return (
                    <div key={step.key} className="flex items-center">
                      <div className="flex flex-col items-center min-w-[70px]">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                          isCurrent ? "bg-brand-gold text-brand-navy ring-4 ring-brand-gold/30" :
                          isDone ? "bg-brand-gold/20 text-brand-gold" : "bg-white/[0.06] text-white/30"
                        }`}>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={step.icon} /></svg>
                        </div>
                        <p className={`text-[10px] mt-2 font-medium text-center ${isCurrent ? "text-brand-gold" : isDone ? "text-white/60" : "text-white/30"}`}>{step.label}</p>
                      </div>
                      {i < statusSteps.length - 1 && (
                        <div className={`h-0.5 w-6 sm:w-10 mx-1 rounded-full ${i < currentIdx ? "bg-brand-gold/40" : "bg-white/10"}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Updates log */}
            <div className="bg-white/[0.06] rounded-2xl border border-white/10 p-6">
              <h4 className="text-white font-bold text-sm mb-4">Historial de actualizaciones</h4>
              <div className="space-y-4">
                {order.updates.map((u, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full ${i === 0 ? "bg-brand-gold" : "bg-white/20"}`} />
                      {i < order.updates.length - 1 && <div className="w-0.5 flex-1 bg-white/10 mt-1" />}
                    </div>
                    <div className="pb-4">
                      <p className="text-white/40 text-xs">{u.date}</p>
                      <p className="text-white/80 text-sm mt-0.5">{u.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center mt-6">
              <a
                href={`https://wa.me/${WA}?text=${encodeURIComponent(`Hola, tengo una consulta sobre mi orden ${order.orderNumber}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-brand-gold text-sm font-semibold hover:underline"
              >
                Consultar con servicio técnico
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
