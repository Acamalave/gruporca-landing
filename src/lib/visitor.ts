// Identificación de visitante mediante login anónimo de Firebase.
// Cada navegador obtiene un uid estable que persiste entre visitas, lo que
// permite reconocer al visitante que vuelve y asociar toda su actividad.
import { auth, db } from "@/lib/firebase";
import { signInAnonymously } from "firebase/auth";
import {
  doc,
  setDoc,
  collection,
  addDoc,
  serverTimestamp,
  increment,
} from "firebase/firestore";

let signingIn: Promise<string | null> | null = null;

/** Garantiza una sesión anónima y devuelve el uid del visitante (o null si falla). */
export async function ensureVisitor(): Promise<string | null> {
  if (auth.currentUser) return auth.currentUser.uid;
  if (!signingIn) {
    signingIn = signInAnonymously(auth)
      .then((c) => c.user.uid)
      .catch(() => null)
      .finally(() => {
        signingIn = null;
      });
  }
  return signingIn;
}

/** uid actual si ya hay sesión (sin forzar login). */
export function currentVisitorId(): string | null {
  return auth.currentUser?.uid ?? null;
}

function utmData() {
  if (typeof window === "undefined") return {};
  const p = new URLSearchParams(window.location.search);
  return {
    utmSource: p.get("utm_source") || "",
    utmMedium: p.get("utm_medium") || "",
    utmCampaign: p.get("utm_campaign") || "",
  };
}

/** Registra/actualiza el perfil del visitante en cada visita. */
export async function registerVisit(): Promise<void> {
  const uid = await ensureVisitor();
  if (!uid || typeof window === "undefined") return;
  const ref = doc(db, "visitors", uid);
  const isFirst = !localStorage.getItem("rca_visitor_init");
  const newSession = !sessionStorage.getItem("rca_visit_counted");
  try {
    const base: Record<string, unknown> = { lastSeen: serverTimestamp() };
    if (newSession) {
      base.visitCount = increment(1);
      sessionStorage.setItem("rca_visit_counted", "1");
    }
    if (isFirst) {
      base.firstSeen = serverTimestamp();
      base.referrer = document.referrer || "";
      base.userAgent = navigator.userAgent || "";
      base.identified = false;
      Object.assign(base, utmData());
      localStorage.setItem("rca_visitor_init", "1");
    }
    await setDoc(ref, base, { merge: true });
  } catch {
    /* best-effort */
  }
}

/** Registra un evento de navegación asociado al visitante. */
export async function logEvent(
  type: string,
  detail: Record<string, unknown> = {}
): Promise<void> {
  const uid = await ensureVisitor();
  if (!uid) return;
  try {
    await addDoc(collection(db, "events"), {
      visitorId: uid,
      type,
      detail,
      createdAt: serverTimestamp(),
    });
  } catch {
    /* best-effort */
  }
}

/** Asocia datos de contacto al visitante (cuando deja un formulario). */
export async function identifyVisitor(contact: {
  nombre?: string;
  whatsapp?: string;
  empresa?: string;
}): Promise<string | null> {
  const uid = await ensureVisitor();
  if (!uid) return null;
  try {
    await setDoc(
      doc(db, "visitors", uid),
      { ...contact, identified: true, identifiedAt: serverTimestamp() },
      { merge: true }
    );
  } catch {
    /* best-effort */
  }
  return uid;
}
