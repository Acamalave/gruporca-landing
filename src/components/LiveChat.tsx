"use client";
import { useState, useEffect, useRef } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, Timestamp } from "firebase/firestore";
import { ensureVisitor } from "@/lib/visitor";
import { sendVisitorMessage } from "@/lib/chat";
import { useChatAvailability } from "@/hooks/useChatAvailability";
import { beep } from "@/lib/notify";

type Msg = { id: string; from?: string; text?: string; createdAt?: Timestamp };

export default function LiveChat() {
  const available = useChatAvailability();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [started, setStarted] = useState(false);
  const [unread, setUnread] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const seenAgent = useRef(-1);

  // Escucha los mensajes mientras el chat esté disponible o abierto (así recibe
  // respuestas aunque tenga la ventana cerrada).
  useEffect(() => {
    if (!available && !open) return;
    let unsub = () => {};
    ensureVisitor().then((id) => {
      if (!id) return;
      const q = query(collection(db, "chats", id, "messages"), orderBy("createdAt", "asc"));
      unsub = onSnapshot(q, (snap) => {
        const msgs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Msg));
        setMessages(msgs);
        setStarted(true);
        const agentCount = msgs.filter((m) => m.from === "agent").length;
        if (seenAgent.current < 0) {
          seenAgent.current = agentCount; // base inicial, sin avisar
        } else if (agentCount > seenAgent.current) {
          if (!open) {
            setUnread((u) => u + (agentCount - seenAgent.current));
            beep();
          }
          seenAgent.current = agentCount;
        }
      });
    });
    return () => unsub();
  }, [available, open]);

  // Al abrir, marca como leído
  useEffect(() => {
    if (open) setUnread(0);
  }, [open]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, open]);

  // Oculta el botón cuando no hay asesor disponible (salvo que ya tengas el chat abierto).
  if (!available && !open) return null;

  const send = async () => {
    const t = text.trim();
    if (!t) return;
    setText("");
    await sendVisitorMessage(t);
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Chat en vivo"
          className="fixed bottom-6 right-[88px] sm:right-24 z-50 bg-brand-navy text-white p-4 sm:px-5 sm:py-3 rounded-full shadow-lg hover:bg-brand-navy-light transition-all flex items-center gap-2 animate-fade-in"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
          </span>
          <span className="hidden sm:inline text-sm font-semibold">Chat en vivo</span>
          {unread > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
              {unread}
            </span>
          )}
        </button>
      )}

      {open && (
        <div className="fixed bottom-6 right-6 z-[55] w-[360px] max-w-[calc(100vw-48px)] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-fade-in-up flex flex-col" style={{ maxHeight: "min(600px, calc(100vh - 100px))" }}>
          {/* Header */}
          <div className="bg-brand-navy p-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-brand-gold/20 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              </div>
              <div>
                <p className="text-white text-sm font-bold">Chat con un asesor</p>
                <p className="text-xs flex items-center gap-1.5">
                  {available ? (
                    <span className="text-green-400 flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-400" /> En línea</span>
                  ) : (
                    <span className="text-white/40">Asesor desconectado</span>
                  )}
                </p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/50 hover:text-white transition-colors" aria-label="Cerrar">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[180px]">
            {messages.length === 0 && started && (
              <p className="text-center text-brand-muted text-sm py-6">Escríbenos tu consulta y un asesor te responderá aquí mismo.</p>
            )}
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-line ${m.from === "user" ? "bg-brand-navy text-white rounded-br-sm" : "bg-gray-100 text-brand-navy rounded-bl-sm"}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {!available && (
              <p className="text-center text-brand-muted text-xs py-2">El asesor se desconectó. Te responderemos en cuanto vuelva, o escríbenos por WhatsApp.</p>
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-100 flex items-center gap-2 shrink-0">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Escribe tu mensaje…"
              className="flex-1 bg-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-gold/30"
            />
            <button onClick={send} disabled={!text.trim()} className="bg-brand-gold disabled:opacity-50 text-brand-navy font-bold w-10 h-10 rounded-xl flex items-center justify-center shrink-0" aria-label="Enviar">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
