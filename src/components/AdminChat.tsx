"use client";
import { useState, useEffect, useRef } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, Timestamp } from "firebase/firestore";
import { sendAgentMessage } from "@/lib/chat";

export type ChatConv = {
  id: string;
  visitorId?: string;
  nombre?: string;
  whatsapp?: string;
  lastMessage?: string;
  lastFrom?: string;
  lastAt?: Timestamp | null;
};

type Msg = { id: string; from?: string; text?: string; createdAt?: Timestamp };

function fmtTime(ts?: Timestamp | null) {
  if (!ts || typeof ts.toDate !== "function") return "";
  return ts.toDate().toLocaleString("es-VE", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
}

export default function AdminChat({ chats }: { chats: ChatConv[] }) {
  const [active, setActive] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) {
      setMessages([]);
      return;
    }
    const q = query(collection(db, "chats", active, "messages"), orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, (snap) => setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Msg))));
    return () => unsub();
  }, [active]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const activeConv = chats.find((c) => c.id === active) || null;

  const send = async () => {
    const t = text.trim();
    if (!t || !active) return;
    setText("");
    await sendAgentMessage(active, t);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden flex flex-col sm:flex-row" style={{ minHeight: 420 }}>
      {/* Lista de conversaciones */}
      <div className="sm:w-72 border-b sm:border-b-0 sm:border-r border-gray-100 overflow-y-auto max-h-[200px] sm:max-h-[460px] shrink-0">
        {chats.length === 0 ? (
          <p className="p-4 text-brand-muted text-sm">No hay conversaciones aún.</p>
        ) : (
          chats.map((c) => (
            <button
              key={c.id}
              onClick={() => setActive(c.id)}
              className={`w-full text-left p-3 border-b border-gray-50 transition-colors ${active === c.id ? "bg-brand-cream" : "hover:bg-gray-50"}`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-brand-navy text-sm truncate">{c.nombre || `Visitante ${c.id.slice(0, 6)}`}</span>
                <span className="text-[10px] text-brand-muted shrink-0">{fmtTime(c.lastAt)}</span>
              </div>
              <p className={`text-xs truncate mt-0.5 ${c.lastFrom === "user" ? "text-brand-navy font-medium" : "text-brand-muted"}`}>
                {c.lastFrom === "user" ? "• " : ""}{c.lastMessage || ""}
              </p>
            </button>
          ))
        )}
      </div>

      {/* Conversación */}
      <div className="flex-1 flex flex-col min-h-[300px]">
        {!activeConv ? (
          <div className="flex-1 flex items-center justify-center text-brand-muted text-sm p-6">
            Selecciona una conversación para responder.
          </div>
        ) : (
          <>
            <div className="p-3 border-b border-gray-100">
              <p className="font-bold text-brand-navy text-sm">{activeConv.nombre || `Visitante ${activeConv.id.slice(0, 6)}`}</p>
              {activeConv.whatsapp && <p className="text-xs text-brand-muted">WhatsApp: {activeConv.whatsapp}</p>}
            </div>
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[340px]">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.from === "agent" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm whitespace-pre-line ${m.from === "agent" ? "bg-brand-gold text-brand-navy rounded-br-sm" : "bg-gray-100 text-brand-navy rounded-bl-sm"}`}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-gray-100 flex items-center gap-2">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Escribe tu respuesta…"
                className="flex-1 bg-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-gold/30"
              />
              <button onClick={send} disabled={!text.trim()} className="bg-brand-navy disabled:opacity-50 text-brand-gold font-bold px-5 py-2.5 rounded-xl text-sm">
                Enviar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
