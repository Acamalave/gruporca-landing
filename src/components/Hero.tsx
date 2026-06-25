"use client";
import { useCountUp } from "@/hooks/useCountUp";

const WA = "584244013250";

export default function Hero() {
  const yearsCount = useCountUp(36, 2000, true);
  const countriesCount = useCountUp(6, 2000, true);

  return (
    <section id="hero" className="relative min-h-screen bg-brand-cream overflow-hidden">
      {/* Blueprint grid background */}
      <div className="absolute inset-0 rca-blueprint" />

      {/* Gold accent corner */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold/5 rounded-bl-[120px]" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-navy/5 rounded-tr-[80px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-16 lg:pt-36 lg:pb-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Content */}
          <div className="animate-slide-in-left">
            {/* Tag with horizontal line */}
            <div className="rca-tag text-brand-gold font-bold text-sm uppercase tracking-widest mb-6">
              Desde 1990
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-brand-navy leading-[1.08] mb-6 tracking-tight">
              La flota que mueve
              <span className="block text-gold-gradient mt-1">toda Latinoamérica</span>
            </h1>

            <p className="text-lg text-brand-muted leading-relaxed mb-8 max-w-lg">
              Venta, alquiler y servicio técnico de montacargas nuevos y usados.
              Distribuidor autorizado Megalift con presencia en 6 países.
            </p>

            {/* Stats row — unique horizontal counters */}
            <div className="flex gap-8 mb-10">
              <div className="border-l-4 border-brand-gold pl-4">
                <p className="rca-stat text-brand-navy">{yearsCount}+</p>
                <p className="text-brand-muted text-sm font-medium">Años de experiencia</p>
              </div>
              <div className="border-l-4 border-brand-navy pl-4">
                <p className="rca-stat text-brand-navy">{countriesCount}</p>
                <p className="text-brand-muted text-sm font-medium">Países en LATAM</p>
              </div>
            </div>

            {/* CTAs — stacked differently */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="#equipos"
                className="bg-brand-navy hover:bg-brand-navy-light text-white font-bold px-8 py-4 rounded-lg text-base transition-all inline-flex items-center justify-center gap-3"
              >
                Explorar inventario
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </a>
              <a
                href={`https://wa.me/${WA}?text=${encodeURIComponent("Hola, necesito asesoría para mi operación logística")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-brand-navy/20 hover:border-brand-gold text-brand-navy font-semibold px-8 py-4 rounded-lg text-base transition-all inline-flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /></svg>
                Hablar con asesor
              </a>
            </div>

            {/* Brand marquee */}
            <div className="mt-12">
              <p className="text-brand-muted/50 text-xs uppercase tracking-widest mb-3">Marcas que distribuimos</p>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-brand-navy/30 font-black text-base sm:text-lg uppercase tracking-wider">
                {["Megalift", "Mitsubishi", "Doosan", "Bobcat", "Clark"].map((b) => (
                  <span key={b} className="whitespace-nowrap">{b}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Image composition */}
          <div className="relative animate-slide-in-right">
            {/* Main image — with unique geometric frame */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-brand-navy/20">
              <div className="aspect-[4/3] bg-gray-200">
                <img
                  src="/img/company/local-gruporca.png"
                  alt="Local de Grupo RCA - Distribuidor Megalift"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Overlay badge */}
              <div className="absolute bottom-4 left-4 bg-brand-navy/90 backdrop-blur-sm text-white px-5 py-3 rounded-xl">
                <p className="text-xs text-brand-gold font-bold uppercase tracking-wider">Distribuidor autorizado</p>
                <p className="text-sm font-semibold mt-0.5">Megalift</p>
              </div>
            </div>

            {/* Floating stat card — top right */}
            <div className="absolute -top-4 -right-4 bg-brand-gold text-brand-navy p-5 rounded-xl shadow-lg hidden lg:block">
              <p className="text-3xl font-black">200+</p>
              <p className="text-xs font-bold uppercase tracking-wider">Clientes activos</p>
            </div>

            {/* Gold decorative corner */}
            <div className="absolute -top-6 -left-6 w-24 h-24 border-l-4 border-t-4 border-brand-gold rounded-tl-xl hidden lg:block" />
          </div>
        </div>
      </div>

      {/* Bottom wave separator (unique to RCA) */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 60V20C240 0 480 40 720 30C960 20 1200 0 1440 20V60H0Z" fill="#ffffff" />
        </svg>
      </div>
    </section>
  );
}
