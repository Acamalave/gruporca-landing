"use client";
import { useInView } from "@/hooks/useInView";

const WA = "584241700600";

const options = [
  {
    title: "Compra",
    description: "Adquiere tu equipo nuevo o usado con garantía completa",
    features: ["Equipo 100% tuyo", "Garantía de fábrica", "Soporte técnico incluido", "Repuestos garantizados"],
    ideal: "Uso continuo, +3 años",
    cta: "Cotizar compra",
    msg: "Hola, quiero cotizar la compra de un montacargas",
    highlight: true,
  },
  {
    title: "Alquiler",
    description: "Equipo listo cuando lo necesites, sin compromiso a largo plazo",
    features: ["Sin inversión inicial alta", "Mantenimiento incluido", "Reemplazo inmediato", "Facturación mensual"],
    ideal: "Proyectos puntuales",
    cta: "Cotizar alquiler",
    msg: "Hola, necesito cotizar el alquiler de un montacargas",
    highlight: false,
  },
  {
    title: "Servicio Técnico",
    description: "Mantenimiento preventivo y correctivo para todas las marcas",
    features: ["Técnicos certificados", "Repuestos originales", "Atención en sitio", "Contratos de servicio"],
    ideal: "Flota existente",
    cta: "Solicitar servicio",
    msg: "Hola, necesito servicio técnico para mi montacargas",
    highlight: false,
  },
];

export default function CompareOptions() {
  const { ref, visible } = useInView();

  return (
    <section id="servicios" className="py-20 bg-brand-navy">
      <div ref={ref} className={`max-w-7xl mx-auto px-4 sm:px-6 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <div className="mb-14">
          <div className="rca-tag text-brand-gold font-bold text-sm uppercase tracking-widest mb-3">Soluciones flexibles</div>
          <h2 className="text-3xl sm:text-4xl font-black text-white">Compra, alquila o servicio</h2>
          <p className="text-white/50 mt-3 max-w-lg">Elige la modalidad que mejor se adapte a tu operación y presupuesto</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {options.map((o, i) => (
            <div key={i} className={`relative rounded-2xl p-8 transition-all ${
              o.highlight
                ? "bg-brand-gold text-brand-navy ring-2 ring-brand-gold scale-[1.02]"
                : "bg-white/[0.04] text-white border border-white/10 hover:border-brand-gold/50"
            }`}>
              {o.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-navy text-brand-gold text-xs font-bold px-4 py-1 rounded-full">MÁS POPULAR</span>
              )}
              <h3 className="text-2xl font-bold mb-2">{o.title}</h3>
              <p className={`text-sm mb-6 ${o.highlight ? "text-brand-navy/70" : "text-white/50"}`}>{o.description}</p>
              <ul className="space-y-3 mb-6">
                {o.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm">
                    <svg className={`w-4 h-4 shrink-0 ${o.highlight ? "text-brand-navy" : "text-brand-gold"}`} fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" /></svg>
                    <span className={o.highlight ? "text-brand-navy/80" : "text-white/70"}>{f}</span>
                  </li>
                ))}
              </ul>
              <p className={`text-xs mb-6 ${o.highlight ? "text-brand-navy/60" : "text-white/40"}`}>Ideal para: {o.ideal}</p>
              <a
                href={`https://wa.me/${WA}?text=${encodeURIComponent(o.msg)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`block w-full text-center font-bold py-3.5 rounded-xl text-sm transition-all ${
                  o.highlight ? "bg-brand-navy text-brand-gold hover:bg-brand-navy-light" : "bg-brand-gold hover:bg-brand-gold-light text-brand-navy"
                }`}
              >
                {o.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
