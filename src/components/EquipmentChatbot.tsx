"use client";
import { useState, useRef, useEffect } from "react";

const WA = "584241700600";

type Message = {
  from: "bot" | "user";
  text: string;
  options?: { label: string; value: string }[];
};

type ConversationState = "start" | "use" | "environment" | "capacity" | "budget" | "condition" | "result";

const recommendations: Record<string, { name: string; type: string; why: string }> = {
  "interior-ligero-economico": { name: "Transpaleta Electrica 2T", type: "Megalift", why: "Ideal para trabajo ligero en interiores. Bajo costo de operacion y facil manejo." },
  "interior-ligero-premium": { name: "Apilador Electrico 1.6T", type: "Megalift", why: "Elevacion de hasta 5.5m en pasillos angostos. Silencioso y cero emisiones." },
  "interior-medio-economico": { name: "Contrabalanceado Electrico 2.5T", type: "Megalift", why: "Potencia litio con carga rapida. Cero emisiones para trabajo en almacen." },
  "interior-medio-premium": { name: "Reach Truck 1.5T", type: "Narrow Aisle", why: "Maxima precision y 10m de elevacion. Para almacenes de alta densidad." },
  "interior-pesado-economico": { name: "Contrabalanceado Electrico 2.5T", type: "Megalift", why: "Robusto y eficiente. Litio para operaciones de alta demanda en interiores." },
  "interior-pesado-premium": { name: "Contrabalanceado Electrico 3.5T", type: "Megalift", why: "Maxima capacidad electrica. Ideal para cargas pesadas en espacios cerrados." },
  "exterior-ligero-economico": { name: "Contrabalanceado GLP 3T", type: "Doosan", why: "Versatil y economico. Dual combustible para flexibilidad operativa." },
  "exterior-ligero-premium": { name: "Contrabalanceado Diesel 3T", type: "Mitsubishi", why: "Fiabilidad Mitsubishi para exteriores. Robusto y bajo mantenimiento." },
  "exterior-medio-economico": { name: "Contrabalanceado GLP 3T", type: "Doosan", why: "Balance perfecto entre potencia y economia. Ideal para patios y exteriores." },
  "exterior-medio-premium": { name: "Contrabalanceado Diesel 5T", type: "Mitsubishi", why: "Motor Mitsubishi de alta durabilidad. Para operaciones exigentes." },
  "exterior-pesado-economico": { name: "Contrabalanceado Diesel 5T", type: "Mitsubishi", why: "Potencia bruta para cargas pesadas. Rendimiento comprobado en campo." },
  "exterior-pesado-premium": { name: "Contrabalanceado Diesel 7T", type: "Mitsubishi", why: "El mas potente de la linea. Para las operaciones mas demandantes." },
  "mixto-ligero-economico": { name: "Contrabalanceado GLP 3T", type: "Doosan", why: "Dual combustible funciona en interiores y exteriores. Muy versatil." },
  "mixto-ligero-premium": { name: "Contrabalanceado Electrico 2.5T", type: "Megalift", why: "Litio de carga rapida. Funciona en cualquier ambiente sin emisiones." },
  "mixto-medio-economico": { name: "Contrabalanceado GLP 3T", type: "Doosan", why: "Buena potencia para uso mixto. Economico en combustible." },
  "mixto-medio-premium": { name: "Contrabalanceado Diesel 5T", type: "Mitsubishi", why: "Versatilidad premium. Funciona bien en cualquier terreno." },
  "mixto-pesado-economico": { name: "Contrabalanceado Diesel 5T", type: "Mitsubishi", why: "Resistente y potente para uso intensivo en cualquier ambiente." },
  "mixto-pesado-premium": { name: "Contrabalanceado Diesel 7T", type: "Mitsubishi", why: "Maxima potencia y versatilidad. Sin limites de terreno o carga." },
};

export default function EquipmentChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [state, setState] = useState<ConversationState>("start");
  const [answers, setAnswers] = useState({ use: "", environment: "", capacity: "", budget: "", condition: "" });
  const chatRef = useRef<HTMLDivElement>(null);

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
          text: "Hola! Soy el asistente de Grupo RCA. Te ayudo a encontrar el montacargas ideal para tu operacion. Empecemos con unas preguntas rapidas.",
        },
        {
          from: "bot",
          text: "Para que necesitas el equipo principalmente?",
          options: [
            { label: "Almacen / Distribucion", value: "almacen" },
            { label: "Manufactura / Planta", value: "manufactura" },
            { label: "Construccion", value: "construccion" },
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
            { from: "bot", text: "Perfecto. Donde operara el equipo la mayor parte del tiempo?" },
            {
              from: "bot",
              text: "",
              options: [
                { label: "Interior (almacen cerrado)", value: "interior" },
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
            { from: "bot", text: "Que tan intenso sera el uso diario?" },
            {
              from: "bot",
              text: "",
              options: [
                { label: "Ligero (< 4 horas/dia)", value: "ligero" },
                { label: "Medio (4-8 horas/dia)", value: "medio" },
                { label: "Pesado (8+ horas/dia)", value: "pesado" },
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
            { from: "bot", text: "Cual es tu rango de presupuesto?" },
            {
              from: "bot",
              text: "",
              options: [
                { label: "Economico (busco lo mejor por el precio)", value: "economico" },
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
            { from: "bot", text: "Prefieres equipo nuevo o usado certificado?" },
            {
              from: "bot",
              text: "",
              options: [
                { label: "Nuevo (con garantia de fabrica)", value: "nuevo" },
                { label: "Usado certificado (mas economico)", value: "usado" },
                { label: "Me da igual, recomiendame", value: "cualquiera" },
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

        setTimeout(() => {
          addMessages([
            {
              from: "bot",
              text: `Basado en tu operacion, te recomiendo:\n\n**${rec.name}** (${rec.type})\n\n${rec.why}\n\nCondicion: ${value === "nuevo" ? "Nuevo" : value === "usado" ? "Usado certificado" : "Disponible en ambas opciones"}`,
            },
            {
              from: "bot",
              text: "Quieres que un asesor te contacte con precio y disponibilidad?",
              options: [
                { label: "Si, por WhatsApp", value: "whatsapp" },
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
          const rec = recommendations[`${answers.environment}-${answers.capacity}-${answers.budget}`] || recommendations["mixto-medio-economico"];
          const msg = `Hola, el chatbot me recomendo un ${rec.name} (${rec.type}) para mi operacion. Me interesa recibir cotizacion. Condicion preferida: ${answers.condition}`;
          window.open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`, "_blank");
        } else {
          setMessages([]);
          setAnswers({ use: "", environment: "", capacity: "", budget: "", condition: "" });
          startChat();
        }
        break;
    }
  };

  return (
    <>
      {/* Chat button */}
      {!isOpen && (
        <button
          onClick={startChat}
          className="fixed bottom-6 right-24 z-50 bg-brand-navy text-white px-5 py-3 rounded-full shadow-lg hover:bg-brand-navy-light transition-all flex items-center gap-2 animate-fade-in"
        >
          <svg className="w-5 h-5 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
          <span className="text-sm font-semibold">Asesor virtual</span>
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
                <p className="text-white/50 text-xs">Seleccion de equipos</p>
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
        </div>
      )}
    </>
  );
}
