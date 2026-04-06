"use client";
import { useState, useMemo } from "react";
import { useInView } from "@/hooks/useInView";

const WA = "584241700600";

const cities = [
  { name: "Valencia (Local)", distance: 0, baseRate: 150 },
  { name: "Maracay", distance: 85, baseRate: 350 },
  { name: "Caracas", distance: 150, baseRate: 550 },
  { name: "Barquisimeto", distance: 175, baseRate: 600 },
  { name: "Maracaibo", distance: 530, baseRate: 1400 },
  { name: "Puerto La Cruz / Barcelona", distance: 450, baseRate: 1200 },
  { name: "Ciudad Guayana", distance: 680, baseRate: 1800 },
  { name: "Merida", distance: 450, baseRate: 1300 },
  { name: "San Cristobal", distance: 550, baseRate: 1500 },
  { name: "Margarita (+ ferry)", distance: 500, baseRate: 2200 },
  { name: "Bogota, Colombia", distance: 1500, baseRate: 3500 },
  { name: "Panama City, Panama", distance: 2800, baseRate: 5500 },
];

const equipmentSizes = [
  { label: "Transpaleta / Equipo pequeno", weightMultiplier: 0.6, weight: "500 - 1,200 kg" },
  { label: "Apilador electrico", weightMultiplier: 0.8, weight: "1,200 - 2,500 kg" },
  { label: "Montacargas < 3T", weightMultiplier: 1.0, weight: "2,500 - 4,500 kg" },
  { label: "Montacargas 3-5T", weightMultiplier: 1.3, weight: "4,500 - 6,000 kg" },
  { label: "Montacargas > 5T", weightMultiplier: 1.6, weight: "6,000+ kg" },
];

export default function FreightEstimator() {
  const [cityIdx, setCityIdx] = useState(2);
  const [sizeIdx, setSizeIdx] = useState(2);
  const [quantity, setQuantity] = useState(1);
  const { ref, visible } = useInView();

  const estimate = useMemo(() => {
    const city = cities[cityIdx];
    const size = equipmentSizes[sizeIdx];
    const base = city.baseRate * size.weightMultiplier;
    const multi = quantity > 1 ? 0.85 : 1; // 15% discount for 2+
    const total = Math.round(base * quantity * multi);
    return {
      city: city.name,
      distance: city.distance,
      perUnit: Math.round(base),
      total,
      discount: quantity > 1,
      size: size.label,
      weight: size.weight,
    };
  }, [cityIdx, sizeIdx, quantity]);

  const waMsg = `Hola, necesito un estimado de flete:\n- Destino: ${estimate.city}\n- Equipo: ${estimate.size} (${estimate.weight})\n- Cantidad: ${quantity}\n- Estimado web: $${estimate.total.toLocaleString()}\nMe pueden confirmar precio y disponibilidad?`;

  return (
    <section id="flete" className="py-20 bg-white rca-stripe">
      <div ref={ref} className={`max-w-7xl mx-auto px-4 sm:px-6 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <div className="mb-12">
          <div className="rca-tag text-brand-gold font-bold text-sm uppercase tracking-widest mb-3">Planifica tu envio</div>
          <h2 className="text-3xl sm:text-4xl font-black text-brand-navy">Estimador de flete</h2>
          <p className="text-brand-muted mt-3 max-w-lg">Calcula el costo aproximado de envio de tu equipo a cualquier destino</p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            {/* Destination */}
            <div>
              <label className="block text-sm font-medium text-brand-navy mb-2">Destino</label>
              <select value={cityIdx} onChange={(e) => setCityIdx(Number(e.target.value))} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none text-sm transition-all bg-white">
                {cities.map((c, i) => (
                  <option key={i} value={i}>{c.name} {c.distance > 0 ? `(~${c.distance} km)` : ""}</option>
                ))}
              </select>
            </div>

            {/* Equipment size */}
            <div>
              <label className="block text-sm font-medium text-brand-navy mb-2">Tipo de equipo</label>
              <select value={sizeIdx} onChange={(e) => setSizeIdx(Number(e.target.value))} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none text-sm transition-all bg-white">
                {equipmentSizes.map((s, i) => (
                  <option key={i} value={i}>{s.label} — {s.weight}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-8">
            <label className="flex justify-between text-sm font-medium text-brand-navy mb-2">
              <span>Cantidad de equipos</span>
              <span className="text-brand-gold font-bold">{quantity} {quantity === 1 ? "equipo" : "equipos"}</span>
            </label>
            <input type="range" min={1} max={10} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="w-full accent-brand-gold" />
            <div className="flex justify-between text-xs text-brand-muted mt-1"><span>1</span><span>10</span></div>
          </div>

          {/* Result */}
          <div className="bg-brand-navy rounded-2xl p-6 sm:p-8">
            <div className="grid sm:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-white/40 text-xs mb-1">Destino</p>
                <p className="text-white font-bold">{estimate.city}</p>
                {estimate.distance > 0 && <p className="text-white/40 text-xs mt-0.5">~{estimate.distance} km desde Valencia</p>}
              </div>
              <div>
                <p className="text-white/40 text-xs mb-1">Costo por unidad</p>
                <p className="text-white font-bold text-2xl">${estimate.perUnit.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-white/40 text-xs mb-1">Total estimado</p>
                <p className="text-brand-gold font-black text-3xl">${estimate.total.toLocaleString()}</p>
                {estimate.discount && <p className="text-green-400 text-xs mt-0.5">15% descuento por volumen aplicado</p>}
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-white/30 text-xs">* Precio referencial. Sujeto a confirmacion segun peso exacto y condiciones de ruta.</p>
              <a
                href={`https://wa.me/${WA}?text=${encodeURIComponent(waMsg)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 bg-brand-gold hover:bg-brand-gold-light text-brand-navy font-bold px-6 py-3 rounded-xl text-sm transition-all inline-flex items-center gap-2"
              >
                Confirmar flete
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
