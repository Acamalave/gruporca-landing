"use client";
import { useInView } from "@/hooks/useInView";
import { useCountUp } from "@/hooks/useCountUp";

export default function WhyUs() {
  const { ref, visible } = useInView();
  const years = useCountUp(36, 2000, visible);
  const countries = useCountUp(6, 2000, visible);
  const clients = useCountUp(200, 2000, visible);

  const reasons = [
    { title: "36+ años de experiencia", desc: "Desde 1990 dedicados exclusivamente a soluciones logísticas y manejo de materiales en América Latina." },
    { title: "Presencia multinacional", desc: "Operaciones en Venezuela, Colombia, Panamá, Costa Rica, Honduras y Estados Unidos." },
    { title: "Pioneros en eléctrico", desc: "Liderando la transición a montacargas eléctricos de litio en LATAM con tecnología Megalift." },
    { title: "Servicio integral", desc: "Venta, alquiler, servicio técnico, repuestos y capacitación. Todo bajo un mismo grupo." },
  ];

  return (
    <section id="nosotros" className="py-20 bg-brand-navy relative overflow-hidden">
      {/* Blueprint pattern on dark */}
      <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(191,179,4,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(191,179,4,0.02) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />

      <div ref={ref} className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Stats — horizontal bar style (unique to RCA) */}
        <div className={`grid grid-cols-3 gap-4 sm:gap-6 mb-16 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          {[
            { n: years, suffix: "+", label: "Años de experiencia" },
            { n: countries, suffix: "", label: "Países con presencia" },
            { n: clients, suffix: "+", label: "Clientes activos" },
          ].map((s, i) => (
            <div key={i} className="border-l-4 border-brand-gold pl-4 sm:pl-6 py-2">
              <p className="rca-stat text-brand-gold">{s.n}{s.suffix}</p>
              <p className="text-sm text-white/40 mt-1 font-medium">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Content — asymmetric grid */}
        <div className={`grid lg:grid-cols-5 gap-12 items-start transition-all duration-700 delay-200 ${visible ? "opacity-100" : "opacity-0"}`}>
          <div className="lg:col-span-3">
            <div className="rca-tag text-brand-gold font-bold text-sm uppercase tracking-widest mb-4">
              Por qué Grupo RCA
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-8 leading-tight">
              El holding logístico más completo de Latinoamérica
            </h2>
            <div className="space-y-4">
              {reasons.map((r, i) => (
                <div key={i} className="rca-card bg-white/[0.04] rounded-xl p-5 border border-white/[0.06]">
                  <div className="flex gap-4 items-start">
                    <div className="shrink-0 w-8 h-8 bg-brand-gold/10 rounded-lg flex items-center justify-center mt-0.5">
                      <svg className="w-4 h-4 text-brand-gold" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" /></svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm">{r.title}</h3>
                      <p className="text-sm text-white/45 mt-1 leading-relaxed">{r.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 relative">
            <div className="rounded-2xl overflow-hidden">
              <img src="/img/company/operaciones-2.jpg" alt="Operaciones Grupo RCA" className="w-full aspect-[3/4] object-cover" />
            </div>
            {/* Floating slogan card */}
            <div className="absolute -bottom-4 -left-4 bg-brand-gold rounded-xl p-5 max-w-[200px] shadow-xl">
              <p className="text-brand-navy text-sm font-black uppercase tracking-wide leading-tight">Presentes en el futuro</p>
              <p className="text-brand-navy/60 text-xs mt-1">Innovación y sostenibilidad</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
