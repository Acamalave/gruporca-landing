"use client";
import { useState, useRef, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { currentVisitorId, identifyVisitor, logEvent } from "@/lib/visitor";
import { isValidPhone } from "@/lib/validators";
import { useChatAvailability } from "@/hooks/useChatAvailability";

const WA = "584244013250";

type Message = {
  from: "bot" | "user";
  text: string;
  options?: { label: string; value: string }[];
};

type ConversationState = "start" | "use" | "environment" | "capacity" | "budget" | "condition" | "result" | "contact";

const recommendations: Record<string, { name: string; type: string; why: string }> = {
  "interior-ligero-economico": { name: "Transpaleta Eléctrica 2T", type: "Megalift", why: "Ideal para trabajo ligero en interiores. Bajo costo de operación y fácil manejo." },
  "interior-ligero-premium": { name: "Apilador Eléctrico 1.6T", type: "Megalift", why: "Elevación de hasta 5.5m en pasillos angostos. Silencioso y cero emisiones." },
  "interior-medio-economico": { name: "Contrabalanceado Eléctrico 2.5T", type: "Megalift", why: "Potencia litio con carga rápida. Cero emisiones para trabajo en almacén." },
  "interior-medio-premium": { name: "Reach Truck 1.5T", type: "Narrow Aisle", why: "Máxima precisión y 10m de elevación. Para almacenes de alta densidad." },
  "interior-pesado-economico": { name: "Contrabalanceado Eléctrico 2.5T", type: "Megalift", why: "Robusto y eficiente. Litio para operaciones de alta demanda en interiores." },
  "interior-pesado-premium": { name: "Contrabalanceado Eléctrico 3.5T", type: "Megalift", why: "Máxima capacidad eléctrica. Ideal para cargas pesadas en espacios cerrados." },
  "exterior-ligero-economico": { name: "Contrabalanceado GLP 3T", type: "Doosan", why: "Versátil y económico. Dual combustible para flexibilidad operativa." },
  "exterior-ligero-premium": { name: "Contrabalanceado Diésel 3T", type: "Mitsubishi", why: "Fiabilidad Mitsubishi para exteriores. Robusto y bajo mantenimiento." },
  "exterior-medio-economico": { name: "Contrabalanceado GLP 3T", type: "Doosan", why: "Balance perfecto entre potencia y economía. Ideal para patios y exteriores." },
  "exterior-medio-premium": { name: "Contrabalanceado Diésel 5T", type: "Mitsubishi", why: "Motor Mitsubishi de alta durabilidad. Para operaciones exigentes." },
  "exterior-pesado-economico": { name: "Contrabalanceado Diésel 5T", type: "Mitsubishi", why: "Potencia bruta para cargas pesadas. Rendimiento comprobado en campo." },
  "exterior-pesado-premium": { name: "Contrabalanceado Diésel 7T", type: "Mitsubishi", why: "El más potente de la línea. Para las operaciones más demandantes." },
  "mixto-ligero-economico": { name: "Contrabalanceado GLP 3T", type: "Doosan", why: "Dual combustible funciona en interiores y exteriores. Muy versátil." },
  "mixto-ligero-premium": { name: "Contrabalanceado Eléctrico 2.5T", type: "Megalift", why: "Litio de carga rápida. Funciona en cualquier ambiente sin emisiones." },
  "mixto-medio-economico": { name: "Contrabalanceado GLP 3T", type: "Doosan", why: "Buena potencia para uso mixto. Económico en combustible." },
  "mixto-medio-premium": { name: "Contrabalanceado Diésel 5T", type: "Mitsubishi", why: "Versatilidad premium. Funciona bien en cualquier terreno." },
  "mixto-pesado-economico": { name: "Contrabalanceado Diésel 5T", type: "Mitsubishi", why: "Resistente y potente para uso intensivo en cualquier ambiente." },
  "mixto-pesado-premium": { name: "Contrabalanceado Diésel 7T", type: "Mitsubishi", why: "Máxima potencia y versatilidad. Sin límites de terreno o carga." },
};

export default function EquipmentChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [state, setState] = useState<ConversationState>("start");
  const [answers, setAnswers] = useState({ use: "", environment: "", capacity: "", budget: "", condition: "" });
  const [nombre, setNombre] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [sending, setSending] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const liveAvailable = useChatAvailability();

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const addMessages = (msgs: Message[]) => {
    setMessages((prev) => [...prev, ...msgs]);
  };

  const startChat = () => {
    setIsOpen(true);
    if (messages.length === 0) {
      setMessages([
        {
          from: "bot",
          text: "¡Hola! Soy el asistente de Grupo RCA. Te ayudo a encontrar el montacargas ideal para tu operación. Empecemos con unas preguntas rápidas.",
        },
        {
          from: "bot",
          text: "¿Para qué necesitas el equipo principalmente?",
          options: [
            { label: "Almacén / Distribución", value: "almacen" },
            { label: "Manufactura / Planta", value: "manufactura" },
            { label: "Construcción", value: "construccion" },
            { label: "Puerto / Carga pesada", value: "puerto" },
            { label: "Otro / No estoy seguro", value: "otro" },
          ],
        },
      ]);
      setState("use");
    }
  };

  const handleOption = (value: string, label: string) => {
    addMessages([{ from: "user", text: label }]);

    switch (state) {
      case "use":
        setAnswers((a) => ({ ...a, use: value }));
        setTimeout(() => {
          addMessages([
            { from: "bot", text: "Perfecto. ¿Dónde operará el equipo la mayor parte del tiempo?" },
            {
              from: "bot",
              text: "",
              options: [
                { label: "Interior (almacén cerrado)", value: "interior" },
                { label: "Exterior (patio, obra)", value: "exterior" },
                { label: "Ambos (mixto)", value: "mixto" },
              ],
            },
          ]);
          setState("environment");
        }, 500);
        break;

      case "environment":
        setAnswers((a) => ({ ...a, environment: value }));
        setTimeout(() => {
          addMessages([
            { from: "bot", text: "¿Qué tan intenso será el uso diario?" },
            {
              from: "bot",
              text: "",
              options: [
                { label: "Ligero (< 4 horas/día)", value: "ligero" },
                { label: "Medio (4-8 horas/día)", value: "medio" },
                { label: "Pesado (8+ horas/día)", value: "pesado" },
              ],
            },
          ]);
          setState("capacity");
        }, 500);
        break;

      case "capacity":
        setAnswers((a) => ({ ...a, capacity: value }));
        setTimeout(() => {
          addMessages([
            { from: "bot", text: "¿Cuál es tu rango de presupuesto?" },
            {
              from: "bot",
              text: "",
              options: [
                { label: "Económico (busco lo mejor por el precio)", value: "economico" },
                { label: "Premium (priorizo calidad y durabilidad)", value: "premium" },
              ],
            },
          ]);
          setState("budget");
        }, 500);
        break;

      case "budget":
        setAnswers((a) => ({ ...a, budget: value }));
        setTimeout(() => {
          addMessages([
            { from: "bot", text: "¿Prefieres equipo nuevo o usado certificado?" },
            {
              from: "bot",
              text: "",
              options: [
                { label: "Nuevo (con garantía de fábrica)", value: "nuevo" },
                { label: "Usado certificado (más económico)", value: "usado" },
                { label: "Me da igual, recomiéndame", value: "cualquiera" },
              ],
            },
          ]);
          setState("condition");
        }, 500);
        break;

      case "condition": {
        const newAnswers = { ...answers, condition: value };
        setAnswers(newAnswers);
        const key = `${newAnswers.environment}-${newAnswers.capacity}-${newAnswers.budget}`;
        const rec = recommendations[key] || recommendations["mixto-medio-economico"];

        // Registra la recomendación (best-effort) para verla en el panel
        addDoc(collection(db, "searches"), {
          type: "chatbot",
          uso: newAnswers.use,
          ambiente: newAnswers.environment,
          capacidad: newAnswers.capacity,
          presupuesto: newAnswers.budget,
          condicion: value,
          recomendado: `${rec.name} (${rec.type})`,
          visitorId: currentVisitorId(),
          createdAt: serverTimestamp(),
        }).catch(() => {});

        setTimeout(() => {
          addMessages([
            {
              from: "bot",
              text: `Basado en tu operación, te recomiendo:\n\n**${rec.name}** (${rec.type})\n\n${rec.why}\n\nCondición: ${value === "nuevo" ? "Nuevo" : value === "usado" ? "Usado certificado" : "Disponible en ambas opciones"}`,
            },
            {
              from: "bot",
              text: "¿Quieres que un asesor te contacte con precio y disponibilidad?",
              options: [
                { label: "Sí, por WhatsApp", value: "whatsapp" },
                { label: "Empezar de nuevo", value: "restart" },
              ],
            },
          ]);
          setState("result");
        }, 800);
        break;
      }

      case "result":
        if (value === "whatsapp") {
          setTimeout(() => {
            addMessages([
              { from: "bot", text: "¡Perfecto! Déjame tu nombre y tu WhatsApp para que un asesor te contacte con precio y disponibilidad." },
            ]);
            setState("contact");
          }, 400);
        } else {
          setMessages([]);
          setAnswers({ use: "", environment: "", capacity: "", budget: "", condition: "" });
          setNombre(""); setWhatsapp(""); setPhoneError(""); setSending(false);
          startChat();
        }
        break;
    }
  };

  // Guarda el lead con el contacto y abre WhatsApp con la recomendación.
  const submitContact = async () => {
    if (!nombre.trim()) return;
    if (!isValidPhone(whatsapp)) {
      setPhoneError("Ingresa un número de WhatsApp válido (ej. 0424-1234567).");
      return;
    }
    setPhoneError("");
    setSending(true);
    const rec = recommendations[`${answers.environment}-${answers.capacity}-${answers.budget}`] || recommendations["mixto-medio-economico"];
    const necesidades =
      answers.condition === "nuevo" ? ["montacargas-nuevo"]
      : answers.condition === "usado" ? ["montacargas-usado"]
      : ["montacargas-nuevo", "montacargas-usado"];
    const visitorId = await identifyVisitor({ nombre: nombre.trim(), whatsapp: whatsapp.trim() });
    try {
      await addDoc(collection(db, "leads"), {
        nombre: nombre.trim(),
        empresa: "",
        whatsapp: whatsapp.trim(),
        necesidades,
        comentarios: `Asesor virtual: recomendado ${rec.name} (${rec.type}). Uso: ${answers.use}, ambiente: ${answers.environment}, intensidad: ${answers.capacity}, presupuesto: ${answers.budget}, condición: ${answers.condition}`,
        visitorId,
        createdAt: serverTimestamp(),
        source: "chatbot",
        status: "nuevo",
      });
    } catch {
      // Aunque falle el guardado, igual abrimos WhatsApp para no perder la solicitud
    }
    logEvent("lead", { source: "chatbot", recomendado: rec.name });
    const msg = `Hola, soy ${nombre.trim()}. El chatbot me recomendó un ${rec.name} (${rec.type}) para mi operación. Me interesa recibir cotización. Condición preferida: ${answers.condition}`;
    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`, "_blank");
    setSending(false);
    addMessages([
      { from: "user", text: `${nombre.trim()} — ${whatsapp.trim()}` },
      {
        from: "bot",
        text: "¡Listo! Registramos tu solicitud y te abrimos WhatsApp para que un asesor te atienda de inmediato. Te contactaremos muy pronto.",
        options: [{ label: "Empezar de nuevo", value: "restart" }],
      },
    ]);
    setState("result");
  };

  // Si hay un asesor disponible en vivo, el chat en vivo toma este lugar.
  if (liveAvailable) return null;

  return (
    <>
      {/* Chat button */}
      {!isOpen && (
        <button
          onClick={startChat}
          aria-label="Asesor virtual"
          className="fixed bottom-6 right-[88px] sm:right-24 z-50 bg-brand-navy text-white p-4 sm:px-5 sm:py-3 rounded-full shadow-lg hover:bg-brand-navy-light transition-all flex items-center gap-2 animate-fade-in"
        >
          <svg className="w-5 h-5 text-brand-gold shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
          <span className="hidden sm:inline text-sm font-semibold">Asesor virtual</span>
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-[55] w-[360px] max-w-[calc(100vw-48px)] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-fade-in-up flex flex-col" style={{ maxHeight: "min(600px, calc(100vh - 100px))" }}>
          {/* Header */}
          <div className="bg-brand-navy p-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-brand-gold/20 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <div>
                <p className="text-white text-sm font-bold">Asesor Virtual RCA</p>
                <p className="text-white/50 text-xs">Selección de equipos</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {/* Messages */}
          <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
            {messages.map((msg, i) => (
              <div key={i}>
                {msg.text && (
                  <div className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-line ${
                      msg.from === "user"
                        ? "bg-brand-navy text-white rounded-br-sm"
                        : "bg-gray-100 text-brand-navy rounded-bl-sm"
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                )}
                {msg.options && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {msg.options.map((opt, j) => (
                      <button
                        key={j}
                        onClick={() => handleOption(opt.value, opt.label)}
                        className="bg-white border border-brand-gold/30 text-brand-navy text-sm font-medium px-4 py-2 rounded-xl hover:bg-brand-gold/10 hover:border-brand-gold transition-all"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Captura de contacto */}
          {state === "contact" && (
            <div className="p-3 border-t border-gray-100 space-y-2 shrink-0">
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Tu nombre *"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none text-sm transition-all"
              />
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => { setWhatsapp(e.target.value); if (phoneError) setPhoneError(""); }}
                onKeyDown={(e) => e.key === "Enter" && submitContact()}
                placeholder="Tu WhatsApp * (04XX-XXXXXXX)"
                aria-invalid={!!phoneError}
                className={`w-full px-4 py-2.5 rounded-xl border outline-none text-sm transition-all ${phoneError ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200" : "border-gray-200 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20"}`}
              />
              {phoneError && <p className="text-red-500 text-xs">{phoneError}</p>}
              <button
                onClick={submitContact}
                disabled={!nombre.trim() || !whatsapp.trim() || sending}
                className="w-full bg-brand-gold hover:bg-brand-gold-light disabled:bg-gray-300 text-brand-navy font-bold py-2.5 rounded-xl text-sm transition-all"
              >
                {sending ? "Enviando…" : "Solicitar contacto por WhatsApp"}
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
