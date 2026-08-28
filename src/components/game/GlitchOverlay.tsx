import { useEffect, useState } from "react";

type Props = {
  /** Se llama cuando el jugador acepta volver a la ruleta. */
  onExit: () => void;
};

/** Fallo visual interactivo que expulsa al jugador de vuelta a la ruleta. */
export function GlitchOverlay({ onExit }: Props) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setReady(true), 2200);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/95 px-6">
      <div className="grain-overlay pointer-events-none absolute inset-0 opacity-40 animate-glitch" />
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, oklch(0.7 0.15 62 / 0.35) 0px, transparent 2px, transparent 4px)",
        }}
      />
      <div className="relative max-w-lg text-center">
        <h2 className="animate-glitch font-display text-3xl text-ember sm:text-5xl">
          MEMORIA INTERRUMPIDA
        </h2>
        <p className="mt-5 font-body text-lg text-parchment/80">
          Las páginas se rompen: la descendencia de los chircales se dispersa en el
          tiempo. El libro no puede seguir sin volver a la rueda.
        </p>
        {ready && (
          <button
            onClick={onExit}
            className="mt-9 animate-fade-in rounded-full border border-ember/60 bg-transparent px-10 py-4 font-display text-xs uppercase tracking-[0.4em] text-ember transition hover:bg-ember hover:text-ink"
          >
            Reparar la línea del tiempo
          </button>
        )}
      </div>
    </div>
  );
}
