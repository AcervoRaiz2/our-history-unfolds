import { useState } from "react";
import { ROULETTE_YEARS } from "@/data/gameContent";

type Props = {
  /** Año en el que la ruleta DEBE detenerse (obligatorio por guion). */
  targetYear: number;
  title: string;
  subtitle: string;
  tagline: string;
  /** Casillas visibles de la ruleta (editables). */
  years?: number[];
  labels: { spin: string; spinning: string; landedPrefix: string; opening: string };
  /** Estética de fallo/reinicio para el segundo giro. */
  broken?: boolean;
  onFinish: (year: number) => void;
};

export function Roulette({
  targetYear,
  title,
  subtitle,
  tagline,
  years,
  labels,
  broken,
  onFinish,
}: Props) {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [landed, setLanded] = useState(false);

  const wheelYears = years?.length ? years : [...ROULETTE_YEARS];
  const SECTOR_DEG = 360 / wheelYears.length;

  const spin = () => {
    if (spinning || landed) return;
    const index = wheelYears.indexOf(targetYear);
    const safeIndex = index < 0 ? 0 : index;
    // La aguja apunta arriba (12 en punto). Centramos el sector objetivo ahí.
    const target = 360 * 6 - (safeIndex * SECTOR_DEG + SECTOR_DEG / 2);
    setSpinning(true);
    setRotation(target);
    window.setTimeout(() => {
      setSpinning(false);
      setLanded(true);
      window.setTimeout(() => onFinish(targetYear), 1400);
    }, 4600);
  };

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-16">
      <div className="grain-overlay pointer-events-none absolute inset-0 opacity-60" />
      <div className="vignette pointer-events-none absolute inset-0" />

      <header className="relative z-10 mb-10 max-w-2xl text-center animate-fade-in">
        <p className="font-display text-xs uppercase tracking-[0.5em] text-ember/80">
          {subtitle}
        </p>
        <h1
          className={`mt-4 text-4xl leading-tight text-gold sm:text-6xl ${
            broken ? "animate-glitch" : ""
          }`}
        >
          {title}
        </h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-parchment/70">{tagline}</p>
      </header>

      <div className="relative z-10 flex flex-col items-center">
        {/* Aguja */}
        <div className="relative z-20 -mb-3 h-0 w-0 border-x-[14px] border-t-[26px] border-x-transparent border-t-ember drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)]" />

        <div
          className="relative rounded-full p-3"
          style={{ boxShadow: "var(--shadow-glow)" }}
        >
          <div className="rounded-full border-[10px] border-secondary/70 bg-secondary/40 p-2 shadow-[var(--shadow-book)]">
            <div
              className="relative h-[19rem] w-[19rem] rounded-full sm:h-[24rem] sm:w-[24rem]"
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: spinning
                  ? "transform 4.6s cubic-bezier(0.12, 0.72, 0.06, 1)"
                  : undefined,
              }}
            >
              <svg viewBox="0 0 200 200" className="h-full w-full">
                <defs>
                  <radialGradient id="wheelFace" cx="50%" cy="35%">
                    <stop offset="0%" stopColor="oklch(0.95 0.03 86)" />
                    <stop offset="100%" stopColor="oklch(0.82 0.06 74)" />
                  </radialGradient>
                </defs>
                <circle cx="100" cy="100" r="99" fill="url(#wheelFace)" />
                {wheelYears.map((year, i) => {
                  const start = (i * SECTOR_DEG - 90) * (Math.PI / 180);
                  const end = ((i + 1) * SECTOR_DEG - 90) * (Math.PI / 180);
                  const x1 = 100 + 99 * Math.cos(start);
                  const y1 = 100 + 99 * Math.sin(start);
                  const x2 = 100 + 99 * Math.cos(end);
                  const y2 = 100 + 99 * Math.sin(end);
                  const mid = i * SECTOR_DEG + SECTOR_DEG / 2;
                  const isTarget = year === targetYear;
                  return (
                    <g key={year}>
                      <path
                        d={`M100 100 L ${x1} ${y1} A 99 99 0 0 1 ${x2} ${y2} Z`}
                        fill={
                          isTarget && landed
                            ? "oklch(0.7 0.15 62)"
                            : i % 2 === 0
                              ? "oklch(0.53 0.14 45 / 0.85)"
                              : "oklch(0.38 0.05 60 / 0.7)"
                        }
                        stroke="oklch(0.78 0.12 82 / 0.55)"
                        strokeWidth="0.8"
                      />
                      <text
                        x="100"
                        y="24"
                        textAnchor="middle"
                        fontSize="13"
                        letterSpacing="1"
                        fill="oklch(0.96 0.02 85)"
                        fontFamily="Cinzel, serif"
                        transform={`rotate(${mid} 100 100)`}
                      >
                        {year}
                      </text>
                    </g>
                  );
                })}
                <circle
                  cx="100"
                  cy="100"
                  r="99"
                  fill="none"
                  stroke="oklch(0.78 0.12 82)"
                  strokeWidth="2"
                />
                <circle cx="100" cy="100" r="18" fill="oklch(0.28 0.045 45)" />
                <circle
                  cx="100"
                  cy="100"
                  r="18"
                  fill="none"
                  stroke="oklch(0.78 0.12 82)"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>
        </div>

        <button
          onClick={spin}
          disabled={spinning || landed}
          className="mt-10 rounded-full border border-gold/50 bg-primary px-12 py-4 font-display text-sm uppercase tracking-[0.35em] text-primary-foreground shadow-[var(--shadow-pop)] transition hover:scale-105 hover:brightness-110 disabled:opacity-50 disabled:hover:scale-100"
        >
          {landed
            ? `${labels.landedPrefix} ${targetYear}`.trim()
            : spinning
              ? labels.spinning
              : labels.spin}
        </button>

        {landed && (
          <p className="mt-5 animate-fade-in font-display text-lg tracking-[0.3em] text-ember">
            {labels.opening}
          </p>
        )}
      </div>
    </section>
  );
}
