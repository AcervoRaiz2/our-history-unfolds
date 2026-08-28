import { useEffect, useState } from "react";
import type { Era } from "@/data/gameContent";
import { ChallengePanel } from "./ChallengePanel";

type Props = {
  era: Era;
  /** Se llama al intentar avanzar más allá de la última página. */
  onComplete: () => void;
};

export function PopupBook({ era, onComplete }: Props) {
  const [index, setIndex] = useState(0);
  const [opened, setOpened] = useState(false);
  const [solvedIds, setSolvedIds] = useState<string[]>([]);
  const [flip, setFlip] = useState<0 | 1 | -1>(0);

  useEffect(() => {
    setIndex(0);
    setOpened(false);
    setSolvedIds([]);
    const t = window.setTimeout(() => setOpened(true), 150);
    return () => window.clearTimeout(t);
  }, [era]);

  const page = era.pages[index] ?? era.pages[0]!;
  const locked = !!page.challenge && !solvedIds.includes(page.id);

  const go = (dir: 1 | -1) => {
    if (flip !== 0) return;
    if (dir === 1 && index === era.pages.length - 1) {
      onComplete();
      return;
    }
    const next = index + dir;
    if (next < 0) return;
    setFlip(dir);
    window.setTimeout(() => setIndex(next), 430);
    window.setTimeout(() => setFlip(0), 870);
  };

  const flipTarget = era.pages[index + flip] ?? page;

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-4 py-10">
      <div className="grain-overlay pointer-events-none absolute inset-0 opacity-50" />
      <div className="vignette pointer-events-none absolute inset-0" />

      <header className="relative z-10 mb-6 text-center animate-fade-in">
        <p className="font-display text-[0.65rem] uppercase tracking-[0.5em] text-ember/80">
          {era.year} · {era.name}
        </p>
      </header>

      {/* Libro */}
      <div
        className="relative z-10 w-full max-w-5xl"
        style={{ perspective: "2400px" }}
      >
        <div
          className="relative overflow-hidden rounded-lg border border-gold/30 shadow-[var(--shadow-book)] transition-all duration-700"
          style={{
            transform: opened
              ? "rotateX(0deg) scale(1)"
              : "rotateX(74deg) scale(0.9)",
            transformOrigin: "bottom center",
            opacity: opened ? 1 : 0,
          }}
        >
          {/* Hojas base */}
          <div className="grid grid-cols-2">
            <div className="paper min-h-[18rem] sm:min-h-[24rem]" />
            <div className="paper min-h-[18rem] sm:min-h-[24rem]" />
          </div>

          {/* Lomo */}
          <div className="pointer-events-none absolute inset-y-0 left-1/2 w-10 -translate-x-1/2 bg-gradient-to-r from-ink/35 via-ink/12 to-ink/35" />

          {/* Imagen proyectada sobre el libro */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-5 sm:p-10">
            <img
              key={page.id + "-img"}
              src={page.image}
              alt={page.imageAlt}
              width={1536}
              height={1024}
              loading={index === 0 ? "eager" : "lazy"}
              className="animate-rise max-h-[70vh] w-full rounded-sm object-cover"
              style={{ boxShadow: "var(--shadow-pop)" }}
            />
          </div>
          <div className="pointer-events-none absolute inset-x-10 bottom-6 h-4 rounded-full bg-ink/25 blur-lg" />

          {/* Hoja que se pasa */}
          {flip !== 0 && (
            <div
              className="pointer-events-none absolute inset-y-0 left-1/2 w-1/2"
              style={{ perspective: "2400px", zIndex: 20 }}
            >
              <div
                className={
                  flip === 1 ? "animate-leaf-forward" : "animate-leaf-back"
                }
                style={{
                  height: "100%",
                  transformOrigin: "left center",
                  transformStyle: "preserve-3d",
                  ...(flip === -1
                    ? { transform: "rotateY(180deg)", marginLeft: "-100%" }
                    : {}),
                }}
              >
                <div
                  className="paper absolute inset-0 overflow-hidden border-l border-clay/20 shadow-[0_10px_40px_-10px_oklch(0.15_0.04_50/60%)]"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <img
                    src={page.image}
                    alt=""
                    className="h-full w-full object-cover opacity-70"
                  />
                  <div className="absolute inset-0 bg-gradient-to-l from-ink/30 to-transparent" />
                </div>
                <div
                  className="paper absolute inset-0 overflow-hidden"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  <img
                    src={flipTarget.image}
                    alt=""
                    className="h-full w-full object-cover opacity-70"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-ink/30 to-transparent" />
                </div>
              </div>
            </div>
          )}

          {locked && page.challenge && (
            <ChallengePanel
              key={page.id}
              challenge={page.challenge}
              onSolved={() => setSolvedIds((s) => [...s, page.id])}
            />
          )}
        </div>

        {/* Navegación */}
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={() => go(-1)}
            disabled={index === 0}
            className="rounded-full border border-gold/40 px-6 py-3 font-display text-[0.6rem] uppercase tracking-[0.3em] text-parchment transition hover:bg-clay hover:text-primary-foreground disabled:opacity-30"
          >
            ← Anterior
          </button>
          <span className="font-display text-xs tracking-[0.3em] text-parchment/70">
            {index + 1} / {era.pages.length}
          </span>
          <button
            onClick={() => go(1)}
            disabled={locked}
            className="rounded-full bg-clay px-6 py-3 font-display text-[0.6rem] uppercase tracking-[0.3em] text-primary-foreground transition hover:brightness-110 disabled:opacity-40"
          >
            {locked ? "Bloqueado" : "Siguiente →"}
          </button>
        </div>
      </div>
    </section>
  );
}
