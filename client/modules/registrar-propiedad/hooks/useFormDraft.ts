"use client";
import { useCallback, useEffect, useRef, useState } from "react";

const DRAFT_KEY = "registrar-propiedad-draft-v1";
const DEBOUNCE_MS = 1500;

type DraftEntry = {
  data: unknown;
  savedAt: number;
};

// Excluye objetos File (no serializables) recursivamente
function stripFiles(value: unknown): unknown {
  if (value instanceof File) return null;
  if (Array.isArray(value)) {
    return value
      .map(stripFiles)
      .filter((v) => !(v instanceof File) && v !== null);
  }
  if (value !== null && typeof value === "object") {
    const result: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (v instanceof File) continue;
      if (Array.isArray(v) && v.every((item) => item instanceof File)) continue;
      result[k] = stripFiles(v);
    }
    return result;
  }
  return value;
}

export function useFormDraft<T>(
  data: T,
  hydrate: (draft: T) => void,
  options: { skipFirstSave?: boolean } = {}
) {
  const [hasDraft, setHasDraft] = useState(false);
  const [lastSaved, setLastSaved] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initialCheckDone = useRef(false);
  const isFirstSave = useRef(true);

  // Al montar: detectar si hay draft guardado
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (initialCheckDone.current) return;
    initialCheckDone.current = true;
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as DraftEntry;
      if (parsed?.data) {
        setHasDraft(true);
        setLastSaved(parsed.savedAt);
      }
    } catch {
      // ignore
    }
  }, []);

  // Debounced save on data change
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (options.skipFirstSave && isFirstSave.current) {
      isFirstSave.current = false;
      return;
    }
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      try {
        const cleaned = stripFiles(data);
        const entry: DraftEntry = { data: cleaned, savedAt: Date.now() };
        localStorage.setItem(DRAFT_KEY, JSON.stringify(entry));
        setLastSaved(entry.savedAt);
      } catch {
        // localStorage full or serialization failed; ignore silently
      }
    }, DEBOUNCE_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [data, options.skipFirstSave]);

  const restoreDraft = useCallback(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as DraftEntry;
      if (parsed?.data) {
        hydrate(parsed.data as T);
        setHasDraft(false);
      }
    } catch {
      // ignore
    }
  }, [hydrate]);

  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {
      // ignore
    }
    setHasDraft(false);
    setLastSaved(null);
  }, []);

  return { hasDraft, lastSaved, restoreDraft, clearDraft };
}

export function timeAgo(timestamp: number | null): string {
  if (!timestamp) return "";
  const diff = Date.now() - timestamp;
  const sec = Math.floor(diff / 1000);
  if (sec < 5) return "hace un momento";
  if (sec < 60) return `hace ${sec} seg`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `hace ${min} min`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `hace ${hr} h`;
  const days = Math.floor(hr / 24);
  return `hace ${days} d`;
}
