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
  const [turning, setTurning] = useState(false);

  useEffect(() => {
    setIndex(0);
    setOpened(false);
    setSolvedIds([]);
    const t = window.setTimeout(() => setOpened(true), 120);
    return () => window.clearTimeout(t);
  }, [era]);

  const page = era.pages[index];
  const locked = !!page.challenge && !solvedIds.includes(page.id);

  const go = (dir: 1 | -1) => {
    if (turning) return;
    if (dir === 1 && index === era.pages.length - 1) {
      onComplete();
      return;
    }
    const next = index + dir;
    if (next < 0) return;
    setTurning(true);
    window.setTimeout(() => {
      setIndex(next);
      setTurning(false);
    }, 320);
  };

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-4 py-10">
      <div className="grain-overlay pointer-events-none absolute inset-0 opacity-50" />
      <div className="vignette pointer-events-none absolute inset-0" />

      <header className="relative z-10 mb-6 text-center animate-fade-in">
        <p className="font-display text-[0.65rem] uppercase tracking-[0.5em] text-ember/80">
          {era.year} · {era.name}
        </p>
        <p className="mt-2 font-body text-sm text-parchment/60">{era.subtitle}</p>
      </header>

      {/* Libro */}
      <div
        className="relative z-10 w-full max-w-6xl"
        style={{ perspective: "2200px" }}
      >
        <div
          className="relative grid overflow-hidden rounded-lg border border-gold/30 shadow-[var(--shadow-book)] transition-transform duration-700 md:grid-cols-2"
          style={{
            transform: opened
              ? "rotateX(0deg) scale(1)"
              : "rotateX(72deg) scale(0.92)",
            transformOrigin: "bottom center",
            opacity: opened ? 1 : 0,
          }}
        >
          {/* Página izquierda: escena pop-up */}
          <div className="paper relative flex min-h-[16rem] items-center justify-center overflow-hidden p-4 sm:p-6">
            <div
              key={page.id + "-img"}
              className="animate-rise w-full"
              style={{ boxShadow: "var(--shadow-pop)" }}
            >
              <img
                src={page.image}
                alt={page.imageAlt}
                width={1536}
                height={1024}
                loading={index === 0 ? "eager" : "lazy"}
                className="w-full rounded-sm object-cover"
              />
            </div>
            {/* capas de relieve de cartón */}
            <div className="pointer-events-none absolute inset-x-6 bottom-3 h-3 rounded-full bg-ink/25 blur-md" />
          </div>

          {/* Página derecha: texto */}
          <div className="paper relative flex flex-col justify-between p-6 text-ink sm:p-10">
            <div
              key={page.id + "-text"}
              className={`animate-fade-in ${turning ? "opacity-0" : ""} transition-opacity duration-300`}
            >
              <p className="font-display text-[0.65rem] uppercase tracking-[0.4em] text-clay">
                {page.eyebrow}
              </p>
              <h2 className="mt-4 text-2xl leading-tight text-ink sm:text-4xl">
                {page.title}
              </h2>
              <div className="mt-5 h-px w-24 bg-clay/40" />
              {/* PLACEHOLDER DE NARRACIÓN — editable en src/data/gameContent.ts */}
              <p className="mt-5 font-body text-lg leading-relaxed text-ink/85 sm:text-xl">
                {page.narration}
              </p>
              {page.quote && (
                <p className="mt-6 border-l-2 border-ember/70 pl-4 font-body text-lg italic text-clay">
                  {page.quote}
                </p>
              )}
            </div>

            {/* Navegación */}
            <div className="mt-10 flex items-center justify-between">
              <button
                onClick={() => go(-1)}
                disabled={index === 0}
                className="rounded-full border border-clay/40 px-6 py-3 font-display text-[0.6rem] uppercase tracking-[0.3em] text-ink transition hover:bg-clay hover:text-primary-foreground disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink"
              >
                ← Anterior
              </button>
              <span className="font-display text-xs tracking-[0.3em] text-clay">
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

          {/* Lomo del libro */}
          <div className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-8 -translate-x-1/2 bg-gradient-to-r from-ink/35 via-ink/10 to-ink/35 md:block" />

          {locked && page.challenge && (
            <ChallengePanel
              key={page.id}
              challenge={page.challenge}
              onSolved={() => setSolvedIds((s) => [...s, page.id])}
            />
          )}
        </div>
      </div>
    </section>
  );
}
