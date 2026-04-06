"use client";
import { useState } from "react";
import { useInView } from "@/hooks/useInView";

const WA = "584241700600";

const allEquipment = [
  { id: 1, name: "Contrabalanceado Litio 2.5T", brand: "Megalift", capacity: "2,500 kg", liftHeight: "4.5 m", engine: "Electrico Litio", weight: "3,800 kg", speed: "17 km/h", forkLength: "1,070 mm", turnRadius: "2,100 mm", condition: "Nuevo", image: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&w=400&q=80" },
  { id: 2, name: "Montacargas Diesel 5T", brand: "Mitsubishi", capacity: "5,000 kg", liftHeight: "6.0 m", engine: "Diesel", weight: "5,200 kg", speed: "22 km/h", forkLength: "1,220 mm", turnRadius: "2,800 mm", condition: "Usado", image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80" },
  { id: 3, name: "Apilador Electrico 1.6T", brand: "Megalift", capacity: "1,600 kg", liftHeight: "5.5 m", engine: "Electrico", weight: "1,900 kg", speed: "8 km/h", forkLength: "1,150 mm", turnRadius: "1,600 mm", condition: "Nuevo", image: "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=400&q=80" },
  { id: 4, name: "Contrabalanceado GLP 3T", brand: "Doosan", capacity: "3,000 kg", liftHeight: "5.0 m", engine: "GLP / Dual", weight: "4,100 kg", speed: "20 km/h", forkLength: "1,070 mm", turnRadius: "2,300 mm", condition: "Usado", image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=400&q=80" },
  { id: 5, name: "Transpaleta Electrica 2T", brand: "Megalift", capacity: "2,000 kg", liftHeight: "0.2 m", engine: "Electrica", weight: "800 kg", speed: "6 km/h", forkLength: "1,150 mm", turnRadius: "1,400 mm", condition: "Nuevo", image: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=400&q=80" },
  { id: 6, name: "Reach Truck 1.5T", brand: "Narrow Aisle", capacity: "1,500 kg", liftHeight: "10.0 m", engine: "Electrico", weight: "2,600 kg", speed: "12 km/h", forkLength: "1,070 mm", turnRadius: "1,700 mm", condition: "Nuevo", image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&q=80" },
];

const specs: { key: keyof typeof allEquipment[0]; label: string }[] = [
  { key: "brand", label: "Marca" },
  { key: "capacity", label: "Capacidad" },
  { key: "liftHeight", label: "Altura de elevacion" },
  { key: "engine", label: "Motor / Tipo" },
  { key: "weight", label: "Peso operativo" },
  { key: "speed", label: "Velocidad max." },
  { key: "forkLength", label: "Largo de horquillas" },
  { key: "turnRadius", label: "Radio de giro" },
  { key: "condition", label: "Condicion" },
];

export default function EquipmentCompare() {
  const [selected, setSelected] = useState<number[]>([]);
  const [showTable, setShowTable] = useState(false);
  const { ref, visible } = useInView();

  const toggle = (id: number) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((s) => s !== id));
    } else if (selected.length < 3) {
      setSelected([...selected, id]);
    }
  };

  const compared = allEquipment.filter((e) => selected.includes(e.id));

  const waMsg = `Hola, estoy comparando estos equipos y me gustaria recibir cotizacion:\n${compared.map((e) => `- ${e.name} (${e.brand})`).join("\n")}`;

  return (
    <section id="comparador" className="py-20 bg-brand-cream rca-blueprint">
      <div ref={ref} className={`max-w-7xl mx-auto px-4 sm:px-6 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <div className="mb-10">
          <div className="rca-tag text-brand-gold font-bold text-sm uppercase tracking-widest mb-3">Herramienta de comparacion</div>
          <h2 className="text-3xl sm:text-4xl font-black text-brand-navy">Compara equipos lado a lado</h2>
          <p className="text-brand-muted mt-3 max-w-lg">Selecciona hasta 3 equipos para comparar sus especificaciones tecnicas</p>
        </div>

        {/* Equipment selector */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {allEquipment.map((e) => {
            const isSelected = selected.includes(e.id);
            return (
              <button
                key={e.id}
                onClick={() => toggle(e.id)}
                className={`relative rounded-xl border-2 p-3 text-left transition-all ${
                  isSelected ? "border-brand-gold bg-brand-gold/5 shadow-md" : "border-gray-200 bg-white hover:border-brand-gold/40"
                } ${!isSelected && selected.length >= 3 ? "opacity-40 cursor-not-allowed" : ""}`}
                disabled={!isSelected && selected.length >= 3}
              >
                {isSelected && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-brand-gold rounded-full flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-brand-navy" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" /></svg>
                  </div>
                )}
                <div className="h-20 bg-gray-100 rounded-lg overflow-hidden mb-2">
                  <img src={e.image} alt={e.name} className="w-full h-full object-cover" />
                </div>
                <p className="text-xs font-bold text-brand-navy leading-tight">{e.name}</p>
                <p className="text-[10px] text-brand-muted">{e.brand}</p>
              </button>
            );
          })}
        </div>

        {/* Compare button */}
        {selected.length >= 2 && (
          <div className="text-center mb-8">
            <button onClick={() => setShowTable(!showTable)} className="bg-brand-navy text-brand-gold font-bold px-8 py-3.5 rounded-xl text-sm hover:bg-brand-navy-light transition-all inline-flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              {showTable ? "Ocultar comparacion" : `Comparar ${selected.length} equipos`}
            </button>
          </div>
        )}

        {/* Comparison Table */}
        {showTable && compared.length >= 2 && (
          <div className="rca-card bg-white rounded-2xl border border-gray-100 overflow-x-auto shadow-lg">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="p-4 text-left text-sm font-bold text-brand-navy w-44">Especificacion</th>
                  {compared.map((e) => (
                    <th key={e.id} className="p-4 text-center">
                      <div className="h-24 w-24 mx-auto bg-gray-100 rounded-xl overflow-hidden mb-2">
                        <img src={e.image} alt={e.name} className="w-full h-full object-cover" />
                      </div>
                      <p className="text-sm font-bold text-brand-navy">{e.name}</p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {specs.map((spec, i) => (
                  <tr key={spec.key} className={i % 2 === 0 ? "bg-gray-50/50" : ""}>
                    <td className="p-4 text-sm font-medium text-brand-muted">{spec.label}</td>
                    {compared.map((e) => (
                      <td key={e.id} className="p-4 text-center text-sm font-semibold text-brand-navy">
                        {String(e[spec.key])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="p-4 border-t border-gray-100 text-center">
              <a
                href={`https://wa.me/${WA}?text=${encodeURIComponent(waMsg)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-brand-gold hover:bg-brand-gold-light text-brand-navy font-bold px-6 py-3 rounded-xl text-sm transition-all"
              >
                Cotizar estos equipos
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </a>
            </div>
          </div>
        )}

        {selected.length === 0 && (
          <p className="text-center text-brand-muted text-sm">Selecciona al menos 2 equipos para compararlos</p>
        )}
        {selected.length === 1 && (
          <p className="text-center text-brand-muted text-sm">Selecciona 1 equipo mas para iniciar la comparacion</p>
        )}
      </div>
    </section>
  );
}
