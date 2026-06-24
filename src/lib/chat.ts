// Chat en vivo: presencia (disponibilidad) y envío de mensajes.
import { db } from "@/lib/firebase";
import { doc, setDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ensureVisitor } from "@/lib/visitor";

export const HEARTBEAT_STALE_MS = 90_000;

// --- Admin: disponibilidad ---
export async function setChatAvailable(available: boolean) {
  await setDoc(
    doc(db, "settings", "chat"),
    { available, heartbeat: serverTimestamp() },
    { merge: true }
  );
}

export async function chatHeartbeat() {
  await setDoc(doc(db, "settings", "chat"), { heartbeat: serverTimestamp() }, { merge: true });
}

// --- Visitante: enviar mensaje (crea la conversación si no existe) ---
export async function sendVisitorMessage(
  text: string,
  info?: { nombre?: string; whatsapp?: string }
): Promise<void> {
  const uid = await ensureVisitor();
  if (!uid) return;
  await setDoc(
    doc(db, "chats", uid),
    {
      visitorId: uid,
      ...(info?.nombre ? { nombre: info.nombre } : {}),
      ...(info?.whatsapp ? { whatsapp: info.whatsapp } : {}),
      lastMessage: text.slice(0, 140),
      lastFrom: "user",
      lastAt: serverTimestamp(),
    },
    { merge: true }
  );
  await addDoc(collection(db, "chats", uid, "messages"), {
    from: "user",
    text,
    createdAt: serverTimestamp(),
  });
}

// --- Admin: responder a una conversación ---
export async function sendAgentMessage(cid: string, text: string): Promise<void> {
  await setDoc(
    doc(db, "chats", cid),
    { lastMessage: text.slice(0, 140), lastFrom: "agent", lastAt: serverTimestamp() },
    { merge: true }
  );
  await addDoc(collection(db, "chats", cid, "messages"), {
    from: "agent",
    text,
    createdAt: serverTimestamp(),
  });
}
