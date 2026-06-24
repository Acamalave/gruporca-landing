"use client";
import { useState } from "react";
import { useInView } from "@/hooks/useInView";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { currentVisitorId, logEvent } from "@/lib/visitor";

const WA = "584244013250";

type Option = { label: string; value: string; icon: string };
type Step = { question: string; options: Option[] };

// Reusable icons
const CAP_ICON = "M21 16.5c0 .38-.21.71-.53.88l-7.9 4.44c-.16.12-.36.18-.57.18s-.41-.06-.57-.18l-7.9-4.44A.991.991 0 013 16.5v-9c0-.38.21-.71.53-.88l7.9-4.44c.16-.12.36-.18.57-.18s.41.06.57.18l7.9 4.44c.32.17.53.5.53.88v9z";
const NEW_ICON = "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z";
const USED_ICON = "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z";
const RENT_ICON = "M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z";
const ANY_ICON = "M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z";
const Q_ICON = "M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z";
const BOLT_ICON = "M13 10V3L4 14h7v7l9-11h-7z";
const COG_ICON = "M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z";

const EQUIPMENT_STEP: Step = {
  question: "¿Qué tipo de equipo necesitas?",
  options: [
    { label: "Montacargas", value: "montacargas", icon: "M12 2L4 7v10l8 5 8-5V7l-8-5zm0 2.18L18 8v8l-6 3.82L6 16V8l6-3.82z" },
    { label: "Apilador", value: "apilador", icon: "M7 2v11h3v9l7-12h-4l4-8H7z" },
    { label: "Transpaleta", value: "transpaleta", icon: "M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4z" },
    { label: "No estoy seguro", value: "no-seguro", icon: Q_ICON },
  ],
};

const COND_FULL: Step = {
  question: "¿Condición del equipo?",
  options: [
    { label: "Nuevo", value: "nuevo", icon: NEW_ICON },
    { label: "Usado certificado", value: "usado", icon: USED_ICON },
    { label: "Alquiler", value: "alquiler", icon: RENT_ICON },
    { label: "Cualquier opción", value: "cualquiera", icon: ANY_ICON },
  ],
};

// Apiladores: no se venden usados
const COND_NO_USED: Step = {
  question: "¿Condición del equipo?",
  options: [
    { label: "Nuevo", value: "nuevo", icon: NEW_ICON },
    { label: "Alquiler", value: "alquiler", icon: RENT_ICON },
    { label: "Cualquier opción", value: "cualquiera", icon: ANY_ICON },
  ],
};

const TRANSPALETA_TYPE: Step = {
  question: "¿Manual o eléctrica?",
  options: [
    { label: "Manual", value: "manual", icon: COG_ICON },
    { label: "Eléctrica", value: "electrica", icon: BOLT_ICON },
  ],
};

const CAP_GENERIC: Step = {
  question: "¿Capacidad de carga?",
  options: [
    { label: "Hasta 2.5 ton", value: "hasta-2.5t", icon: CAP_ICON },
    { label: "2.5 a 5 ton", value: "2.5-5t", icon: CAP_ICON },
    { label: "Más de 5 ton", value: "mas-5t", icon: CAP_ICON },
    { label: "Por definir", value: "por-definir", icon: Q_ICON },
  ],
};

const capacityStep = (tons: string[]): Step => ({
  question: "¿Capacidad de carga?",
  options: tons.map((t) => ({ label: `${t} ton`, value: `${t}t`, icon: CAP_ICON })),
});

function buildSteps(type?: string): Step[] {
  if (type === "apilador") {
    return [EQUIPMENT_STEP, COND_NO_USED, capacityStep(["1", "1.2", "1.5", "1.6", "2.0"])];
  }
  if (type === "transpaleta") {
    return [EQUIPMENT_STEP, TRANSPALETA_TYPE, capacityStep(["1", "1.2", "1.5", "1.6", "2.0", "2.5", "3.0", "3.5"])];
  }
  return [EQUIPMENT_STEP, COND_FULL, CAP_GENERIC];
}

export default function EquipmentFinder() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const { ref, visible } = useInView();

  const steps = buildSteps(answers[0]);

  const select = (v: string) => {
    const next = [...answers, v];
    setAnswers(next);
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      setDone(true);
      // Registra la búsqueda (best-effort) para verla en el panel
      addDoc(collection(db, "searches"), {
        type: "finder",
        equipo: next[0] || "",
        opcion: next[1] || "",
        capacidad: next[2] || "",
        visitorId: currentVisitorId(),
        createdAt: serverTimestamp(),
      }).catch(() => {});
      logEvent("search_finder", { equipo: next[0], opcion: next[1], capacidad: next[2] });
    }
  };

  const reset = () => { setStep(0); setAnswers([]); setDone(false); };

  const waMsg = () => encodeURIComponent(
    `¡Hola! Busco:\n- Equipo: ${answers[0]}\n- Opción: ${answers[1]}\n- Capacidad: ${answers[2]}\n\n¿Me pueden asesorar?`
  );

  return (
    <section id="buscador" className="py-20 bg-brand-cream rca-blueprint">
      <div ref={ref} className={`max-w-4xl mx-auto px-4 sm:px-6 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <div className="mb-12">
          <div className="rca-tag text-brand-gold font-bold text-sm uppercase tracking-widest mb-3">Asesor virtual</div>
          <h2 className="text-3xl sm:text-4xl font-black text-brand-navy">Encuentra tu equipo ideal</h2>
          <p className="text-brand-muted mt-3 max-w-lg">Responde 3 preguntas y te conectamos con la solución perfecta para tu operación</p>
        </div>

        <div className="rca-card bg-white rounded-2xl shadow-xl shadow-black/5 p-6 sm:p-10 border border-gray-100">
          {!done ? (
            <>
              {/* Progress */}
              <div className="flex gap-2 mb-8">
                {steps.map((_, i) => (
                  <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i <= step ? "bg-brand-gold" : "bg-gray-200"}`} />
                ))}
              </div>
              <p className="text-brand-gold text-sm font-medium mb-2">Paso {step + 1} de {steps.length}</p>
              <h3 className="text-2xl font-bold text-brand-navy mb-8">{steps[step].question}</h3>

              <div className="grid grid-cols-2 gap-4">
                {steps[step].options.map((o) => (
                  <button
                    key={o.value}
                    onClick={() => select(o.value)}
                    className="group flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-gray-200 hover:border-brand-gold hover:bg-brand-gold/5 transition-all text-center"
                  >
                    <svg className="w-8 h-8 text-brand-gold group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d={o.icon} /></svg>
                    <span className="font-semibold text-brand-navy group-hover:text-brand-gold transition-colors">{o.label}</span>
                  </button>
                ))}
              </div>

              {step > 0 && (
                <button onClick={() => { setStep(step - 1); setAnswers(answers.slice(0, -1)); }} className="mt-6 text-brand-muted hover:text-brand-gold text-sm flex items-center gap-1 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  Volver
                </button>
              )}
            </>
          ) : (
            <div className="text-center py-6">
              <div className="w-20 h-20 bg-brand-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h3 className="text-2xl font-bold text-brand-navy mb-3">Tenemos opciones para ti</h3>
              <p className="text-brand-muted mb-8 max-w-md mx-auto">Un asesor especializado te contactará con las mejores opciones, precios y condiciones.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href={`https://wa.me/${WA}?text=${waMsg()}`} target="_blank" rel="noopener noreferrer" className="bg-[#25D366] hover:bg-[#1fb855] text-white font-bold px-8 py-4 rounded-xl transition-all inline-flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  Recibir asesoría por WhatsApp
                </a>
                <button onClick={reset} className="text-brand-muted hover:text-brand-gold font-medium px-6 py-4 rounded-xl transition-colors">Buscar otro equipo</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
