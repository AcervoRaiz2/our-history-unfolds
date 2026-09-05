import { useEffect, useState } from "react";
import {
  DEFAULT_CONTENT,
  DEFAULT_UI,
  ROULETTE_YEARS,
  type GameContent,
} from "@/data/gameContent";

/** Completa contenidos antiguos con los campos nuevos. */
export function withDefaults(c: Partial<GameContent>): GameContent {
  const ui = c.ui ?? DEFAULT_UI;
  return {
    eras: c.eras ?? DEFAULT_CONTENT.eras,
    ending: c.ending ?? DEFAULT_CONTENT.ending,
    rouletteYears: c.rouletteYears?.length ? c.rouletteYears : [...ROULETTE_YEARS],
    images: c.images ?? {},
    ui: {
      intro: { ...DEFAULT_UI.intro, ...ui.intro },
      second: { ...DEFAULT_UI.second, ...ui.second },
      roulette: { ...DEFAULT_UI.roulette, ...ui.roulette },
      glitch: { ...DEFAULT_UI.glitch, ...ui.glitch },
      book: { ...DEFAULT_UI.book, ...ui.book },
      ending: { ...DEFAULT_UI.ending, ...ui.ending },
    },
  };
}

const STORAGE_KEY = "raiz-de-barro:content:v1";
const AUTH_KEY = "raiz-de-barro:editor";

/** Credenciales del modo edición (acceso local en este navegador). */
export const EDITOR_EMAIL = "cuentaparacartas6@gmail.com";
export const EDITOR_PASSWORD = "danifisi";

export function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function loadContent(): GameContent {
  if (typeof window === "undefined") return DEFAULT_CONTENT;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_CONTENT;
    const parsed = JSON.parse(raw) as Partial<GameContent>;
    if (!parsed?.eras?.length) return DEFAULT_CONTENT;
    return withDefaults(parsed);
  } catch {
    return DEFAULT_CONTENT;
  }
}

export function saveContent(content: GameContent) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
}

export function resetContent() {
  window.localStorage.removeItem(STORAGE_KEY);
}

export function isEditorUnlocked(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(AUTH_KEY) === "1";
}

export function setEditorUnlocked(value: boolean) {
  if (value) window.localStorage.setItem(AUTH_KEY, "1");
  else window.localStorage.removeItem(AUTH_KEY);
}

/** Contenido del juego, con las ediciones guardadas en este navegador. */
export function useGameContent(): GameContent {
  const [content, setContent] = useState<GameContent>(DEFAULT_CONTENT);
  useEffect(() => {
    setContent(loadContent());
  }, []);
  return content;
}
