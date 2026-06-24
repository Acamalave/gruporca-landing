"use client";
import { useState } from "react";
import { useInView } from "@/hooks/useInView";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { isValidPhone } from "@/lib/validators";

const WA = "584244013250";

const necesidadLabels: Record<string, string> = {
  "montacargas-nuevo": "Montacargas nuevo",
  "montacargas-usado": "Montacargas usado",
  apilador: "Apilador eléctrico",
  transpaleta: "Transpaleta",
  alquiler: "Alquiler de equipo",
  repuestos: "Repuestos",
  "servicio-tecnico": "Servicio técnico",
  otro: "Otro",
};

const urgenciaLabels: Record<string, string> = {
  inmediato: "Inmediato",
  "1-2-semanas": "1 a 2 semanas",
  "1-3-meses": "1 a 3 meses",
  planificando: "Estoy planificando",
};

export default function QuoteForm() {
  const [form, setForm] = useState({ nombre: "", empresa: "", whatsapp: "", necesidad: "", urgencia: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [phoneError, setPhoneError] = useState("");
  const { ref, visible } = useInView();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (e.target.name === "whatsapp" && phoneError) setPhoneError("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const buildWaMessage = () => {
    const necesidad = necesidadLabels[form.necesidad] || form.necesidad || "Por definir";
    const lines = [
      "¡Hola! Quiero solicitar una cotización:",
      "",
      `• Nombre: ${form.nombre}`,
      form.empresa ? `• Empresa: ${form.empresa}` : "",
      `• Necesidad: ${necesidad}`,
      form.urgencia ? `• Urgencia: ${urgenciaLabels[form.urgencia] || form.urgencia}` : "",
      form.whatsapp ? `• Mi WhatsApp: ${form.whatsapp}` : "",
      "",
      "Quedo atento a la información. ¡Gracias!",
    ].filter(Boolean);
    return lines.join("\n");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Comprobación de número real antes de continuar
    if (!isValidPhone(form.whatsapp)) {
      setPhoneError("Ingresa un número de WhatsApp válido (ej. 0424-1234567).");
      return;
    }
    setPhoneError("");
    setStatus("sending");
    // Guarda el lead (best-effort) y redirige a WhatsApp con el contexto del cliente
    try {
      await addDoc(collection(db, "leads"), {
        ...form,
        createdAt: serverTimestamp(),
        source: "landing-cotizacion",
        status: "nuevo",
      });
    } catch {
      // Aunque falle el guardado, igual abrimos WhatsApp para no perder la solicitud
    }
    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(buildWaMessage())}`, "_blank");
    setStatus("sent");
    setForm({ nombre: "", empresa: "", whatsapp: "", necesidad: "", urgencia: "" });
  };

  return (
    <section id="contacto" className="py-20 bg-white">
      <div ref={ref} className={`max-w-7xl mx-auto px-4 sm:px-6 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <span className="text-brand-gold font-semibold text-sm uppercase tracking-widest">Cotización rápida</span>
            <h2 className="text-3xl sm:text-4xl font-black text-brand-navy mt-2 mb-3">Solicita tu cotización</h2>
            <p className="text-brand-muted mb-8">Completa el formulario y te respondemos en menos de 2 horas en horario laboral.</p>

            {status === "sent" ? (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="text-xl font-bold text-green-700 mb-2">Cotización enviada</h3>
                <p className="text-green-600 text-sm">Te abrimos WhatsApp con tu solicitud para que un asesor te atienda de inmediato. Si no se abrió, escríbenos al +58 424-4013250.</p>
                <button onClick={() => setStatus("idle")} className="mt-4 text-green-700 underline text-sm">Enviar otra cotización</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-brand-navy mb-1">Nombre *</label>
                    <input type="text" name="nombre" required value={form.nombre} onChange={handleChange} placeholder="Tu nombre completo" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none text-sm transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-brand-navy mb-1">Empresa</label>
                    <input type="text" name="empresa" value={form.empresa} onChange={handleChange} placeholder="Nombre de tu empresa" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none text-sm transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-1">WhatsApp *</label>
                  <input type="tel" name="whatsapp" required value={form.whatsapp} onChange={handleChange} onBlur={() => { if (form.whatsapp && !isValidPhone(form.whatsapp)) setPhoneError("Ingresa un número de WhatsApp válido (ej. 0424-1234567)."); }} placeholder="04XX-XXXXXXX" aria-invalid={!!phoneError} className={`w-full px-4 py-3 rounded-xl border outline-none text-sm transition-all ${phoneError ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200" : "border-gray-200 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20"}`} />
                  {phoneError && <p className="text-red-500 text-xs mt-1">{phoneError}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-1">¿Qué necesitas? *</label>
                  <select name="necesidad" required value={form.necesidad} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none text-sm transition-all bg-white">
                    <option value="">Selecciona una opción</option>
                    <option value="montacargas-nuevo">Montacargas nuevo</option>
                    <option value="montacargas-usado">Montacargas usado</option>
                    <option value="apilador">Apilador eléctrico</option>
                    <option value="transpaleta">Transpaleta</option>
                    <option value="alquiler">Alquiler de equipo</option>
                    <option value="repuestos">Repuestos</option>
                    <option value="servicio-tecnico">Servicio técnico</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-1">Urgencia</label>
                  <select name="urgencia" value={form.urgencia} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none text-sm transition-all bg-white">
                    <option value="">Selecciona</option>
                    <option value="inmediato">Inmediato</option>
                    <option value="1-2-semanas">1 a 2 semanas</option>
                    <option value="1-3-meses">1 a 3 meses</option>
                    <option value="planificando">Estoy planificando</option>
                  </select>
                </div>
                <button type="submit" disabled={status === "sending"} className="w-full bg-brand-gold hover:bg-brand-gold-light disabled:bg-gray-300 text-brand-navy font-bold py-4 rounded-xl text-base transition-all flex items-center justify-center gap-2">
                  {status === "sending" ? (
                    <><svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Enviando...</>
                  ) : "Enviar cotización"}
                </button>
                {status === "error" && <p className="text-red-500 text-sm text-center">Error al enviar. Intenta de nuevo o contáctanos por WhatsApp.</p>}
              </form>
            )}
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl overflow-hidden h-64 lg:h-80">
              <iframe
                src="https://maps.google.com/maps?q=10.1384659,-68.0484373&z=17&hl=es&output=embed"
                width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Ubicación Grupo RCA"
              />
            </div>
            <a
              href="https://maps.app.goo.gl/ctTmyHSGDZmWL3t9A"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-brand-gold hover:text-brand-navy text-sm font-semibold transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" /></svg>
              Cómo llegar (Google Maps)
            </a>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { icon: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z", title: "Dirección", lines: ["Autopista Valencia - Campo Carabobo", "Vía de Servicio San Luis, Valencia"] },
                { icon: "M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z", title: "Teléfono", lines: ["0241-412.00.80", "info@gruporca.com"] },
                { icon: "M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z", title: "Horario", lines: ["Lunes a Viernes: 7:30 AM - 4:30 PM"] },
                { icon: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z", title: "WhatsApp", lines: ["Ventas y servicio:", "+58 424-4013250"] },
              ].map((c, i) => (
                <div key={i} className="bg-[#f7f7f5] p-5 rounded-xl">
                  <div className="w-10 h-10 bg-brand-gold/10 rounded-lg flex items-center justify-center mb-3">
                    <svg className="w-5 h-5 text-brand-gold" fill="currentColor" viewBox="0 0 24 24"><path d={c.icon} /></svg>
                  </div>
                  <h4 className="font-bold text-brand-navy text-sm">{c.title}</h4>
                  {c.lines.map((l, j) => <p key={j} className="text-brand-muted text-xs mt-0.5">{l}</p>)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
