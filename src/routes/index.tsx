import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ERAS, ENDING } from "@/data/gameContent";
import { Roulette } from "@/components/game/Roulette";
import { PopupBook } from "@/components/game/PopupBook";
import { GlitchOverlay } from "@/components/game/GlitchOverlay";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nuestra historia en tus manos | Raíz de Barro" },
      {
        name: "description",
        content:
          "Videojuego histórico tipo libro pop-up sobre los chircales de Bogotá y la Biblioteca Comunitaria Raíz de Barro.",
      },
      { property: "og:title", content: "Nuestra historia en tus manos" },
      {
        property: "og:description",
        content:
          "Gira la ruleta del tiempo y recorre un libro pop-up: del barro de los chircales a la Biblioteca Raíz de Barro.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Game,
});

type Phase = "roulette-1" | "era-1" | "glitch" | "roulette-2" | "era-2" | "ending";

function Game() {
  const [phase, setPhase] = useState<Phase>("roulette-1");

  return (
    <main className="relative min-h-screen">
      {phase === "roulette-1" && (
        <Roulette
          targetYear={ERAS[0].year}
          title="Nuestra historia en tus manos"
          subtitle="Biblioteca Comunitaria Raíz de Barro"
          onFinish={() => setPhase("era-1")}
        />
      )}

      {phase === "era-1" && (
        <PopupBook era={ERAS[0]} onComplete={() => setPhase("glitch")} />
      )}

      {phase === "glitch" && <GlitchOverlay onExit={() => setPhase("roulette-2")} />}

      {phase === "roulette-2" && (
        <Roulette
          broken
          targetYear={ERAS[1].year}
          title="La rueda vuelve a girar"
          subtitle="Reiniciando la memoria"
          onFinish={() => setPhase("era-2")}
        />
      )}

      {phase === "era-2" && (
        <PopupBook era={ERAS[1]} onComplete={() => setPhase("ending")} />
      )}

      {phase === "ending" && (
        <section className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
          <div className="grain-overlay pointer-events-none absolute inset-0 opacity-50" />
          <div className="vignette pointer-events-none absolute inset-0" />
          <div className="relative z-10 max-w-2xl animate-fade-in">
            <h2 className="text-4xl leading-tight text-gold sm:text-6xl">
              {ENDING.title}
            </h2>
            <p className="mt-6 font-body text-xl text-parchment/80">{ENDING.text}</p>
            <button
              onClick={() => setPhase("roulette-1")}
              className="mt-10 rounded-full border border-gold/50 bg-primary px-10 py-4 font-display text-xs uppercase tracking-[0.35em] text-primary-foreground transition hover:scale-105"
            >
              Volver a girar la rueda
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
