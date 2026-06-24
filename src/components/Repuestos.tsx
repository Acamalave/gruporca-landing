"use client";
import { useInView } from "@/hooks/useInView";

const UNIPARTS = "https://upandina.com/";

const categories = [
  { name: "Cauchos y Llantas", desc: "Sólidos, neumáticos y de poliuretano", msg: "Hola, necesito cotizar cauchos para montacargas" },
  { name: "Baterías y Cargadores", desc: "Litio, ácido-plomo y cargadores industriales", msg: "Hola, necesito cotizar baterías para montacargas" },
  { name: "Sistema Hidráulico", desc: "Bombas, cilindros, mangueras y sellos", msg: "Hola, necesito repuestos del sistema hidráulico" },
  { name: "Motor y Transmisión", desc: "Repuestos originales y alternativos", msg: "Hola, necesito repuestos de motor y transmisión" },
  { name: "Sistema Eléctrico", desc: "Contactores, cables, controladores", msg: "Hola, necesito repuestos del sistema eléctrico" },
  { name: "Cadenas y Rodillos", desc: "Para mástiles y sistemas de elevación", msg: "Hola, necesito cadenas y rodillos para montacargas" },
];

export default function Repuestos() {
  const { ref, visible } = useInView();

  return (
    <section id="repuestos" className="py-20 bg-brand-cream rca-blueprint">
      <div ref={ref} className={`max-w-7xl mx-auto px-4 sm:px-6 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <div className="mb-14">
          <div className="rca-tag text-brand-gold font-bold text-sm uppercase tracking-widest mb-3">Stock permanente</div>
          <h2 className="text-3xl sm:text-4xl font-black text-brand-navy">Repuestos y partes</h2>
          <p className="text-brand-muted mt-3 max-w-lg">Originales y alternativos para todas las marcas. Encuéntralos en nuestra tienda Uniparts.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat, i) => (
            <a
              key={i}
              href={UNIPARTS}
              target="_blank"
              rel="noopener noreferrer"
              className="group rca-card flex items-start gap-4 bg-white p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-brand-gold/10 flex items-center justify-center shrink-0 group-hover:bg-brand-gold/20 transition-colors">
                <svg className="w-5 h-5 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <div>
                <h3 className="font-bold text-brand-navy group-hover:text-brand-gold transition-colors">{cat.name}</h3>
                <p className="text-sm text-brand-muted mt-1">{cat.desc}</p>
                <span className="text-brand-gold text-xs font-semibold mt-2 inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Consultar disponibilidad
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </span>
              </div>
            </a>
          ))}
        </div>

        {/* Guarantee */}
        <div className="mt-12 bg-brand-navy rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
          <div className="shrink-0">
            <svg className="w-12 h-12 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          </div>
          <div>
            <h3 className="font-bold text-white text-lg">Garantía en todos nuestros repuestos</h3>
            <p className="text-white/60 text-sm mt-1">Trabajamos con repuestos originales y alternativos certificados. Soporte técnico para instalación y mantenimiento en toda Venezuela.</p>
          </div>
          <a href={UNIPARTS} target="_blank" rel="noopener noreferrer" className="shrink-0 bg-brand-gold hover:bg-brand-gold-light text-brand-navy font-bold px-6 py-3 rounded-xl text-sm transition-all">
            Ir a la tienda de repuestos
          </a>
        </div>
      </div>
    </section>
  );
}
