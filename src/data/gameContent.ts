/**
 * ============================================================================
 *  "Nuestra historia en tus manos" — CONTENIDO BASE DEL JUEGO
 * ============================================================================
 *  Este archivo es el contenido POR DEFECTO. Todo se puede editar sin tocar
 *  código desde la pantalla /editor (modo edición con acceso privado).
 *
 *  Las imágenes se referencian por CLAVE (ver IMAGE_LIBRARY abajo). También
 *  puedes escribir una URL completa (https://...) o pegar una imagen propia
 *  desde el editor.
 * ============================================================================
 */

import sceneChircales from "@/assets/scene-chircales.jpg";
import sceneLeneras from "@/assets/scene-leneras.jpg";
import sceneBarrio from "@/assets/scene-barrio.jpg";
import sceneJovenes from "@/assets/scene-jovenes.jpg";
import sceneBiblioteca from "@/assets/scene-biblioteca.jpg";
import sceneRaiz from "@/assets/scene-raiz.jpg";

/** Biblioteca de imágenes disponibles: clave → archivo. */
export const IMAGE_LIBRARY: Record<string, string> = {
  chircales: sceneChircales,
  leneras: sceneLeneras,
  barrio: sceneBarrio,
  jovenes: sceneJovenes,
  biblioteca: sceneBiblioteca,
  raiz: sceneRaiz,
};

/** Convierte una clave de imagen (o URL / data URL) en algo mostrable. */
export function resolveImage(
  value: string,
  custom?: Record<string, string>,
): string {
  return custom?.[value] ?? IMAGE_LIBRARY[value] ?? value;
}

/** Desafío tipo pregunta: elegir la opción correcta. */
export type QuizChallenge = {
  kind: "quiz";
  prompt: string;
  hint?: string;
  options: string[];
  answerIndex: number;
  successText: string;
};

/** Desafío tipo secuencia: ordenar pasos haciendo clic en el orden correcto. */
export type OrderChallenge = {
  kind: "order";
  prompt: string;
  hint?: string;
  /** Escribe los pasos YA en el orden correcto; el juego los baraja. */
  steps: string[];
  successText: string;
};

/** Desafío táctil: tocar N veces para moldear / juntar. */
export type ForgeChallenge = {
  kind: "forge";
  prompt: string;
  taps: number;
  actionLabel: string;
  successText: string;
};

export type Challenge = QuizChallenge | OrderChallenge | ForgeChallenge;

export type Page = {
  id: string;
  eyebrow: string;
  title: string;
  /** Clave de IMAGE_LIBRARY o URL completa. */
  image: string;
  imageAlt: string;
  challenge?: Challenge;
};

export type Era = {
  id: string;
  year: number;
  name: string;
  subtitle: string;
  pages: Page[];
};

/** Todos los textos de pantalla y botones del juego. */
export type UiTexts = {
  intro: { title: string; subtitle: string; tagline: string };
  second: { title: string; subtitle: string; tagline: string };
  roulette: { spin: string; spinning: string; landedPrefix: string; opening: string };
  glitch: { title: string; text: string; button: string };
  book: { prev: string; next: string; locked: string };
  ending: { button: string };
};

export type GameContent = {
  eras: Era[];
  ending: { title: string; text: string };
  /** Casillas visibles de la ruleta. */
  rouletteYears: number[];
  /** Imágenes propias subidas desde el editor: nombre → data URL. */
  images: Record<string, string>;
  ui: UiTexts;
};

/** Casillas de la ruleta (valor por defecto). */
export const ROULETTE_YEARS = [1970, 1985, 1994, 2001, 2007, 2012, 2015, 2020] as const;

export const DEFAULT_UI: UiTexts = {
  intro: {
    title: "Nuestra historia en tus manos",
    subtitle: "Biblioteca Comunitaria Raíz de Barro",
    tagline: "Gira la rueda del tiempo y deja que la historia te encuentre.",
  },
  second: {
    title: "La rueda vuelve a girar",
    subtitle: "Reiniciando la memoria",
    tagline: "La memoria se desordenó. Gira de nuevo para encontrar el hilo.",
  },
  roulette: {
    spin: "Girar",
    spinning: "Girando…",
    landedPrefix: "Año",
    opening: "EL LIBRO SE ABRE…",
  },
  glitch: {
    title: "MEMORIA INTERRUMPIDA",
    text: "Las páginas se rompen: la descendencia de los chircales se dispersa en el tiempo. El libro no puede seguir sin volver a la rueda.",
    button: "Reparar la línea del tiempo",
  },
  book: { prev: "← Anterior", next: "Siguiente →", locked: "Bloqueado" },
  ending: { button: "Volver a girar la rueda" },
};

export const ERAS: Era[] = [
  /* ======================= ÉPOCA 1 — 1970 ============================== */
  {
    id: "chircales",
    year: 1970,
    name: "Los Chircales y las Leñeras",
    subtitle: "Suroriente de Bogotá · El barro que construyó la ciudad",
    pages: [
      {
        id: "e1-p1",
        eyebrow: "1970 · El origen",
        title: "El barrio que nació bajo la montaña",
        image: "chircales",
        imageAlt:
          "Escenario pop-up de los chircales de Bogotá con hornos de ladrillo humeantes",
      },
      {
        id: "e1-p2",
        eyebrow: "1970 · La llegada",
        title: "Familias del campo buscando ciudad",
        image: "barrio",
        imageAlt: "Familias campesinas llegando a la ladera de la montaña",
      },
      {
        id: "e1-p3",
        eyebrow: "1970 · El oficio",
        title: "Pisar el barro desde niños",
        image: "chircales",
        imageAlt: "Trabajo artesanal del ladrillo en un chircal",
        challenge: {
          kind: "forge",
          prompt:
            "Amasa la arcilla con tus manos hasta moldear un ladrillo. Cada toque es una hora de trabajo.",
          taps: 8,
          actionLabel: "Pisar el barro",
          successText:
            "Un ladrillo listo. Miles como este levantaron los edificios de la ciudad.",
        },
      },
      {
        id: "e1-p4",
        eyebrow: "1970 · Las manos de los abuelos",
        title: "La gavera, el sol y la espalda",
        image: "chircales",
        imageAlt: "Manos moldeando ladrillos en gaveras de madera bajo el sol",
      },
      {
        id: "e1-p5",
        eyebrow: "1970 · Las leñeras",
        title: "El humo que nunca se apagaba",
        image: "leneras",
        imageAlt: "Leñeras y hornos de carbón al atardecer",
        challenge: {
          kind: "order",
          prompt: "Ordena el proceso artesanal del ladrillo, paso a paso.",
          hint: "Todo empieza en la tierra y termina en el fuego.",
          steps: [
            "Extraer la arcilla del cerro",
            "Pisar y amasar el barro con agua",
            "Moldear el ladrillo en la gavera",
            "Secar al sol en la explanada",
            "Cocer en el horno de carbón",
          ],
          successText:
            "Así se hacía un ladrillo: con tierra, agua, sol, fuego y cuerpo.",
        },
      },
      {
        id: "e1-p6",
        eyebrow: "1970 · La jornada",
        title: "Trabajo de sol a sol, salario de nadie",
        image: "leneras",
        imageAlt: "Trabajadores cargando ladrillos junto a los hornos",
        challenge: {
          kind: "quiz",
          prompt: "¿Quiénes trabajaban en los chircales?",
          hint: "No era un trabajo de una sola persona.",
          options: [
            "Solo hombres adultos contratados por la ciudad",
            "Familias enteras: abuelos, padres, madres, niñas y niños",
            "Obreros llegados de otros países",
            "Empresas industriales con máquinas",
          ],
          answerIndex: 1,
          successText:
            "Familias completas entregaban su cuerpo al barro para que la ciudad creciera.",
        },
      },
      {
        id: "e1-p7",
        eyebrow: "1970 · El olvido",
        title: "Cerros lastimados, casas levantadas",
        image: "barrio",
        imageAlt: "Barrio autoconstruido en la ladera de la montaña",
      },
      {
        id: "e1-p8",
        eyebrow: "1980 · La herencia",
        title: "Un barrio que no aparecía en los mapas",
        image: "barrio",
        imageAlt: "Casas de ladrillo apiladas en la montaña al anochecer",
      },
    ],
  },

  /* ======================= ÉPOCA 2 — 2012 ============================== */
  {
    id: "raiz-de-barro",
    year: 2012,
    name: "Biblioteca Comunitaria Raíz de Barro",
    subtitle: "La Arboleda · Los nietos del barro",
    pages: [
      {
        id: "e2-p1",
        eyebrow: "2007 · Los nietos",
        title: "Crecer escuchando a los abuelos",
        image: "jovenes",
        imageAlt: "Jóvenes del barrio escuchando historias de sus abuelos",
      },
      {
        id: "e2-p2",
        eyebrow: "2012 · La semilla",
        title: "Ocho muchachos filosofando en la esquina",
        image: "jovenes",
        imageAlt: "Jóvenes con carpas y talleres abiertos en un parque del barrio",
        challenge: {
          kind: "quiz",
          prompt:
            "¿Qué hicieron primero estos jóvenes para romper el círculo de la pobreza?",
          hint: "No esperaron un salón: usaron la calle.",
          options: [
            "Cursos preuniversitarios y refuerzo escolar en plena calle",
            "Fundar un partido político",
            "Abrir una fábrica de ladrillos",
            "Irse del barrio a estudiar afuera",
          ],
          answerIndex: 0,
          successText:
            "Con monedas juntadas compraban formularios de inscripción a universidades públicas.",
        },
      },
      {
        id: "e2-p3",
        eyebrow: "2013 · La lucha",
        title: "Tomarse la calle también cuesta",
        image: "jovenes",
        imageAlt: "Jóvenes organizando actividades comunitarias en la calle",
      },
      {
        id: "e2-p4",
        eyebrow: "2014 · El ahorro",
        title: "Peso a peso, una casa propia",
        image: "jovenes",
        imageAlt: "Jóvenes reuniendo el ahorro colectivo del grupo",
        challenge: {
          kind: "forge",
          prompt:
            "Junta el ahorro colectivo. Cada toque es una moneda guardada por el grupo.",
          taps: 10,
          actionLabel: "Guardar una moneda",
          successText:
            "A finales de 2014 compraron una casita deteriorada en La Arboleda.",
        },
      },
      {
        id: "e2-p5",
        eyebrow: "2015 · La casa",
        title: "La casa de los rockeros",
        image: "biblioteca",
        imageAlt: "Casa comunitaria convertida en biblioteca, niñas y niños leyendo",
        challenge: {
          kind: "order",
          prompt: "Ordena cómo la casa se convirtió en biblioteca.",
          steps: [
            "Comprar la casita deteriorada del barrio",
            "Arreglar techos, muros y pisos",
            "Recibir libros y muebles donados por los vecinos",
            "Ganar el estímulo de la Red Distrital de Bibliotecas",
            "Nombrarla Biblioteca Comunitaria Raíz de Barro",
          ],
          successText:
            "En 2015 llegaron mesas, sillas y libros infantiles nuevos: la biblioteca existía.",
        },
      },
      {
        id: "e2-p6",
        eyebrow: "2016 · Los primeros lectores",
        title: "Los niños llegaron antes que los libros",
        image: "biblioteca",
        imageAlt: "Niñas y niños leyendo en la sala de la biblioteca comunitaria",
      },
      {
        id: "e2-p7",
        eyebrow: "2017 · El nombre",
        title: "Raíz de Barro",
        image: "raiz",
        imageAlt: "Manos de barro moldeando una casa y un libro sobre raíces de arcilla",
        challenge: {
          kind: "quiz",
          prompt: "¿Por qué la biblioteca se llama Raíz de Barro?",
          hint: "El nombre mira hacia atrás para poder mirar adelante.",
          options: [
            "Porque el barrio está hecho de barro rojo",
            "Porque honra a los abuelos de los chircales y su memoria",
            "Porque fue el nombre de un concurso distrital",
            "Porque la casa se construyó con adobe",
          ],
          answerIndex: 1,
          successText:
            "Las raíces vienen del sudor y la injusticia; la casa, de la comunidad.",
        },
      },
      {
        id: "e2-p8",
        eyebrow: "2020 · La comunidad",
        title: "Una biblioteca que también es cocina, escuela y refugio",
        image: "biblioteca",
        imageAlt: "Vecinos y vecinas compartiendo en la biblioteca comunitaria",
      },
      {
        id: "e2-p9",
        eyebrow: "Hoy · El presente",
        title: "La misma arcilla, otras manos",
        image: "raiz",
        imageAlt: "Manos jóvenes sosteniendo un libro que brota de raíces de barro",
        challenge: {
          kind: "forge",
          prompt: "Siembra la raíz: cada toque es una historia que se sigue contando.",
          taps: 6,
          actionLabel: "Sembrar memoria",
          successText: "La historia sigue en tus manos.",
        },
      },
    ],
  },
];

/** Texto de la pantalla final. */
export const ENDING = {
  title: "Nuestra historia sigue en tus manos",
  text: "Del barro de los chircales a los libros de la biblioteca: la misma arcilla, otras manos, otro futuro.",
};

export const DEFAULT_CONTENT: GameContent = {
  eras: ERAS,
  ending: ENDING,
  rouletteYears: [...ROULETTE_YEARS],
  images: {},
  ui: DEFAULT_UI,
};
