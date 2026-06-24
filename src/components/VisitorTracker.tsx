"use client";
import { useEffect, useRef } from "react";
import { registerVisit } from "@/lib/visitor";

// Monta este componente solo en la landing pública (no en /admin).
export default function VisitorTracker() {
  const done = useRef(false);
  useEffect(() => {
    if (done.current) return;
    done.current = true;
    registerVisit();
  }, []);
  return null;
}
