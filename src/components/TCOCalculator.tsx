"use client";
import { useState, useMemo } from "react";
import { useInView } from "@/hooks/useInView";

const WA = "584241700600";

type FuelType = "electrico" | "diesel" | "glp";

const fuelData: Record<FuelType, { label: string; costPerHour: number; maintenanceMultiplier: number }> = {
  electrico: { label: "Electrico / Litio", costPerHour: 0.85, maintenanceMultiplier: 0.7 },
  diesel: { label: "Diesel", costPerHour: 2.40, maintenanceMultiplier: 1.0 },
  glp: { label: "GLP", costPerHour: 1.80, maintenanceMultiplier: 0.9 },
};

export default function TCOCalculator() {
  const [purchasePrice, setPurchasePrice] = useState(25000);
  const [fuel, setFuel] = useState<FuelType>("diesel");
  const [hoursPerDay, setHoursPerDay] = useState(8);
  const [daysPerMonth, setDaysPerMonth] = useState(22);
  const [years, setYears] = useState(5);
  const { ref, visible } = useInView();

  const tco = useMemo(() => {
    const fd = fuelData[fuel];
    const totalMonths = years * 12;
    const monthlyHours = hoursPerDay * daysPerMonth;
    const totalHours = monthlyHours * totalMonths;

    const energyCost = totalHours * fd.costPerHour;
    const maintenanceCost = purchasePrice * 0.08 * years * fd.maintenanceMultiplier;
    const insuranceCost = purchasePrice * 0.02 * years;
    const depreciationRate = fuel === "electrico" ? 0.12 : 0.15;
    const residualValue = purchasePrice * Math.pow(1 - depreciationRate, years);
    const depreciation = purchasePrice - residualValue;

    const total = purchasePrice + energyCost + maintenanceCost + insuranceCost;
    const costPerHour = total / totalHours;

    return {
      purchasePrice,
      energyCost: Math.round(energyCost),
      maintenanceCost: Math.round(maintenanceCost),
      insuranceCost: Math.round(insuranceCost),
      depreciation: Math.round(depreciation),
      residualValue: Math.round(residualValue),
      total: Math.round(total),
      costPerHour: costPerHour.toFixed(2),
      monthlyAvg: Math.round(total / totalMonths),
    };
  }, [purchasePrice, fuel, hoursPerDay, daysPerMonth, years]);

  const breakdown = [
    { label: "Precio de compra", value: tco.purchasePrice, color: "bg-brand-gold", pct: (tco.purchasePrice / tco.total) * 100 },
    { label: "Energia / Combustible", value: tco.energyCost, color: "bg-blue-500", pct: (tco.energyCost / tco.total) * 100 },
    { label: "Mantenimiento", value: tco.maintenanceCost, color: "bg-orange-500", pct: (tco.maintenanceCost / tco.total) * 100 },
    { label: "Seguro", value: tco.insuranceCost, color: "bg-purple-500", pct: (tco.insuranceCost / tco.total) * 100 },
  ];

  const waMsg = `Hola, use la calculadora TCO y quiero validar estos numeros:\n- Equipo: ${fuelData[fuel].label}\n- Precio: $${purchasePrice.toLocaleString()}\n- Uso: ${hoursPerDay}h/dia, ${daysPerMonth}d/mes, ${years} anos\n- TCO estimado: $${tco.total.toLocaleString()}\n- Costo/hora: $${tco.costPerHour}\nMe pueden asesorar?`;

  return (
    <section id="tco" className="py-20 bg-white rca-stripe">
      <div ref={ref} className={`max-w-7xl mx-auto px-4 sm:px-6 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <div className="mb-12">
          <div className="rca-tag text-brand-gold font-bold text-sm uppercase tracking-widest mb-3">Para directores de planta</div>
          <h2 className="text-3xl sm:text-4xl font-black text-brand-navy">Calculadora de Costo Total (TCO)</h2>
          <p className="text-brand-muted mt-3 max-w-xl">Calcula cuanto realmente cuesta operar tu montacargas: compra + energia + mantenimiento + seguro</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Inputs */}
          <div className="space-y-6 bg-brand-cream rounded-2xl p-6 sm:p-8">
            <div>
              <label className="flex justify-between text-sm font-medium text-brand-navy mb-2">
                <span>Precio de compra (USD)</span>
                <span className="text-brand-gold font-bold">${purchasePrice.toLocaleString()}</span>
              </label>
              <input type="range" min={5000} max={80000} step={500} value={purchasePrice} onChange={(e) => setPurchasePrice(Number(e.target.value))} className="w-full accent-brand-gold" />
              <div className="flex justify-between text-xs text-brand-muted mt-1"><span>$5,000</span><span>$80,000</span></div>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-navy mb-2">Tipo de motor</label>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(fuelData) as FuelType[]).map((f) => (
                  <button key={f} onClick={() => setFuel(f)} className={`px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${fuel === f ? "bg-brand-navy text-brand-gold" : "bg-white border border-gray-200 text-brand-navy hover:border-brand-gold/40"}`}>
                    {fuelData[f].label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex justify-between text-sm font-medium text-brand-navy mb-2">
                  <span>Horas/dia</span><span className="text-brand-gold font-bold">{hoursPerDay}h</span>
                </label>
                <input type="range" min={2} max={24} value={hoursPerDay} onChange={(e) => setHoursPerDay(Number(e.target.value))} className="w-full accent-brand-gold" />
              </div>
              <div>
                <label className="flex justify-between text-sm font-medium text-brand-navy mb-2">
                  <span>Dias/mes</span><span className="text-brand-gold font-bold">{daysPerMonth}d</span>
                </label>
                <input type="range" min={5} max={30} value={daysPerMonth} onChange={(e) => setDaysPerMonth(Number(e.target.value))} className="w-full accent-brand-gold" />
              </div>
            </div>

            <div>
              <label className="flex justify-between text-sm font-medium text-brand-navy mb-2">
                <span>Anos de uso</span><span className="text-brand-gold font-bold">{years} anos</span>
              </label>
              <input type="range" min={1} max={10} value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full accent-brand-gold" />
            </div>
          </div>

          {/* Results */}
          <div>
            <div className="bg-brand-navy rounded-2xl p-6 sm:p-8 mb-6">
              <h3 className="text-white/60 text-sm font-medium mb-1">Costo Total de Propiedad ({years} anos)</h3>
              <p className="text-4xl font-black text-brand-gold">${tco.total.toLocaleString()}</p>
              <div className="grid grid-cols-2 gap-4 mt-5">
                <div className="bg-white/[0.06] rounded-xl p-4">
                  <p className="text-white/40 text-xs">Costo por hora</p>
                  <p className="text-white text-xl font-bold">${tco.costPerHour}</p>
                </div>
                <div className="bg-white/[0.06] rounded-xl p-4">
                  <p className="text-white/40 text-xs">Promedio mensual</p>
                  <p className="text-white text-xl font-bold">${tco.monthlyAvg.toLocaleString()}</p>
                </div>
              </div>
              <div className="mt-5 bg-white/[0.06] rounded-xl p-4">
                <p className="text-white/40 text-xs mb-1">Valor residual estimado al ano {years}</p>
                <p className="text-green-400 text-lg font-bold">${tco.residualValue.toLocaleString()}</p>
              </div>
            </div>

            {/* Breakdown bar */}
            <div className="bg-brand-cream rounded-2xl p-6">
              <h4 className="font-bold text-brand-navy text-sm mb-4">Desglose de costos</h4>
              <div className="h-6 rounded-full overflow-hidden flex mb-4">
                {breakdown.map((b, i) => (
                  <div key={i} className={`${b.color} h-full transition-all`} style={{ width: `${b.pct}%` }} title={`${b.label}: $${b.value.toLocaleString()}`} />
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                {breakdown.map((b, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${b.color}`} />
                    <div>
                      <p className="text-xs text-brand-muted">{b.label}</p>
                      <p className="text-sm font-bold text-brand-navy">${b.value.toLocaleString()} <span className="text-brand-muted font-normal">({b.pct.toFixed(0)}%)</span></p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <a
              href={`https://wa.me/${WA}?text=${encodeURIComponent(waMsg)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 w-full bg-brand-gold hover:bg-brand-gold-light text-brand-navy font-bold py-4 rounded-xl text-sm transition-all flex items-center justify-center gap-2"
            >
              Validar con un asesor
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
