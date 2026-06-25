"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

const WA = "584244013250";
const UNIPARTS = "https://upandina.com/";

const navLinks = [
  { label: "Inicio", href: "#hero" },
  { label: "Equipos", href: "#equipos" },
  { label: "Servicios", href: "#servicios" },
  { label: "Herramientas", href: "#tco" },
  { label: "Repuestos", href: UNIPARTS },
  { label: "Blog", href: "#blog" },
  { label: "Contacto", href: "#contacto" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Top bar — unique to RCA (industrial info bar) */}
      <div className={`fixed top-0 left-0 right-0 z-50 bg-brand-navy text-white/60 text-xs transition-all duration-300 ${scrolled ? "h-0 overflow-hidden opacity-0" : "h-9"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
              0241-412.00.80
            </span>
            <span className="hidden sm:flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
              info@gruporca.com
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden md:inline">Lun-Vie: 7:30 AM - 4:30 PM</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header
        className={`fixed left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "top-0 bg-white shadow-md shadow-brand-navy/5 py-2"
            : "top-9 bg-white/95 backdrop-blur-sm py-3"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <a href="#hero" className="flex items-center gap-2 shrink-0">
            <Image
              src="/logo-gruporca-full.png"
              alt="Grupo RCA"
              width={160}
              height={50}
              className="h-9 w-auto"
              priority
            />
          </a>

          {/* Desktop Nav — with gold bottom border indicator */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target={l.href.startsWith("http") ? "_blank" : undefined}
                rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="rca-link text-brand-navy/70 hover:text-brand-navy px-3 py-2 text-sm font-medium transition-colors"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <a
              href={`https://wa.me/${WA}?text=${encodeURIComponent("Hola, necesito información sobre sus equipos")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-brand-gold hover:bg-brand-gold-light text-brand-navy font-bold px-5 py-2.5 rounded-lg text-sm transition-all animate-pulse-glow"
            >
              Cotizar Ahora
            </a>
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden text-brand-navy p-2" aria-label="Menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu — slide from right (different from Uniparts dropdown) */}
        <div className={`lg:hidden fixed inset-0 top-0 z-50 transition-all duration-300 ${menuOpen ? "visible" : "invisible"}`}>
          <div className={`absolute inset-0 bg-black/30 transition-opacity ${menuOpen ? "opacity-100" : "opacity-0"}`} onClick={() => setMenuOpen(false)} />
          <div className={`absolute top-0 right-0 h-full w-72 bg-white shadow-2xl transition-transform ${menuOpen ? "translate-x-0" : "translate-x-full"}`}>
            <div className="p-6">
              <button onClick={() => setMenuOpen(false)} className="absolute top-4 right-4 text-brand-navy/60">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <div className="mt-8 space-y-1">
                {navLinks.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    target={l.href.startsWith("http") ? "_blank" : undefined}
                    rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    onClick={() => setMenuOpen(false)}
                    className="block text-brand-navy hover:text-brand-gold py-3 text-base font-medium border-b border-gray-100 transition-colors"
                  >
                    {l.label}
                  </a>
                ))}
              </div>
              <a
                href={`https://wa.me/${WA}?text=${encodeURIComponent("Hola, necesito información")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-brand-gold text-brand-navy text-center font-bold px-5 py-3.5 rounded-lg text-sm mt-6"
              >
                Cotizar Ahora
              </a>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
