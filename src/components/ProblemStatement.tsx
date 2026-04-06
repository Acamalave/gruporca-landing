"use client";
import { useInView } from "@/hooks/useInView";
import { useCountUp } from "@/hooks/useCountUp";

export default function ProblemStatement() {
  const { ref, visible } = useInView();
  const hours = useCountUp(250, 2000, visible);
  const cost = useCountUp(47, 2000, visible);

  return (
    <section className="relative py-20 bg-white overflow-hidden">
      {/* Industrial stripe background — unique to RCA */}
      <div className="absolute inset-0 rca-stripe" />

      <div ref={ref} className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-5 gap-12 items-center">
          {/* Left — stats cards with accent bar */}
          <div className={`lg:col-span-2 space-y-4 transition-all duration-800 ${visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"}`}>
            <div className="rca-tag text-brand-gold font-bold text-sm uppercase tracking-widest mb-4">
              El costo del downtime
            </div>

            <div className="rca-card bg-brand-cream rounded-xl p-6 border border-gray-100">
              <p className="rca-stat text-brand-navy">${cost}K</p>
              <p className="text-brand-muted text-sm mt-1">Costo anual promedio por equipo sin mantenimiento planificado</p>
              <div className="h-1.5 bg-gray-100 rounded-full mt-4 overflow-hidden">
                <div className="h-full bg-red-500 rounded-full transition-all duration-1000" style={{ width: visible ? "78%" : "0%" }} />
              </div>
            </div>

            <div className="rca-card bg-brand-cream rounded-xl p-6 border border-gray-100">
              <p className="rca-stat text-brand-navy">{hours}h</p>
              <p className="text-brand-muted text-sm mt-1">Horas de inactividad al ano por falta de servicio adecuado</p>
              <div className="h-1.5 bg-gray-100 rounded-full mt-4 overflow-hidden">
                <div className="h-full bg-orange-500 rounded-full transition-all duration-1000 delay-300" style={{ width: visible ? "62%" : "0%" }} />
              </div>
            </div>

            <div className="rca-card bg-brand-cream rounded-xl p-6 border border-gray-100">
              <p className="rca-stat text-brand-navy">7x</p>
              <p className="text-brand-muted text-sm mt-1">Mas caro el mantenimiento correctivo vs. el preventivo</p>
              <div className="h-1.5 bg-gray-100 rounded-full mt-4 overflow-hidden">
                <div className="h-full bg-brand-gold rounded-full transition-all duration-1000 delay-500" style={{ width: visible ? "85%" : "0%" }} />
              </div>
            </div>
          </div>

          {/* Right — solution message */}
          <div className={`lg:col-span-3 transition-all duration-800 delay-200 ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"}`}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-brand-navy leading-tight">
              Tu operacion <span className="text-gold-gradient">no puede parar.</span>
              <br />Nosotros lo garantizamos.
            </h2>
            <p className="text-brand-muted text-lg mt-6 leading-relaxed max-w-xl">
              Con 34 anos de experiencia, Grupo RCA asegura la continuidad de tu flota con equipos confiables, repuestos en stock permanente y servicio tecnico que responde en menos de 2 horas.
            </p>

            {/* Solution cards — horizontal layout */}
            <div className="grid sm:grid-cols-3 gap-4 mt-8">
              {[
                { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", title: "Garantia total", sub: "En equipos nuevos y usados" },
                { icon: "M13 10V3L4 14h7v7l9-11h-7z", title: "Respuesta < 2h", sub: "Servicio tecnico inmediato" },
                { icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15", title: "Stock permanente", sub: "Repuestos disponibles 24/7" },
              ].map((s, i) => (
                <div key={i} className="bg-brand-navy rounded-xl p-5 text-white">
                  <svg className="w-8 h-8 text-brand-gold mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={s.icon} /></svg>
                  <p className="font-bold text-sm">{s.title}</p>
                  <p className="text-white/50 text-xs mt-1">{s.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
