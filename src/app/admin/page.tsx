"use client";
import { useState, useEffect, useMemo } from "react";
import { auth, db } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { collection, getDocs, orderBy, query, Timestamp } from "firebase/firestore";

type Lead = {
  id: string;
  nombre?: string;
  empresa?: string;
  whatsapp?: string;
  necesidad?: string;
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
  const [loadingData, setLoadingData] = useState(false);
  const [dataError, setDataError] = useState("");
  const [tab, setTab] = useState<"leads" | "parts">("leads");

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
      const [leadsSnap, partsSnap] = await Promise.all([
        getDocs(query(collection(db, "leads"), orderBy("createdAt", "desc"))),
        getDocs(query(collection(db, "partsQuotes"), orderBy("createdAt", "desc"))),
      ]);
      setLeads(leadsSnap.docs.map((d) => ({ id: d.id, ...d.data() } as Lead)));
      setParts(partsSnap.docs.map((d) => ({ id: d.id, ...d.data() } as Lead)));
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setDataError("No se pudieron cargar los datos. " + msg);
    }
    setLoadingData(false);
  };

  useEffect(() => {
    if (user) loadData();
  }, [user]);

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
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const recent = (arr: Lead[]) =>
      arr.filter((l) => l.createdAt?.toDate && l.createdAt.toDate().getTime() > weekAgo).length;
    const urgentLeads = leads.filter((l) => l.urgencia === "inmediato").length;
    return {
      totalLeads: leads.length,
      totalParts: parts.length,
      recentLeads: recent(leads),
      urgentLeads,
    };
  }, [leads, parts]);

  // --- Login screen ---
  if (!authReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-cream">
        <p className="text-brand-muted text-sm">Cargando…</p>
      </div>
    );
  }

  if (!user) {
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
  const rows = tab === "leads" ? leads : parts;

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
            { label: "Cotizaciones", value: stats.totalLeads },
            { label: "Solicitudes de repuestos", value: stats.totalParts },
            { label: "Cotizaciones (últimos 7 días)", value: stats.recentLeads },
            { label: "Marcadas como urgentes", value: stats.urgentLeads },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-5">
              <p className="text-3xl font-black text-brand-navy">{s.value}</p>
              <p className="text-brand-muted text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
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
        </div>

        {dataError && <p className="text-red-500 text-sm mb-4">{dataError}</p>}
        {loadingData ? (
          <p className="text-brand-muted text-sm">Cargando datos…</p>
        ) : rows.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-10 text-center text-brand-muted text-sm">
            Aún no hay registros en esta sección.
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
                {rows.map((r) => {
                  const wa = waLink(r.whatsapp);
                  return (
                    <tr key={r.id} className="border-b border-gray-50 hover:bg-brand-cream/40">
                      <td className="p-3 text-brand-muted whitespace-nowrap">{fmtDate(r.createdAt)}</td>
                      <td className="p-3 font-semibold text-brand-navy">{r.nombre || "—"}</td>
                      {tab === "leads" ? (
                        <>
                          <td className="p-3 text-brand-muted">{r.empresa || "—"}</td>
                          <td className="p-3 text-brand-navy">{necesidadLabels[r.necesidad || ""] || r.necesidad || "—"}</td>
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
