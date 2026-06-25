import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-brand-navy text-white relative overflow-hidden">
      {/* Industrial pattern */}
      <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(191,179,4,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(191,179,4,0.02) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top section — with gold accent bar */}
        <div className="h-1 bg-brand-gold rounded-b-full mx-auto w-24 mb-0" />

        <div className="py-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Image src="/logo-gruporca-full.png" alt="Grupo RCA" width={160} height={60} className="h-10 w-auto mb-4" />
            <p className="text-white/35 text-sm leading-relaxed">Soluciones logísticas integrales desde 1990. Venta, alquiler y servicio técnico de montacargas en América Latina.</p>
            <p className="text-white/15 text-xs mt-3">RIF: J-29825618-5</p>
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-white flex items-center gap-2">
              <span className="w-4 h-0.5 bg-brand-gold" />
              Equipos
            </h4>
            <ul className="space-y-2 text-white/40 text-sm">
              {["Montacargas Eléctricos", "Montacargas Diésel", "Apiladores", "Transpaletas", "Pasillo Angosto", "Equipos Usados"].map((l) => (
                <li key={l}><a href="#equipos" className="hover:text-brand-gold transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-white flex items-center gap-2">
              <span className="w-4 h-0.5 bg-brand-gold" />
              Servicios
            </h4>
            <ul className="space-y-2 text-white/40 text-sm">
              {["Venta de Equipos", "Alquiler", "Servicio Técnico", "Repuestos", "Capacitación", "Consultoría"].map((l) => {
                const isParts = l === "Repuestos";
                return (
                  <li key={l}>
                    <a
                      href={isParts ? "https://upandina.com/" : "#servicios"}
                      target={isParts ? "_blank" : undefined}
                      rel={isParts ? "noopener noreferrer" : undefined}
                      className="hover:text-brand-gold transition-colors"
                    >
                      {l}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-white flex items-center gap-2">
              <span className="w-4 h-0.5 bg-brand-gold" />
              Contacto
            </h4>
            <ul className="space-y-3 text-white/40 text-sm">
              <li>
                <a href="https://maps.app.goo.gl/ctTmyHSGDZmWL3t9A" target="_blank" rel="noopener noreferrer" className="flex items-start gap-2 hover:text-brand-gold transition-colors">
                  <svg className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>
                  Valencia, Carabobo, Venezuela
                </a>
              </li>
              <li>
                <a href="tel:+582414120080" className="flex items-center gap-2 hover:text-brand-gold transition-colors">
                  <svg className="w-4 h-4 text-brand-gold shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                  0241-412.00.80
                </a>
              </li>
              <li>
                <a href="mailto:info@gruporca.com" className="flex items-center gap-2 hover:text-brand-gold transition-colors">
                  <svg className="w-4 h-4 text-brand-gold shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                  info@gruporca.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-brand-gold shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
                Lun - Vie: 7:30 AM - 4:30 PM
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 pb-28 sm:pb-24 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-white/20 text-xs">
            &copy; {new Date().getFullYear()} Grupo RCA Montacargas C.A. Todos los derechos reservados.
            <span className="mx-2 text-white/10">|</span>
            <a href="/admin" className="text-white/30 hover:text-brand-gold transition-colors">Acceso colaboradores</a>
          </p>
          <div className="flex gap-3">
            {[
              { label: "Instagram", href: "https://instagram.com/rcagrupo", icon: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" },
              { label: "Facebook", href: "https://www.facebook.com/rcagrupo", icon: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
              { label: "LinkedIn", href: "https://ve.linkedin.com/company/gruporcave", icon: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" },
              { label: "TikTok", href: "https://tiktok.com/@rcagrupo", icon: "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" },
            ].map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white/[0.06] hover:bg-brand-gold/20 flex items-center justify-center text-white/30 hover:text-brand-gold transition-all" aria-label={s.label}>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d={s.icon} /></svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
