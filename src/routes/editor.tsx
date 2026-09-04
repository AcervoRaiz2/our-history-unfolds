import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  DEFAULT_CONTENT,
  IMAGE_LIBRARY,
  resolveImage,
  type Challenge,
  type Era,
  type GameContent,
  type Page,
} from "@/data/gameContent";
import {
  EDITOR_EMAIL,
  EDITOR_PASSWORD,
  clone,
  isEditorUnlocked,
  loadContent,
  resetContent,
  saveContent,
  setEditorUnlocked,
} from "@/lib/gameStore";

export const Route = createFileRoute("/editor")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Modo edición | Nuestra historia en tus manos" },
      {
        name: "description",
        content:
          "Editor privado del juego: ordena páginas, cambia imágenes y desafíos del libro pop-up Raíz de Barro.",
      },
      { property: "og:title", content: "Modo edición · Raíz de Barro" },
      {
        property: "og:description",
        content: "Panel privado para editar páginas, imágenes y desafíos del juego.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: EditorPage,
});

const input =
  "w-full rounded-md border border-clay/40 bg-parchment px-3 py-2 font-body text-sm text-ink outline-none focus:border-clay";
const btn =
  "rounded-full border border-gold/40 px-4 py-2 font-display text-[0.6rem] uppercase tracking-[0.25em] text-parchment transition hover:bg-clay hover:text-primary-foreground";
const btnSolid =
  "rounded-full bg-clay px-5 py-2 font-display text-[0.6rem] uppercase tracking-[0.25em] text-primary-foreground transition hover:brightness-110";

function EditorPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setUnlocked(isEditorUnlocked());
    setReady(true);
  }, []);

  if (!ready) return null;
  if (!unlocked) return <LoginForm onOk={() => setUnlocked(true)} />;
  return <Editor onLogout={() => setUnlocked(false)} />;
}

function LoginForm({ onOk }: { onOk: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  return (
    <main className="relative flex min-h-screen items-center justify-center px-4">
      <div className="vignette pointer-events-none absolute inset-0" />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (email.trim().toLowerCase() === EDITOR_EMAIL && password === EDITOR_PASSWORD) {
            setEditorUnlocked(true);
            onOk();
          } else setError(true);
        }}
        className="paper relative z-10 w-full max-w-sm rounded-lg border border-gold/40 p-8 text-ink shadow-[var(--shadow-book)]"
      >
        <h1 className="text-2xl text-ink">Modo edición</h1>
        <p className="mt-1 font-body text-sm text-ink/70">Acceso privado del juego.</p>
        <label className="mt-6 block font-display text-[0.6rem] uppercase tracking-[0.3em] text-clay">
          Correo
        </label>
        <input
          className={input}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="username"
        />
        <label className="mt-4 block font-display text-[0.6rem] uppercase tracking-[0.3em] text-clay">
          Contraseña
        </label>
        <input
          className={input}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
        {error && (
          <p className="mt-3 font-body text-sm text-destructive">Datos incorrectos.</p>
        )}
        <button type="submit" className={`${btnSolid} mt-6 w-full`}>
          Entrar
        </button>
        <Link to="/" className="mt-4 block text-center font-body text-sm text-clay underline">
          Volver al juego
        </Link>
      </form>
    </main>
  );
}

function Editor({ onLogout }: { onLogout: () => void }) {
  const [content, setContent] = useState<GameContent>(() => clone(DEFAULT_CONTENT));
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setContent(clone(loadContent()));
  }, []);

  const update = (fn: (draft: GameContent) => void) => {
    setContent((prev) => {
      const draft = clone(prev);
      fn(draft);
      return draft;
    });
    setSaved(false);
  };

  const save = () => {
    saveContent(content);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "raiz-de-barro-contenido.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJson = async (file: File) => {
    try {
      const parsed = JSON.parse(await file.text()) as GameContent;
      if (!parsed?.eras?.length) throw new Error("bad");
      setContent(parsed);
      saveContent(parsed);
      setSaved(true);
    } catch {
      window.alert("El archivo JSON no es válido.");
    }
  };

  return (
    <main className="relative min-h-screen px-4 py-10">
      <div className="vignette pointer-events-none absolute inset-0" />
      <div className="relative z-10 mx-auto max-w-4xl">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl text-gold">Modo edición</h1>
            <p className="font-body text-sm text-parchment/70">
              Los cambios se guardan en este navegador. Exporta el JSON para respaldarlo.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/" className={btn}>
              Ver juego
            </Link>
            <button className={btn} onClick={exportJson}>
              Exportar JSON
            </button>
            <button className={btn} onClick={() => fileRef.current?.click()}>
              Importar JSON
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void importJson(f);
                e.target.value = "";
              }}
            />
            <button
              className={btn}
              onClick={() => {
                if (window.confirm("¿Restaurar el contenido original?")) {
                  resetContent();
                  setContent(clone(DEFAULT_CONTENT));
                }
              }}
            >
              Restaurar
            </button>
            <button className={btnSolid} onClick={save}>
              {saved ? "Guardado ✓" : "Guardar"}
            </button>
            <button
              className={btn}
              onClick={() => {
                setEditorUnlocked(false);
                onLogout();
              }}
            >
              Salir
            </button>
          </div>
        </header>

        <div className="mt-8 space-y-8">
          {content.eras.map((era, ei) => (
            <EraEditor
              key={era.id}
              era={era}
              onChange={(fn) => update((d) => fn(d.eras[ei]!))}
              onMoveEra={(dir) =>
                update((d) => {
                  const t = ei + dir;
                  if (t < 0 || t >= d.eras.length) return;
                  const [x] = d.eras.splice(ei, 1);
                  d.eras.splice(t, 0, x!);
                })
              }
              onDeleteEra={() =>
                update((d) => {
                  if (d.eras.length > 1) d.eras.splice(ei, 1);
                })
              }
            />
          ))}

          <button
            className={btn}
            onClick={() =>
              update((d) =>
                d.eras.push({
                  id: `era-${Date.now()}`,
                  year: 2000,
                  name: "Nueva época",
                  subtitle: "",
                  pages: [newPage()],
                }),
              )
            }
          >
            + Agregar época
          </button>

          <section className="paper rounded-lg border border-gold/30 p-6 text-ink">
            <h2 className="text-xl">Pantalla final</h2>
            <input
              className={`${input} mt-3`}
              value={content.ending.title}
              onChange={(e) => update((d) => void (d.ending.title = e.target.value))}
            />
            <textarea
              className={`${input} mt-3`}
              rows={3}
              value={content.ending.text}
              onChange={(e) => update((d) => void (d.ending.text = e.target.value))}
            />
          </section>
        </div>
      </div>
    </main>
  );
}

function newPage(): Page {
  return {
    id: `p-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    eyebrow: "Año · etapa",
    title: "Nueva página",
    image: "chircales",
    imageAlt: "Descripción de la imagen",
  };
}

function EraEditor({
  era,
  onChange,
  onMoveEra,
  onDeleteEra,
}: {
  era: Era;
  onChange: (fn: (era: Era) => void) => void;
  onMoveEra: (dir: 1 | -1) => void;
  onDeleteEra: () => void;
}) {
  return (
    <section className="paper rounded-lg border border-gold/30 p-6 text-ink">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl">Época: {era.name}</h2>
        <div className="flex gap-2">
          <SmallBtn onClick={() => onMoveEra(-1)}>↑</SmallBtn>
          <SmallBtn onClick={() => onMoveEra(1)}>↓</SmallBtn>
          <SmallBtn onClick={onDeleteEra}>Eliminar</SmallBtn>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Field label="Nombre">
          <input
            className={input}
            value={era.name}
            onChange={(e) => onChange((x) => void (x.name = e.target.value))}
          />
        </Field>
        <Field label="Año (parada de la ruleta)">
          <input
            className={input}
            type="number"
            value={era.year}
            onChange={(e) => onChange((x) => void (x.year = Number(e.target.value)))}
          />
        </Field>
        <Field label="Subtítulo">
          <input
            className={input}
            value={era.subtitle}
            onChange={(e) => onChange((x) => void (x.subtitle = e.target.value))}
          />
        </Field>
      </div>

      <div className="mt-6 space-y-4">
        {era.pages.map((page, pi) => (
          <PageEditor
            key={page.id}
            page={page}
            index={pi}
            total={era.pages.length}
            onChange={(fn) => onChange((x) => fn(x.pages[pi]!))}
            onMove={(dir) =>
              onChange((x) => {
                const t = pi + dir;
                if (t < 0 || t >= x.pages.length) return;
                const [p] = x.pages.splice(pi, 1);
                x.pages.splice(t, 0, p!);
              })
            }
            onDelete={() =>
              onChange((x) => {
                if (x.pages.length > 1) x.pages.splice(pi, 1);
              })
            }
            onDuplicate={() =>
              onChange((x) => {
                const copy = clone(page);
                copy.id = `p-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
                x.pages.splice(pi + 1, 0, copy);
              })
            }
          />
        ))}
      </div>

      <button className={`${btn} mt-4 border-clay/50 text-ink`} onClick={() => onChange((x) => x.pages.push(newPage()))}>
        + Agregar página
      </button>
    </section>
  );
}

function PageEditor({
  page,
  index,
  total,
  onChange,
  onMove,
  onDelete,
  onDuplicate,
}: {
  page: Page;
  index: number;
  total: number;
  onChange: (fn: (page: Page) => void) => void;
  onMove: (dir: 1 | -1) => void;
  onDelete: () => void;
  onDuplicate: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-md border border-clay/30 bg-parchment-deep/40 p-4">
      <div className="flex flex-wrap items-center gap-3">
        <img
          src={resolveImage(page.image)}
          alt=""
          className="h-12 w-16 rounded object-cover"
        />
        <button className="flex-1 text-left" onClick={() => setOpen((o) => !o)}>
          <span className="font-display text-[0.6rem] uppercase tracking-[0.3em] text-clay">
            Página {index + 1} / {total} {page.challenge ? "· con desafío" : ""}
          </span>
          <span className="block font-body text-base text-ink">{page.title}</span>
        </button>
        <div className="flex gap-2">
          <SmallBtn onClick={() => onMove(-1)}>↑</SmallBtn>
          <SmallBtn onClick={() => onMove(1)}>↓</SmallBtn>
          <SmallBtn onClick={onDuplicate}>Duplicar</SmallBtn>
          <SmallBtn onClick={onDelete}>Eliminar</SmallBtn>
          <SmallBtn onClick={() => setOpen((o) => !o)}>{open ? "Cerrar" : "Editar"}</SmallBtn>
        </div>
      </div>

      {open && (
        <div className="mt-4 grid gap-3">
          <Field label="Etiqueta pequeña (año · etapa)">
            <input
              className={input}
              value={page.eyebrow}
              onChange={(e) => onChange((p) => void (p.eyebrow = e.target.value))}
            />
          </Field>
          <Field label="Título">
            <input
              className={input}
              value={page.title}
              onChange={(e) => onChange((p) => void (p.title = e.target.value))}
            />
          </Field>
          <Field label="Imagen">
            <div className="flex flex-wrap gap-2">
              {Object.keys(IMAGE_LIBRARY).map((key) => (
                <button
                  key={key}
                  onClick={() => onChange((p) => void (p.image = key))}
                  className={`rounded border-2 p-0.5 ${
                    page.image === key ? "border-clay" : "border-transparent"
                  }`}
                >
                  <img
                    src={IMAGE_LIBRARY[key]}
                    alt={key}
                    className="h-12 w-16 rounded object-cover"
                  />
                </button>
              ))}
            </div>
            <input
              className={`${input} mt-2`}
              placeholder="o pega una URL de imagen (https://...)"
              value={IMAGE_LIBRARY[page.image] ? "" : page.image}
              onChange={(e) => onChange((p) => void (p.image = e.target.value))}
            />
          </Field>
          <Field label="Texto alternativo (accesibilidad)">
            <input
              className={input}
              value={page.imageAlt}
              onChange={(e) => onChange((p) => void (p.imageAlt = e.target.value))}
            />
          </Field>

          <ChallengeEditor
            challenge={page.challenge}
            onChange={(c) => onChange((p) => void (c ? (p.challenge = c) : delete p.challenge))}
          />
        </div>
      )}
    </div>
  );
}

function ChallengeEditor({
  challenge,
  onChange,
}: {
  challenge: Challenge | undefined;
  onChange: (c: Challenge | undefined) => void;
}) {
  const setKind = (kind: string) => {
    if (kind === "none") return onChange(undefined);
    if (kind === "quiz")
      return onChange({
        kind: "quiz",
        prompt: "¿Pregunta?",
        options: ["Opción correcta", "Otra opción"],
        answerIndex: 0,
        successText: "¡Correcto!",
      });
    if (kind === "order")
      return onChange({
        kind: "order",
        prompt: "Ordena los pasos.",
        steps: ["Paso 1", "Paso 2", "Paso 3"],
        successText: "¡Bien hecho!",
      });
    return onChange({
      kind: "forge",
      prompt: "Toca para completar la acción.",
      taps: 8,
      actionLabel: "Tocar",
      successText: "¡Listo!",
    });
  };

  return (
    <div className="rounded-md border border-clay/30 bg-parchment p-3">
      <Field label="Desafío de esta página">
        <select
          className={input}
          value={challenge?.kind ?? "none"}
          onChange={(e) => setKind(e.target.value)}
        >
          <option value="none">Sin desafío</option>
          <option value="quiz">Pregunta (opciones)</option>
          <option value="order">Ordenar pasos</option>
          <option value="forge">Táctil (tocar N veces)</option>
        </select>
      </Field>

      {challenge && (
        <div className="mt-3 grid gap-3">
          <Field label="Enunciado">
            <textarea
              className={input}
              rows={2}
              value={challenge.prompt}
              onChange={(e) => onChange({ ...challenge, prompt: e.target.value })}
            />
          </Field>

          {challenge.kind === "quiz" && (
            <>
              {challenge.options.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={challenge.answerIndex === i}
                    onChange={() => onChange({ ...challenge, answerIndex: i })}
                    aria-label="Respuesta correcta"
                  />
                  <input
                    className={input}
                    value={opt}
                    onChange={(e) => {
                      const options = [...challenge.options];
                      options[i] = e.target.value;
                      onChange({ ...challenge, options });
                    }}
                  />
                  <SmallBtn
                    onClick={() =>
                      onChange({
                        ...challenge,
                        options: challenge.options.filter((_, j) => j !== i),
                        answerIndex: Math.min(
                          challenge.answerIndex,
                          challenge.options.length - 2,
                        ),
                      })
                    }
                  >
                    ✕
                  </SmallBtn>
                </div>
              ))}
              <SmallBtn
                onClick={() =>
                  onChange({ ...challenge, options: [...challenge.options, "Nueva opción"] })
                }
              >
                + Opción
              </SmallBtn>
              <Field label="Pista (opcional)">
                <input
                  className={input}
                  value={challenge.hint ?? ""}
                  onChange={(e) => onChange({ ...challenge, hint: e.target.value })}
                />
              </Field>
            </>
          )}

          {challenge.kind === "order" && (
            <>
              {challenge.steps.map((step, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="font-display text-xs text-clay">{i + 1}</span>
                  <input
                    className={input}
                    value={step}
                    onChange={(e) => {
                      const steps = [...challenge.steps];
                      steps[i] = e.target.value;
                      onChange({ ...challenge, steps });
                    }}
                  />
                  <SmallBtn
                    onClick={() => {
                      const steps = [...challenge.steps];
                      if (i > 0) {
                        [steps[i - 1], steps[i]] = [steps[i]!, steps[i - 1]!];
                        onChange({ ...challenge, steps });
                      }
                    }}
                  >
                    ↑
                  </SmallBtn>
                  <SmallBtn
                    onClick={() =>
                      onChange({ ...challenge, steps: challenge.steps.filter((_, j) => j !== i) })
                    }
                  >
                    ✕
                  </SmallBtn>
                </div>
              ))}
              <SmallBtn
                onClick={() => onChange({ ...challenge, steps: [...challenge.steps, "Nuevo paso"] })}
              >
                + Paso
              </SmallBtn>
              <Field label="Pista (opcional)">
                <input
                  className={input}
                  value={challenge.hint ?? ""}
                  onChange={(e) => onChange({ ...challenge, hint: e.target.value })}
                />
              </Field>
            </>
          )}

          {challenge.kind === "forge" && (
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Número de toques">
                <input
                  className={input}
                  type="number"
                  min={1}
                  value={challenge.taps}
                  onChange={(e) =>
                    onChange({ ...challenge, taps: Math.max(1, Number(e.target.value)) })
                  }
                />
              </Field>
              <Field label="Texto del botón">
                <input
                  className={input}
                  value={challenge.actionLabel}
                  onChange={(e) => onChange({ ...challenge, actionLabel: e.target.value })}
                />
              </Field>
            </div>
          )}

          <Field label="Mensaje al acertar">
            <textarea
              className={input}
              rows={2}
              value={challenge.successText}
              onChange={(e) => onChange({ ...challenge, successText: e.target.value })}
            />
          </Field>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block font-display text-[0.55rem] uppercase tracking-[0.3em] text-clay">
        {label}
      </span>
      {children}
    </label>
  );
}

function SmallBtn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="rounded border border-clay/40 px-2 py-1 font-display text-[0.55rem] uppercase tracking-[0.2em] text-ink transition hover:bg-clay hover:text-primary-foreground"
    >
      {children}
    </button>
  );
}
