"use client";
import { useState } from "react";
import { useInView } from "@/hooks/useInView";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { isValidPhone } from "@/lib/validators";

const UNIPARTS = "https://upandina.com/";

const brands = ["Megalift", "Mitsubishi", "Doosan", "Bobcat", "Narrow Aisle", "Clark", "Hyster", "Yale", "Toyota", "Otra marca"];
const partCategories = ["Cauchos y Llantas", "Baterías y Cargadores", "Sistema Hidráulico", "Motor y Transmisión", "Sistema Eléctrico", "Cadenas y Rodillos", "Frenos", "Filtros", "No estoy seguro"];

export default function PartsQuoter() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    brand: "",
    model: "",
    serial: "",
    category: "",
    description: "",
    partNumber: "",
    nombre: "",
    whatsapp: "",
    urgencia: "normal",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [phoneError, setPhoneError] = useState("");
  const { ref, visible } = useInView();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (e.target.name === "whatsapp" && phoneError) setPhoneError("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    // Comprobación de número real antes de continuar
    if (!isValidPhone(form.whatsapp)) {
      setPhoneError("Ingresa un número de WhatsApp válido (ej. 0424-1234567).");
      return;
    }
    setPhoneError("");
    setStatus("sending");
    // Guarda el lead (best-effort) y redirige a la tienda de repuestos Uniparts
    try {
      await addDoc(collection(db, "partsQuotes"), {
        ...form,
        createdAt: serverTimestamp(),
        status: "pendiente",
      });
    } catch {
      // Aunque falle el guardado, igual redirigimos para no perder la solicitud
    }
    window.open(UNIPARTS, "_blank");
    setStatus("sent");
  };

  const steps = [
    { title: "Tu equipo", subtitle: "Identificación del montacargas" },
    { title: "El repuesto", subtitle: "Qué pieza necesitas" },
    { title: "Tus datos", subtitle: "Para enviarte la cotización" },
  ];

  return (
    <section id="cotizador-repuestos" className="py-20 bg-brand-cream rca-blueprint">
      <div ref={ref} className={`max-w-7xl mx-auto px-4 sm:px-6 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <div className="mb-12">
          <div className="rca-tag text-brand-gold font-bold text-sm uppercase tracking-widest mb-3">Cotización en 2 horas</div>
          <h2 className="text-3xl sm:text-4xl font-black text-brand-navy">Cotizador rápido de repuestos</h2>
          <p className="text-brand-muted mt-3 max-w-lg">Identifica tu equipo, describe la pieza y recibe cotización por WhatsApp en tiempo récord</p>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Progress */}
          <div className="flex items-center justify-between mb-8">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    i < step ? "bg-brand-gold text-brand-navy" :
                    i === step ? "bg-brand-navy text-brand-gold ring-4 ring-brand-gold/20" :
                    "bg-gray-200 text-gray-400"
                  }`}>
                    {i < step ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" /></svg>
                    ) : i + 1}
                  </div>
                  <p className={`text-xs font-medium mt-1.5 ${i === step ? "text-brand-navy" : "text-brand-muted"}`}>{s.title}</p>
                </div>
                {i < steps.length - 1 && <div className={`h-0.5 w-16 sm:w-24 mx-2 rounded-full ${i < step ? "bg-brand-gold" : "bg-gray-200"}`} />}
              </div>
            ))}
          </div>

          {status === "sent" ? (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h3 className="text-xl font-bold text-green-700 mb-2">Te llevamos a Uniparts</h3>
              <p className="text-green-600 text-sm">Abrimos la tienda de repuestos Uniparts en una pestaña nueva. Si no se abrió, <a href={UNIPARTS} target="_blank" rel="noopener noreferrer" className="underline font-semibold">haz clic aquí</a>.</p>
              <button onClick={() => { setStatus("idle"); setStep(0); setForm({ brand: "", model: "", serial: "", category: "", description: "", partNumber: "", nombre: "", whatsapp: "", urgencia: "normal" }); }} className="mt-4 text-green-700 underline text-sm">Hacer otra búsqueda</button>
            </div>
          ) : (
            <div className="rca-card bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm">
              {/* Step 0: Equipment identification */}
              {step === 0 && (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <label className="block text-sm font-medium text-brand-navy mb-1">Marca del equipo *</label>
                    <select name="brand" required value={form.brand} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none text-sm transition-all bg-white">
                      <option value="">Selecciona la marca</option>
                      {brands.map((b) => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-navy mb-1">Modelo</label>
                    <input type="text" name="model" value={form.model} onChange={handleChange} placeholder="Ej: FD50, CPC30, etc." className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none text-sm transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-navy mb-1">Número de serie (opcional)</label>
                    <input type="text" name="serial" value={form.serial} onChange={handleChange} placeholder="Lo encuentras en la placa del equipo" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none text-sm transition-all" />
                  </div>
                  <button onClick={() => form.brand && setStep(1)} disabled={!form.brand} className="w-full bg-brand-navy disabled:bg-gray-300 text-brand-gold font-bold py-3.5 rounded-xl text-sm transition-all hover:bg-brand-navy-light">
                    Siguiente
                  </button>
                </div>
              )}

              {/* Step 1: Part description */}
              {step === 1 && (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <label className="block text-sm font-medium text-brand-navy mb-1">Categoría del repuesto *</label>
                    <select name="category" required value={form.category} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none text-sm transition-all bg-white">
                      <option value="">Selecciona una categoría</option>
                      {partCategories.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-navy mb-1">Descripción de la pieza *</label>
                    <textarea name="description" required value={form.description} onChange={handleChange} rows={3} placeholder="Describe la pieza que necesitas, incluyendo cualquier detalle visible (tamaño, ubicación, síntoma de falla...)" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none text-sm transition-all resize-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-navy mb-1">Número de parte (si lo tienes)</label>
                    <input type="text" name="partNumber" value={form.partNumber} onChange={handleChange} placeholder="Ej: 91A14-00200" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none text-sm transition-all" />
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setStep(0)} className="px-6 py-3.5 rounded-xl text-sm font-semibold text-brand-navy border border-gray-200 hover:bg-gray-50 transition-all">Atrás</button>
                    <button onClick={() => form.category && form.description && setStep(2)} disabled={!form.category || !form.description} className="flex-1 bg-brand-navy disabled:bg-gray-300 text-brand-gold font-bold py-3.5 rounded-xl text-sm transition-all hover:bg-brand-navy-light">Siguiente</button>
                  </div>
                </div>
              )}

              {/* Step 2: Contact info */}
              {step === 2 && (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <label className="block text-sm font-medium text-brand-navy mb-1">Tu nombre *</label>
                    <input type="text" name="nombre" required value={form.nombre} onChange={handleChange} placeholder="Nombre completo" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none text-sm transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-navy mb-1">WhatsApp *</label>
                    <input type="tel" name="whatsapp" required value={form.whatsapp} onChange={handleChange} onBlur={() => { if (form.whatsapp && !isValidPhone(form.whatsapp)) setPhoneError("Ingresa un número de WhatsApp válido (ej. 0424-1234567)."); }} placeholder="04XX-XXXXXXX" aria-invalid={!!phoneError} className={`w-full px-4 py-3 rounded-xl border outline-none text-sm transition-all ${phoneError ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200" : "border-gray-200 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20"}`} />
                    {phoneError && <p className="text-red-500 text-xs mt-1">{phoneError}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-navy mb-1">Urgencia</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { key: "urgente", label: "Urgente", sub: "< 24h" },
                        { key: "normal", label: "Normal", sub: "1-3 días" },
                        { key: "planificando", label: "Sin prisa", sub: "1 semana+" },
                      ].map((u) => (
                        <button key={u.key} type="button" onClick={() => setForm({ ...form, urgencia: u.key })} className={`px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${form.urgencia === u.key ? "bg-brand-navy text-brand-gold" : "bg-gray-100 text-brand-navy hover:bg-gray-200"}`}>
                          {u.label}
                          <span className="block text-[10px] font-normal opacity-60">{u.sub}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="bg-brand-cream rounded-xl p-4 text-sm">
                    <p className="font-bold text-brand-navy mb-2">Resumen de tu solicitud:</p>
                    <p className="text-brand-muted">{form.brand} {form.model} {form.serial && `(S/N: ${form.serial})`}</p>
                    <p className="text-brand-muted">{form.category} — {form.description.slice(0, 80)}{form.description.length > 80 ? "..." : ""}</p>
                    {form.partNumber && <p className="text-brand-muted">N° Parte: {form.partNumber}</p>}
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => setStep(1)} className="px-6 py-3.5 rounded-xl text-sm font-semibold text-brand-navy border border-gray-200 hover:bg-gray-50 transition-all">Atrás</button>
                    <button
                      onClick={handleSubmit}
                      disabled={!form.nombre || !form.whatsapp || status === "sending"}
                      className="flex-1 bg-brand-gold disabled:bg-gray-300 hover:bg-brand-gold-light text-brand-navy font-bold py-3.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2"
                    >
                      {status === "sending" ? (
                        <><svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Enviando...</>
                      ) : "Buscar en Uniparts"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
