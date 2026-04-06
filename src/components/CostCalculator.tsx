"use client";
import { useState } from "react";
import { useInView } from "@/hooks/useInView";

const WA = "584241700600";

type Mode = "compra" | "alquiler" | "leasing";

const equipmentTypes = [
  { label: "Contrabalanceado Electrico", basePrice: 28000, rentalMonth: 1800, leasingMonth: 950 },
  { label: "Contrabalanceado Diesel", basePrice: 22000, rentalMonth: 1500, leasingMonth: 780 },
  { label: "Contrabalanceado GLP", basePrice: 20000, rentalMonth: 1400, leasingMonth: 720 },
  { label: "Apilador Electrico", basePrice: 12000, rentalMonth: 900, leasingMonth: 450 },
  { label: "Transpaleta Electrica", basePrice: 5500, rentalMonth: 450, leasingMonth: 220 },
  { label: "Reach Truck", basePrice: 35000, rentalMonth: 2200, leasingMonth: 1200 },
];

const periods = [
  { label: "6 meses", months: 6 },
  { label: "1 ano", months: 12 },
  { label: "2 anos", months: 24 },
  { label: "3 anos", months: 36 },
  { label: "5 anos", months: 60 },
];

export default function CostCalculator() {
  const [equipIdx, setEquipIdx] = useState(0);
  const [periodIdx, setPeriodIdx] = useState(2);
  const [activeMode, setActiveMode] = useState<Mode | null>(null);
  const { ref, visible } = useInView();

  const equip = equipmentTypes[equipIdx];
  const period = periods[periodIdx];

  const costs = {
    compra: {
      total: equip.basePrice,
      monthly: Math.round(equip.basePrice / period.months),
      includes: ["Equipo 100% tuyo", "Garantia de fabrica", "Soporte tecnico 1 ano", "Valor residual al final"],
    },
    alquiler: {
      total: equip.rentalMonth * period.months,
      monthly: equip.rentalMonth,
      includes: ["Sin inversion inicial", "Mantenimiento incluido", "Reemplazo por averia", "Flexibilidad de devolucion"],
    },
    leasing: {
      total: equip.leasingMonth * period.months,
      monthly: equip.leasingMonth,
      includes: ["Cuota fija mensual", "Opcion de compra al final", "Beneficio fiscal", "Mantenimiento basico incluido"],
    },
  };

  const modes: { key: Mode; label: string; icon: string }[] = [
    { key: "compra", label: "Compra", icon: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" },
    { key: "alquiler", label: "Alquiler", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
    { key: "leasing", label: "Leasing", icon: "M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" },
  ];

  const best = (Object.keys(costs) as Mode[]).reduce((a, b) => costs[a].total < costs[b].total ? a : b);

  const waMsg = `Hola, estoy interesado en ${activeMode || "cotizar"} un ${equip.label} por ${period.label}. El estimado de la calculadora fue $${activeMode ? costs[activeMode].total.toLocaleString() : "---"} total. Me pueden dar una cotizacion formal?`;

  return (
    <section id="calculadora" className="py-20 bg-brand-navy">
      <div ref={ref} className={`max-w-7xl mx-auto px-4 sm:px-6 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <div className="mb-12">
          <div className="rca-tag text-brand-gold font-bold text-sm uppercase tracking-widest mb-3">Herramienta exclusiva</div>
          <h2 className="text-3xl sm:text-4xl font-black text-white">Calculadora: Compra vs Alquiler vs Leasing</h2>
          <p className="text-white/50 mt-3 max-w-xl">Compara costos reales y elige la modalidad que mas le conviene a tu operacion</p>
        </div>

        {/* Selectors */}
        <div className="max-w-3xl mx-auto mb-10 grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-white/60 text-sm mb-2 font-medium">Tipo de equipo</label>
            <select value={equipIdx} onChange={(e) => setEquipIdx(Number(e.target.value))} className="w-full bg-white/[0.06] border border-white/10 text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-gold transition-colors">
              {equipmentTypes.map((eq, i) => (
                <option key={i} value={i} className="bg-brand-navy">{eq.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-white/60 text-sm mb-2 font-medium">Periodo de uso</label>
            <div className="flex gap-2 flex-wrap">
              {periods.map((p, i) => (
                <button key={i} onClick={() => setPeriodIdx(i)} className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${periodIdx === i ? "bg-brand-gold text-brand-navy" : "bg-white/[0.06] text-white/60 hover:bg-white/[0.1]"}`}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Comparison Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {modes.map(({ key, label, icon }) => {
            const c = costs[key];
            const isBest = key === best;
            const isActive = activeMode === key;
            return (
              <button
                key={key}
                onClick={() => setActiveMode(key)}
                className={`relative text-left rounded-2xl p-7 transition-all ${
                  isActive
                    ? "bg-brand-gold text-brand-navy ring-2 ring-brand-gold scale-[1.03]"
                    : isBest
                    ? "bg-white/[0.08] text-white border-2 border-brand-gold/50 hover:border-brand-gold"
                    : "bg-white/[0.04] text-white border border-white/10 hover:border-white/30"
                }`}
              >
                {isBest && !isActive && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-gold text-brand-navy text-xs font-bold px-3 py-1 rounded-full">MAS ECONOMICO</span>
                )}
                <div className="flex items-center gap-3 mb-5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isActive ? "bg-brand-navy/20" : "bg-brand-gold/10"}`}>
                    <svg className={`w-5 h-5 ${isActive ? "text-brand-navy" : "text-brand-gold"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} /></svg>
                  </div>
                  <h3 className="text-xl font-bold">{label}</h3>
                </div>

                <div className="mb-1">
                  <span className={`text-xs font-medium ${isActive ? "text-brand-navy/60" : "text-white/40"}`}>Costo mensual estimado</span>
                  <p className="text-3xl font-black">${c.monthly.toLocaleString()}<span className={`text-sm font-medium ${isActive ? "text-brand-navy/60" : "text-white/40"}`}>/mes</span></p>
                </div>
                <p className={`text-sm mb-5 ${isActive ? "text-brand-navy/70" : "text-white/40"}`}>Total en {period.label}: <span className="font-bold">${c.total.toLocaleString()}</span></p>

                <ul className="space-y-2">
                  {c.includes.map((item, j) => (
                    <li key={j} className={`flex items-center gap-2 text-sm ${isActive ? "text-brand-navy/80" : "text-white/60"}`}>
                      <svg className={`w-4 h-4 shrink-0 ${isActive ? "text-brand-navy" : "text-brand-gold"}`} fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" /></svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <p className="text-white/40 text-xs mb-4">* Precios referenciales en USD. La cotizacion final depende de especificaciones, disponibilidad y condiciones comerciales.</p>
          <a
            href={`https://wa.me/${WA}?text=${encodeURIComponent(waMsg)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-brand-gold hover:bg-brand-gold-light text-brand-navy font-bold px-8 py-4 rounded-xl text-base transition-all"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /></svg>
            Solicitar cotizacion formal
          </a>
        </div>
      </div>
    </section>
  );
}
