"use client";
import { useEffect, useState } from "react";

export default function PrivacyNotice() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(!localStorage.getItem("rca_privacy_ok"));
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-[70] bg-brand-navy/95 backdrop-blur-sm border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
        <p className="text-white/70 text-xs leading-relaxed flex-1">
          Usamos datos de tu navegación para mejorar tu experiencia y brindarte una mejor atención.
          Al continuar navegando, aceptas su uso.
        </p>
        <button
          onClick={() => {
            localStorage.setItem("rca_privacy_ok", "1");
            setShow(false);
          }}
          className="shrink-0 bg-brand-gold hover:bg-brand-gold-light text-brand-navy font-bold text-xs px-5 py-2 rounded-lg transition-all"
        >
          Aceptar
        </button>
      </div>
    </div>
  );
}
