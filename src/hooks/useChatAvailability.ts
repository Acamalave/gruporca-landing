"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { HEARTBEAT_STALE_MS } from "@/lib/chat";

// Devuelve true si un asesor está disponible (toggle activo + heartbeat reciente).
export function useChatAvailability(): boolean {
  const [available, setAvailable] = useState(false);
  const [heartbeat, setHeartbeat] = useState(0);
  const [now, setNow] = useState(0);

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "settings", "chat"),
      (snap) => {
        const d = snap.data();
        setAvailable(!!d?.available);
        const ts = d?.heartbeat;
        setHeartbeat(ts && typeof ts.toMillis === "function" ? ts.toMillis() : 0);
      },
      () => {}
    );
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 20_000);
    return () => {
      unsub();
      clearInterval(t);
    };
  }, []);

  return available && heartbeat > 0 && now - heartbeat < HEARTBEAT_STALE_MS;
}
