"use client";
import { useInView } from "@/hooks/useInView";

const steps = [
  { title: "Contacto", desc: "Nos escribes por WhatsApp, teléfono o formulario", icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z", time: "Inmediato" },
  { title: "Diagnóstico", desc: "Evaluamos tu necesidad operativa con precisión", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4", time: "< 2 horas" },
  { title: "Cotización", desc: "Propuesta detallada con opciones y disponibilidad", icon: "M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z", time: "Mismo día" },
  { title: "Ejecución", desc: "Entrega, instalación o servicio en sitio", icon: "M5 13l4 4L19 7", time: "Según acuerdo" },
  { title: "Seguimiento", desc: "Acompañamiento post-venta y soporte continuo", icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z", time: "Permanente" },
];

export default function ServiceTimeline() {
  const { ref, visible } = useInView();

  return (
    <section className="py-20 bg-brand-cream rca-blueprint">
      <div ref={ref} className={`max-w-7xl mx-auto px-4 sm:px-6 transition-all duration-700 ${visible ? "opacity-100" : "opacity-0"}`}>
        <div className="mb-14">
          <div className="rca-tag text-brand-gold font-bold text-sm uppercase tracking-widest mb-4">
            Nuestro proceso
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-brand-navy">Así trabajamos contigo</h2>
          <p className="text-brand-muted mt-3">De la necesidad a la solución, en el menor tiempo posible</p>
        </div>

        {/* Steps — numbered card layout (unique to RCA) */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {steps.map((s, i) => (
            <div
              key={i}
              className="rca-card bg-white rounded-xl p-5 border border-gray-100 relative overflow-hidden group"
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              {/* Large background number */}
              <span className="absolute -top-2 -right-2 text-7xl font-black text-brand-navy/[0.03] leading-none select-none">{i + 1}</span>

              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-500 ${visible ? "bg-brand-gold text-brand-navy" : "bg-gray-100 text-gray-300"}`} style={{ transitionDelay: `${i * 0.15}s` }}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={s.icon} /></svg>
              </div>

              <h4 className="font-bold text-brand-navy text-sm">{s.title}</h4>
              <p className="text-brand-muted text-xs mt-1 leading-relaxed">{s.desc}</p>

              <div className="mt-3 pt-3 border-t border-gray-100">
                <span className="text-brand-gold text-xs font-bold">{s.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
