import { useMemo, useState } from "react";
import type { Challenge } from "@/data/gameContent";

type Props = {
  challenge: Challenge;
  onSolved: () => void;
};

export function ChallengePanel({ challenge, onSolved }: Props) {
  const [failed, setFailed] = useState(false);
  const [solved, setSolved] = useState(false);

  const solve = () => {
    setSolved(true);
    window.setTimeout(onSolved, 1500);
  };

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-ink/80 p-4 backdrop-blur-sm animate-fade-in">
      <div className="paper grain-overlay relative w-full max-w-xl rounded-lg border border-gold/40 p-6 text-ink shadow-[var(--shadow-book)] sm:p-8">
        <p className="font-display text-[0.65rem] uppercase tracking-[0.4em] text-clay">
          Desafío
        </p>
        <h3 className="mt-3 text-xl leading-snug text-ink sm:text-2xl">
          {challenge.prompt}
        </h3>

        {solved ? (
          <p className="mt-6 animate-rise font-body text-lg italic text-moss">
            ✦ {challenge.successText}
          </p>
        ) : (
          <div className="mt-6">
            {challenge.kind === "quiz" && (
              <QuizBody challenge={challenge} onSolved={solve} onFail={() => setFailed(true)} />
            )}
            {challenge.kind === "order" && (
              <OrderBody challenge={challenge} onSolved={solve} onFail={() => setFailed(true)} />
            )}
            {challenge.kind === "forge" && <ForgeBody challenge={challenge} onSolved={solve} />}

            {failed && "hint" in challenge && challenge.hint && (
              <p className="mt-4 font-body text-sm italic text-clay">Pista: {challenge.hint}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function QuizBody({
  challenge,
  onSolved,
  onFail,
}: {
  challenge: Extract<Challenge, { kind: "quiz" }>;
  onSolved: () => void;
  onFail: () => void;
}) {
  const [wrong, setWrong] = useState<number[]>([]);
  return (
    <ul className="space-y-3">
      {challenge.options.map((opt, i) => (
        <li key={opt}>
          <button
            disabled={wrong.includes(i)}
            onClick={() => {
              if (i === challenge.answerIndex) onSolved();
              else {
                setWrong((w) => [...w, i]);
                onFail();
              }
            }}
            className={`w-full rounded-md border px-4 py-3 text-left font-body text-base transition ${
              wrong.includes(i)
                ? "border-destructive/50 bg-destructive/10 text-ink/40 line-through"
                : "border-clay/40 bg-parchment-deep/50 text-ink hover:border-clay hover:bg-parchment-deep"
            }`}
          >
            {opt}
          </button>
        </li>
      ))}
    </ul>
  );
}

function OrderBody({
  challenge,
  onSolved,
  onFail,
}: {
  challenge: Extract<Challenge, { kind: "order" }>;
  onSolved: () => void;
  onFail: () => void;
}) {
  const shuffled = useMemo(
    () => challenge.steps.map((s, i) => ({ s, i })).sort(() => Math.random() - 0.5),
    [challenge],
  );
  const [picked, setPicked] = useState<number[]>([]);

  const pick = (i: number) => {
    const next = [...picked, i];
    if (i !== picked.length) {
      onFail();
      setPicked([]);
      return;
    }
    setPicked(next);
    if (next.length === challenge.steps.length) onSolved();
  };

  return (
    <>
      <ol className="space-y-2">
        {shuffled.map(({ s, i }) => {
          const order = picked.indexOf(i);
          return (
            <li key={s}>
              <button
                disabled={order >= 0}
                onClick={() => pick(i)}
                className={`flex w-full items-center gap-3 rounded-md border px-4 py-3 text-left font-body text-base transition ${
                  order >= 0
                    ? "border-moss/60 bg-moss/15 text-ink"
                    : "border-clay/40 bg-parchment-deep/50 text-ink hover:border-clay hover:bg-parchment-deep"
                }`}
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-clay/50 font-display text-xs">
                  {order >= 0 ? order + 1 : "·"}
                </span>
                {s}
              </button>
            </li>
          );
        })}
      </ol>
      <p className="mt-4 font-body text-sm italic text-muted-foreground">
        Haz clic en los pasos en el orden correcto. Un error reinicia la secuencia.
      </p>
    </>
  );
}

function ForgeBody({
  challenge,
  onSolved,
}: {
  challenge: Extract<Challenge, { kind: "forge" }>;
  onSolved: () => void;
}) {
  const [taps, setTaps] = useState(0);
  const progress = Math.min(100, (taps / challenge.taps) * 100);

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={() => {
          const next = taps + 1;
          setTaps(next);
          if (next >= challenge.taps) onSolved();
        }}
        className="group relative h-32 w-32 rounded-full bg-clay shadow-[var(--shadow-pop)] transition active:scale-90"
        style={{ transform: `scale(${1 + progress / 500})` }}
        aria-label={challenge.actionLabel}
      >
        <span className="grain-overlay absolute inset-0 rounded-full opacity-70" />
        <span className="relative font-display text-xs uppercase tracking-[0.2em] text-primary-foreground">
          {challenge.actionLabel}
        </span>
      </button>
      <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-parchment-deep">
        <div
          className="h-full rounded-full transition-[width] duration-200"
          style={{ width: `${progress}%`, background: "var(--gradient-gold)" }}
        />
      </div>
      <p className="mt-3 font-display text-xs tracking-[0.3em] text-clay">
        {taps} / {challenge.taps}
      </p>
    </div>
  );
}
