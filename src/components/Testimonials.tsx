"use client";
import { useState, useEffect } from "react";
import { useInView } from "@/hooks/useInView";

const testimonials = [
  {
    quote: "Grupo RCA nos resolvio una emergencia operativa en menos de 48 horas. Su respuesta y profesionalismo son de otro nivel.",
    name: "Carlos Mendez",
    role: "Gerente de Operaciones",
    company: "Sector Alimentos",
    initials: "CM",
  },
  {
    quote: "Llevamos mas de 10 anos trabajando con ellos. Los montacargas Megalift de litio nos ahorraron un 40% en costos operativos.",
    name: "Maria Rodriguez",
    role: "Directora de Logistica",
    company: "Sector Farmaceutico",
    initials: "MR",
  },
  {
    quote: "El servicio tecnico es impecable. Tienen repuestos para todo y sus tecnicos conocen cada modelo a fondo.",
    name: "Jose Hernandez",
    role: "Jefe de Mantenimiento",
    company: "Sector Manufactura",
    initials: "JH",
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const { ref, visible } = useInView();

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % testimonials.length), 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-20 bg-white">
      <div ref={ref} className={`max-w-7xl mx-auto px-4 sm:px-6 transition-all duration-700 ${visible ? "opacity-100" : "opacity-0"}`}>
        <div className="grid lg:grid-cols-5 gap-12 items-center">
          {/* Left label */}
          <div className="lg:col-span-2">
            <div className="rca-tag text-brand-gold font-bold text-sm uppercase tracking-widest mb-4">
              Testimonios
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-brand-navy leading-tight">
              Lo que dicen nuestros clientes
            </h2>
            <p className="text-brand-muted mt-3">Mas de 200 empresas confian en nosotros para mantener sus operaciones funcionando.</p>

            {/* Navigation dots — vertical for RCA */}
            <div className="flex lg:flex-col gap-3 mt-8">
              {testimonials.map((t, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`flex items-center gap-3 text-left transition-all ${i === current ? "opacity-100" : "opacity-40 hover:opacity-70"}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
                    i === current ? "bg-brand-gold text-brand-navy" : "bg-gray-100 text-brand-navy"
                  }`}>
                    {t.initials}
                  </div>
                  <div className="hidden lg:block">
                    <p className="text-sm font-semibold text-brand-navy">{t.name}</p>
                    <p className="text-xs text-brand-muted">{t.company}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right — testimonial card */}
          <div className="lg:col-span-3">
            <div className="relative bg-brand-cream rounded-2xl p-8 sm:p-10 border border-gray-100 min-h-[260px]">
              {/* Gold accent top border */}
              <div className="absolute top-0 left-8 right-8 h-1 bg-brand-gold rounded-b-full" />

              {/* Large quote mark */}
              <svg className="w-16 h-16 text-brand-gold/10 mb-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10H0z" />
              </svg>

              {testimonials.map((t, i) => (
                <div key={i} className={`transition-all duration-500 ${i === current ? "opacity-100" : "opacity-0 absolute inset-0 pointer-events-none"}`}>
                  {i === current && (
                    <>
                      <p className="text-brand-navy text-lg sm:text-xl leading-relaxed font-medium mb-8">&ldquo;{t.quote}&rdquo;</p>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-brand-navy rounded-full flex items-center justify-center text-brand-gold font-bold">
                          {t.initials}
                        </div>
                        <div>
                          <p className="font-bold text-brand-navy">{t.name}</p>
                          <p className="text-brand-muted text-sm">{t.role} — <span className="text-brand-gold font-semibold">{t.company}</span></p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
