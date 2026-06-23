"use client";
import { useState } from "react";
import { useInView } from "@/hooks/useInView";

const WA = "584244013250";

const equipment = [
  { name: "Contrabalanceado Litio 2.5T", brand: "Megalift", capacity: "2.5 Ton", type: "Eléctrico Litio", condition: "Nuevo", image: "/img/equipment/ec20-litio-4w.png", badge: "NUEVO", features: ["Batería de litio", "Carga rápida 1.5h", "Cero emisiones"] },
  { name: "Montacargas Diésel 5T", brand: "Andino", capacity: "5.0 Ton", type: "Diésel", condition: "Usado", image: "/img/equipment/diesel-andino.jpg", badge: "CERTIFICADO", features: ["Motor industrial", "3,200 horas", "Garantía 6 meses"] },
  { name: "Apilador Eléctrico 1.6T", brand: "Megalift", capacity: "1.6 Ton", type: "Eléctrico", condition: "Nuevo", image: "/img/equipment/apilador-litio.jpg", badge: "EN STOCK", features: ["5.5m elevación", "Pasillo angosto", "Operación silenciosa"] },
  { name: "Contrabalanceado Diésel 4x4", brand: "Andino", capacity: "3.0 Ton", type: "Diésel 4x4", condition: "Usado", image: "/img/equipment/diesel-4x4.jpg", badge: "OFERTA", features: ["Tracción 4x4", "Todo terreno", "Cabina cerrada"] },
  { name: "Transpaleta Eléctrica 2T", brand: "Megalift", capacity: "2.0 Ton", type: "Eléctrica", condition: "Nuevo", image: "/img/equipment/transpaleta-litio.jpg", badge: "NUEVO", features: ["Compacta", "Fácil operación", "Bajo mantenimiento"] },
  { name: "Reach Truck 1.5T", brand: "Narrow Aisle", capacity: "1.5 Ton", type: "Eléctrico", condition: "Nuevo", image: "/img/equipment/reach-truck.jpg", badge: "DISPONIBLE", features: ["10m elevación", "Retráctil", "Alta precisión"] },
];

const filters = ["Todos", "Nuevo", "Usado"];

export default function EquipmentGrid() {
  const [filter, setFilter] = useState("Todos");
  const { ref, visible } = useInView();

  const filtered = filter === "Todos" ? equipment : equipment.filter((e) => e.condition === filter);

  return (
    <section id="equipos" className="py-20 bg-brand-cream rca-blueprint">
      <div ref={ref} className={`max-w-7xl mx-auto px-4 sm:px-6 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 gap-4">
          <div>
            <div className="rca-tag text-brand-gold font-bold text-sm uppercase tracking-widest mb-3">
              Inventario
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-brand-navy">Equipos disponibles</h2>
            <p className="text-brand-muted mt-2">Nuevos y usados certificados. Listos para entrega.</p>
          </div>
          <div className="flex gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${filter === f ? "bg-brand-navy text-brand-gold" : "bg-white border border-gray-200 text-brand-navy hover:border-brand-gold/40"}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 rca-stagger">
          {filtered.map((item, i) => (
            <div key={i} className="rca-card bg-white rounded-xl border border-gray-100 overflow-hidden group">
              <div className="relative h-48 bg-gray-100 overflow-hidden">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <span className={`absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-lg flex items-center gap-1.5 ${
                  item.badge === "NUEVO" || item.badge === "EN STOCK" ? "bg-brand-gold text-brand-navy" :
                  item.badge === "CERTIFICADO" ? "bg-brand-navy text-brand-gold" :
                  item.badge === "OFERTA" ? "bg-red-500 text-white" : "bg-white text-brand-navy"
                }`}>
                  <span className="w-1.5 h-1.5 bg-current rounded-full animate-pulse" />
                  {item.badge}
                </span>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <p className="text-brand-gold text-xs font-bold uppercase tracking-wider">{item.brand}</p>
                  <div className="flex gap-1.5">
                    <span className="bg-brand-cream px-2 py-0.5 rounded text-[10px] font-medium text-brand-navy">{item.capacity}</span>
                    <span className="bg-brand-cream px-2 py-0.5 rounded text-[10px] font-medium text-brand-navy">{item.type}</span>
                  </div>
                </div>
                <h3 className="text-base font-bold text-brand-navy mt-2 leading-tight">{item.name}</h3>
                <ul className="mt-3 space-y-1">
                  {item.features.map((f, j) => (
                    <li key={j} className="text-sm text-brand-muted flex items-center gap-2">
                      <span className="w-1 h-1 bg-brand-gold rounded-full shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href={`https://wa.me/${WA}?text=${encodeURIComponent(`Hola, me interesa el ${item.name} (${item.brand}, ${item.capacity}, ${item.condition}). ¿Me pueden enviar precio y condiciones?`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 w-full bg-brand-navy hover:bg-brand-gold hover:text-brand-navy text-white font-semibold py-2.5 rounded-lg text-sm transition-all flex items-center justify-center gap-2"
                >
                  Consultar precio
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
