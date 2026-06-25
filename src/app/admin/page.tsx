"use client";
import { useState, useEffect, useMemo, useRef } from "react";
import { auth, db } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { collection, getDocs, orderBy, query, limit, onSnapshot, doc, Timestamp } from "firebase/firestore";
import { setChatAvailable, chatHeartbeat } from "@/lib/chat";
import { beep, osNotify, primeAudio, requestNotifyPermission } from "@/lib/notify";
import AdminChat, { type ChatConv } from "@/components/AdminChat";

type Lead = {
  id: string;
  nombre?: string;
  empresa?: string;
  whatsapp?: string;
  necesidad?: string;
  necesidades?: string[];
  comentarios?: string;
  urgencia?: string;
  source?: string;
  status?: string;
  // Repuestos
  brand?: string;
  model?: string;
  category?: string;
  description?: string;
  partNumber?: string;
  createdAt?: Timestamp | null;
};

type Search = {
  id: string;
  type?: string; // "finder" | "chatbot"
  // finder
  equipo?: string;
  opcion?: string;
  capacidad?: string;
  // chatbot
  uso?: string;
  ambiente?: string;
  presupuesto?: string;
  condicion?: string;
  recomendado?: string;
  createdAt?: Timestamp | null;
};

type Visitor = {
  id: string;
  nombre?: string;
  whatsapp?: string;
  empresa?: string;
  identified?: boolean;
  visitCount?: number;
  referrer?: string;
  utmSource?: string;
  firstSeen?: Timestamp | null;
  lastSeen?: Timestamp | null;
};

type VisitEvent = {
  id: string;
  visitorId?: string;
  type?: string;
  detail?: Record<string, unknown>;
  createdAt?: Timestamp | null;
};

const eventLabels: Record<string, string> = {
  lead: "Cotización enviada",
  parts: "Solicitud de repuesto",
  search_finder: "Usó el buscador",
  search_chatbot: "Usó el asesor virtual",
  equipment_click: "Consultó precio de equipo",
  compare: "Comparó equipos",
  calc_tco: "Usó calculadora TCO",
  freight: "Estimó flete",
  service_lookup: "Consultó seguimiento",
};

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

function fmtDate(ts?: Timestamp | null) {
  if (!ts || typeof ts.toDate !== "function") return "—";
  return ts.toDate().toLocaleString("es-VE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function waLink(phone?: string) {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  if (!digits) return null;
  const intl = digits.startsWith("58") ? digits : digits.startsWith("0") ? "58" + digits.slice(1) : digits;
  return `https://wa.me/${intl}`;
}

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const [leads, setLeads] = useState<Lead[]>([]);
  const [parts, setParts] = useState<Lead[]>([]);
  const [searches, setSearches] = useState<Search[]>([]);
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [events, setEvents] = useState<VisitEvent[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [dataError, setDataError] = useState("");
  const [tab, setTab] = useState<"visitors" | "leads" | "parts" | "searches" | "events" | "chat">("visitors");
  const [chatAvailable, setChatAvailableState] = useState(false);
  const [chats, setChats] = useState<ChatConv[]>([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthReady(true);
    });
    return () => unsub();
  }, []);

  const loadData = async () => {
    setLoadingData(true);
    setDataError("");
    try {
      const [leadsSnap, partsSnap, searchesSnap, visitorsSnap, eventsSnap] = await Promise.all([
        getDocs(query(collection(db, "leads"), orderBy("createdAt", "desc"))),
        getDocs(query(collection(db, "partsQuotes"), orderBy("createdAt", "desc"))),
        getDocs(query(collection(db, "searches"), orderBy("createdAt", "desc"))),
        getDocs(query(collection(db, "visitors"), orderBy("lastSeen", "desc"))),
        getDocs(query(collection(db, "events"), orderBy("createdAt", "desc"), limit(200))),
      ]);
      setLeads(leadsSnap.docs.map((d) => ({ id: d.id, ...d.data() } as Lead)));
      setParts(partsSnap.docs.map((d) => ({ id: d.id, ...d.data() } as Lead)));
      setSearches(searchesSnap.docs.map((d) => ({ id: d.id, ...d.data() } as Search)));
      setVisitors(visitorsSnap.docs.map((d) => ({ id: d.id, ...d.data() } as Visitor)));
      setEvents(eventsSnap.docs.map((d) => ({ id: d.id, ...d.data() } as VisitEvent)));
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setDataError("No se pudieron cargar los datos. " + msg);
    }
    setLoadingData(false);
  };

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  // Refleja la disponibilidad guardada del chat
  useEffect(() => {
    if (!user || user.isAnonymous) return;
    const unsub = onSnapshot(doc(db, "settings", "chat"), (snap) => {
      setChatAvailableState(!!snap.data()?.available);
    }, () => {});
    return () => unsub();
  }, [user]);

  // Mantiene "vivo" el estado disponible (heartbeat) mientras el panel esté abierto
  useEffect(() => {
    if (!chatAvailable) return;
    chatHeartbeat();
    const t = setInterval(() => chatHeartbeat(), 45_000);
    return () => clearInterval(t);
  }, [chatAvailable]);

  // Suscripción en tiempo real a las conversaciones + notificación de mensajes nuevos
  const chatBaseline = useRef(0);
  const chatInit = useRef(false);
  useEffect(() => {
    if (!user || user.isAnonymous) return;
    const q = query(collection(db, "chats"), orderBy("lastAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as ChatConv));
      // El mensaje entrante (de un visitante) más reciente
      const newestUser = list.reduce((max, c) => {
        const t = c.lastFrom === "user" && c.lastAt?.toMillis ? c.lastAt.toMillis() : 0;
        return t > max ? t : max;
      }, 0);
      if (!chatInit.current) {
        chatInit.current = true;
        chatBaseline.current = newestUser;
      } else if (newestUser > chatBaseline.current) {
        chatBaseline.current = newestUser;
        beep();
        osNotify("Nuevo mensaje de chat", "Un visitante te escribió en el chat en vivo.");
        if (typeof document !== "undefined" && document.hidden) {
          document.title = "💬 Nuevo mensaje — Grupo RCA";
        }
      }
      setChats(list);
    }, () => {});
    return () => unsub();
  }, [user]);

  // Restaura el título al volver a la pestaña
  useEffect(() => {
    const onFocus = () => { document.title = "Panel — Grupo RCA"; };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  const toggleAvailable = async () => {
    const next = !chatAvailable;
    setChatAvailableState(next);
    if (next) {
      primeAudio();
      requestNotifyPermission();
    }
    await setChatAvailable(next);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoggingIn(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch {
      setLoginError("Correo o contraseña incorrectos.");
    }
    setLoggingIn(false);
  };

  const stats = useMemo(() => {
    return {
      totalVisitors: visitors.length,
      identified: visitors.filter((v) => v.identified).length,
      returning: visitors.filter((v) => (v.visitCount || 0) > 1).length,
      totalLeads: leads.length,
    };
  }, [visitors, leads]);

  // --- Login screen ---
  if (!authReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-cream">
        <p className="text-brand-muted text-sm">Cargando…</p>
      </div>
    );
  }

  if (!user || user.isAnonymous) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-navy px-4">
        <form onSubmit={handleLogin} className="w-full max-w-sm bg-white rounded-2xl p-8 shadow-2xl">
          <h1 className="text-2xl font-black text-brand-navy mb-1">Panel Grupo RCA</h1>
          <p className="text-brand-muted text-sm mb-6">Acceso solo para el equipo.</p>
          <label className="block text-sm font-medium text-brand-navy mb-1">Correo</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none text-sm mb-4"
            placeholder="correo@gruporca.com"
          />
          <label className="block text-sm font-medium text-brand-navy mb-1">Contraseña</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/20 outline-none text-sm mb-4"
            placeholder="••••••••"
          />
          {loginError && <p className="text-red-500 text-sm mb-3">{loginError}</p>}
          <button
            type="submit"
            disabled={loggingIn}
            className="w-full bg-brand-gold hover:bg-brand-gold-light disabled:opacity-60 text-brand-navy font-bold py-3 rounded-xl text-sm transition-all"
          >
            {loggingIn ? "Ingresando…" : "Ingresar"}
          </button>
        </form>
      </div>
    );
  }

  // --- Dashboard ---
  const rows: { id: string }[] =
    tab === "leads" ? leads
    : tab === "parts" ? parts
    : tab === "searches" ? searches
    : tab === "visitors" ? visitors
    : events;

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Top bar */}
      <header className="bg-brand-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-black text-lg">Panel de leads — Grupo RCA</h1>
            <p className="text-white/50 text-xs">{user.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleAvailable}
              title="Cuando está disponible, los visitantes pueden chatear en vivo contigo"
              className={`flex items-center gap-2 text-sm font-semibold px-3 py-2 rounded-lg transition-all ${chatAvailable ? "bg-green-500/20 text-green-300" : "bg-white/10 text-white/60 hover:bg-white/20"}`}
            >
              <span className={`w-2.5 h-2.5 rounded-full ${chatAvailable ? "bg-green-400" : "bg-white/40"}`} />
              {chatAvailable ? "Disponible" : "No disponible"}
            </button>
            <button onClick={loadData} className="text-brand-gold text-sm font-semibold hover:underline">
              Actualizar
            </button>
            <button
              onClick={() => signOut(auth)}
              className="bg-white/10 hover:bg-white/20 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Visitantes", value: stats.totalVisitors },
            { label: "Visitantes identificados", value: stats.identified },
            { label: "Visitantes recurrentes", value: stats.returning },
            { label: "Cotizaciones", value: stats.totalLeads },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-5">
              <p className="text-3xl font-black text-brand-navy">{s.value}</p>
              <p className="text-brand-muted text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4 flex-wrap">
          <button
            onClick={() => setTab("chat")}
            className={`relative px-5 py-2 rounded-lg text-sm font-semibold transition-all ${tab === "chat" ? "bg-brand-navy text-brand-gold" : "bg-white border border-gray-200 text-brand-navy"}`}
          >
            Chat en vivo ({chats.length})
            {chats.some((c) => c.lastFrom === "user") && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full ring-2 ring-brand-cream" />
            )}
          </button>
          <button
            onClick={() => setTab("visitors")}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${tab === "visitors" ? "bg-brand-navy text-brand-gold" : "bg-white border border-gray-200 text-brand-navy"}`}
          >
            Visitantes ({visitors.length})
          </button>
          <button
            onClick={() => setTab("leads")}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${tab === "leads" ? "bg-brand-navy text-brand-gold" : "bg-white border border-gray-200 text-brand-navy"}`}
          >
            Cotizaciones ({leads.length})
          </button>
          <button
            onClick={() => setTab("parts")}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${tab === "parts" ? "bg-brand-navy text-brand-gold" : "bg-white border border-gray-200 text-brand-navy"}`}
          >
            Repuestos ({parts.length})
          </button>
          <button
            onClick={() => setTab("searches")}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${tab === "searches" ? "bg-brand-navy text-brand-gold" : "bg-white border border-gray-200 text-brand-navy"}`}
          >
            Búsquedas ({searches.length})
          </button>
          <button
            onClick={() => setTab("events")}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${tab === "events" ? "bg-brand-navy text-brand-gold" : "bg-white border border-gray-200 text-brand-navy"}`}
          >
            Actividad ({events.length})
          </button>
        </div>

        {dataError && <p className="text-red-500 text-sm mb-4">{dataError}</p>}
        {tab === "chat" ? (
          <>
            {!chatAvailable && (
              <p className="mb-3 text-sm text-brand-muted bg-brand-gold/10 border border-brand-gold/30 rounded-lg px-4 py-2">
                Estás <b>No disponible</b>: el chat en vivo no aparece en el sitio. Actívalo con el botón <b>Disponible</b> de arriba para atender en tiempo real.
              </p>
            )}
            <AdminChat chats={chats} />
          </>
        ) : loadingData ? (
          <p className="text-brand-muted text-sm">Cargando datos…</p>
        ) : rows.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-10 text-center text-brand-muted text-sm">
            Aún no hay registros en esta sección.
          </div>
        ) : tab === "visitors" ? (
          <div className="bg-white rounded-xl border border-gray-100 overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-brand-muted">
                  <th className="p-3 font-semibold">Estado</th>
                  <th className="p-3 font-semibold">Contacto</th>
                  <th className="p-3 font-semibold">Visitas</th>
                  <th className="p-3 font-semibold">Primera vez</th>
                  <th className="p-3 font-semibold">Última vez</th>
                  <th className="p-3 font-semibold">Origen</th>
                </tr>
              </thead>
              <tbody>
                {visitors.map((v) => {
                  const wa = waLink(v.whatsapp);
                  const origen = v.utmSource || v.referrer || "Directo";
                  return (
                    <tr key={v.id} className="border-b border-gray-50 hover:bg-brand-cream/40">
                      <td className="p-3">
                        {v.identified ? (
                          <span className="px-2 py-0.5 rounded text-xs font-semibold bg-green-100 text-green-700">Identificado</span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-brand-muted">Anónimo</span>
                        )}
                      </td>
                      <td className="p-3">
                        {v.identified ? (
                          <div>
                            <span className="font-semibold text-brand-navy">{v.nombre || "—"}</span>
                            {v.empresa && <span className="block text-brand-muted text-xs">{v.empresa}</span>}
                            {wa && <a href={wa} target="_blank" rel="noopener noreferrer" className="block text-[#25D366] text-xs font-semibold hover:underline">{v.whatsapp}</a>}
                          </div>
                        ) : (
                          <span className="text-brand-muted text-xs">Sin datos aún</span>
                        )}
                      </td>
                      <td className="p-3">
                        <span className={`font-bold ${(v.visitCount || 0) > 1 ? "text-brand-gold" : "text-brand-navy"}`}>{v.visitCount || 1}</span>
                      </td>
                      <td className="p-3 text-brand-muted whitespace-nowrap">{fmtDate(v.firstSeen)}</td>
                      <td className="p-3 text-brand-muted whitespace-nowrap">{fmtDate(v.lastSeen)}</td>
                      <td className="p-3 text-brand-muted text-xs max-w-[200px] truncate" title={origen}>{origen}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : tab === "events" ? (
          <div className="bg-white rounded-xl border border-gray-100 overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-brand-muted">
                  <th className="p-3 font-semibold">Fecha</th>
                  <th className="p-3 font-semibold">Acción</th>
                  <th className="p-3 font-semibold">Detalle</th>
                  <th className="p-3 font-semibold">Visitante</th>
                </tr>
              </thead>
              <tbody>
                {events.map((ev) => {
                  const det = ev.detail && typeof ev.detail === "object"
                    ? Object.entries(ev.detail).filter(([, v]) => v !== undefined && v !== "").map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : String(v)}`).join(" · ")
                    : "";
                  return (
                    <tr key={ev.id} className="border-b border-gray-50 hover:bg-brand-cream/40">
                      <td className="p-3 text-brand-muted whitespace-nowrap">{fmtDate(ev.createdAt)}</td>
                      <td className="p-3 font-semibold text-brand-navy">{eventLabels[ev.type || ""] || ev.type || "—"}</td>
                      <td className="p-3 text-brand-muted">{det || "—"}</td>
                      <td className="p-3 text-brand-muted text-xs font-mono">{(ev.visitorId || "").slice(0, 8) || "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : tab === "searches" ? (
          <div className="bg-white rounded-xl border border-gray-100 overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-brand-muted">
                  <th className="p-3 font-semibold">Fecha</th>
                  <th className="p-3 font-semibold">Origen</th>
                  <th className="p-3 font-semibold">Detalle</th>
                  <th className="p-3 font-semibold">Recomendado</th>
                </tr>
              </thead>
              <tbody>
                {searches.map((s) => {
                  const detalle = (s.type === "chatbot"
                    ? [["Uso", s.uso], ["Ambiente", s.ambiente], ["Capacidad", s.capacidad], ["Presupuesto", s.presupuesto], ["Condición", s.condicion]]
                    : [["Equipo", s.equipo], ["Opción", s.opcion], ["Capacidad", s.capacidad]]
                  ).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join(" · ");
                  return (
                    <tr key={s.id} className="border-b border-gray-50 hover:bg-brand-cream/40">
                      <td className="p-3 text-brand-muted whitespace-nowrap">{fmtDate(s.createdAt)}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${s.type === "chatbot" ? "bg-blue-100 text-blue-700" : "bg-brand-gold/20 text-brand-navy"}`}>
                          {s.type === "chatbot" ? "Asesor virtual" : "Buscador"}
                        </span>
                      </td>
                      <td className="p-3 text-brand-navy">{detalle || "—"}</td>
                      <td className="p-3 text-brand-muted">{s.recomendado || "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-brand-muted">
                  <th className="p-3 font-semibold">Fecha</th>
                  <th className="p-3 font-semibold">Nombre</th>
                  {tab === "leads" ? (
                    <>
                      <th className="p-3 font-semibold">Empresa</th>
                      <th className="p-3 font-semibold">Necesidad</th>
                    </>
                  ) : (
                    <>
                      <th className="p-3 font-semibold">Equipo</th>
                      <th className="p-3 font-semibold">Repuesto</th>
                    </>
                  )}
                  <th className="p-3 font-semibold">Urgencia</th>
                  <th className="p-3 font-semibold">WhatsApp</th>
                </tr>
              </thead>
              <tbody>
                {(rows as Lead[]).map((r) => {
                  const wa = waLink(r.whatsapp);
                  return (
                    <tr key={r.id} className="border-b border-gray-50 hover:bg-brand-cream/40">
                      <td className="p-3 text-brand-muted whitespace-nowrap">{fmtDate(r.createdAt)}</td>
                      <td className="p-3 font-semibold text-brand-navy">{r.nombre || "—"}</td>
                      {tab === "leads" ? (
                        <>
                          <td className="p-3 text-brand-muted">{r.empresa || "—"}</td>
                          <td className="p-3 text-brand-navy">
                            {r.necesidades && r.necesidades.length
                              ? r.necesidades.map((v) => necesidadLabels[v] || v).join(", ")
                              : necesidadLabels[r.necesidad || ""] || r.necesidad || "—"}
                            {r.comentarios && <span className="block text-brand-muted text-xs mt-0.5">“{r.comentarios}”</span>}
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="p-3 text-brand-muted">{[r.brand, r.model].filter(Boolean).join(" ") || "—"}</td>
                          <td className="p-3 text-brand-navy">
                            <span className="font-medium">{r.category || "—"}</span>
                            {r.description && <span className="block text-brand-muted text-xs">{r.description}</span>}
                            {r.partNumber && <span className="block text-brand-muted text-xs">N° {r.partNumber}</span>}
                          </td>
                        </>
                      )}
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${r.urgencia === "inmediato" || r.urgencia === "urgente" ? "bg-red-100 text-red-700" : "bg-gray-100 text-brand-navy"}`}>
                          {r.urgencia || "—"}
                        </span>
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        {wa ? (
                          <a href={wa} target="_blank" rel="noopener noreferrer" className="text-[#25D366] font-semibold hover:underline">
                            {r.whatsapp}
                          </a>
                        ) : (
                          "—"
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
