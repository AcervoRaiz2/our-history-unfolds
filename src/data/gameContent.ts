/**
 * ============================================================================
 *  "Nuestra historia en tus manos" — CONTENIDO EDITABLE DEL JUEGO
 * ============================================================================
 *  Este archivo es el ÚNICO lugar donde debes editar textos, imágenes,
 *  desafíos y respuestas. El motor del juego (ruleta + libro pop-up) lee
 *  todo desde aquí.
 *
 *  CÓMO AGREGAR UNA IMAGEN NUEVA:
 *   1. Sube el archivo a  src/assets/  (ej: src/assets/mi-escena.jpg)
 *   2. Impórtala arriba:  import miEscena from "@/assets/mi-escena.jpg";
 *   3. Úsala en la página:  image: miEscena
 *
 *  CÓMO AGREGAR UNA PÁGINA:
 *   Copia un bloque { id, title, ... } dentro de pages: [...] de la época.
 *
 *  CÓMO AGREGAR UN DESAFÍO:
 *   Añade  challenge: { ... }  a cualquier página. El jugador no podrá
 *   avanzar hasta resolverlo.
 * ============================================================================
 */

import sceneChircales from "@/assets/scene-chircales.jpg";
import sceneLeneras from "@/assets/scene-leneras.jpg";
import sceneBarrio from "@/assets/scene-barrio.jpg";
import sceneJovenes from "@/assets/scene-jovenes.jpg";
import sceneBiblioteca from "@/assets/scene-biblioteca.jpg";
import sceneRaiz from "@/assets/scene-raiz.jpg";

/** Desafío tipo pregunta: elegir la opción correcta. */
export type QuizChallenge = {
  kind: "quiz";
  prompt: string;
  /** Pista opcional que aparece tras un intento fallido. */
  hint?: string;
  options: string[];
  /** Índice (empezando en 0) de la opción correcta. */
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

/** Desafío táctil: hacer clic/arrastrar N veces sobre el barro para moldear. */
export type ForgeChallenge = {
  kind: "forge";
  prompt: string;
  /** Número de toques necesarios para completar la acción. */
  taps: number;
  actionLabel: string;
  successText: string;
};

export type Challenge = QuizChallenge | OrderChallenge | ForgeChallenge;

export type Page = {
  id: string;
  /** Año o etiqueta pequeña que aparece sobre el título. */
  eyebrow: string;
  title: string;
  /** PLACEHOLDER DE NARRACIÓN: aquí va tu texto. Puedes dejarlo vacío ("") */
  narration: string;
  /** Frase corta destacada tipo cita (opcional). */
  quote?: string;
  image: string;
  /** Texto alternativo accesible de la imagen. */
  imageAlt: string;
  /** Desafío que bloquea el avance de la página (opcional). */
  challenge?: Challenge;
};

export type Era = {
  id: string;
  year: number;
  name: string;
  subtitle: string;
  pages: Page[];
};

/** Casillas de la ruleta (la aguja siempre se detiene donde marca el guion). */
export const ROULETTE_YEARS = [
  1970, 1985, 1994, 2001, 2007, 2012, 2015, 2020,
] as const;

/** Orden obligatorio de paradas de la ruleta a lo largo del juego. */
export const FORCED_STOPS = [1970, 2012] as const;

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
        narration:
          "[NARRACIÓN 1] Había una vez, en el suroriente de Bogotá, un rincón que nació bajo la sombra de la montaña. En sus inicios era un bosque espeso: por eso lo llamaron La Arboleda.",
        quote: "Muy cerca de allí, la tierra escondía una historia más pesada.",
        image: sceneChircales,
        imageAlt:
          "Escenario pop-up de los chircales de Bogotá con hornos de ladrillo humeantes",
      },
      {
        id: "e1-p2",
        eyebrow: "1970 · El oficio",
        title: "Pisar el barro desde niños",
        narration:
          "[NARRACIÓN 2] Familias llegadas del campo entregaban su cuerpo al barro. Los niños se descalzaban para pisar la arcilla fría durante horas, sintiendo cómo la piel se rompía.",
        image: sceneChircales,
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
        id: "e1-p3",
        eyebrow: "1970 · Las leñeras",
        title: "El humo que nunca se apagaba",
        narration:
          "[NARRACIÓN 3] Los hornos de carbón ardían noche y día. El humo denso se respiraba como se respira el aire, y la infancia se quemaba junto con los ladrillos.",
        image: sceneLeneras,
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
        id: "e1-p4",
        eyebrow: "1970 · El olvido",
        title: "Cerros lastimados, casas levantadas",
        narration:
          "[NARRACIÓN 4] Cuando la tierra se agotó, las ladrilleras se fueron y dejaron cerros rotos y familias sin empleo. Con los restos del suelo, esas mismas manos levantaron sus casas.",
        quote: "Para las autoridades, esos barrios ni siquiera existían.",
        image: sceneBarrio,
        imageAlt: "Barrio autoconstruido en la ladera de la montaña",
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
        eyebrow: "2007 – 2012 · La semilla",
        title: "Ocho muchachos filosofando en la esquina",
        narration:
          "[NARRACIÓN 5] Los nietos de los chircales escuchaban a sus abuelos con rabia y admiración. Se juntaron en los parques a cuestionar una ciudad que les daba la espalda.",
        image: sceneJovenes,
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
        id: "e2-p2",
        eyebrow: "2012 – 2014 · El ahorro",
        title: "Peso a peso, una casa propia",
        narration:
          "[NARRACIÓN 6] Tomarse las calles trajo persecución. Necesitaban un lugar propio. Eligieron la ruta más larga: ahorrar colectivamente, moneda a moneda.",
        image: sceneJovenes,
        imageAlt: "Jóvenes organizando actividades comunitarias",
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
        id: "e2-p3",
        eyebrow: "2015 · La casa",
        title: "La casa de los rockeros",
        narration:
          "[NARRACIÓN 7] Arreglaron techos, levantaron muros y pidieron ayuda al vecindario. Llegaron sillas, mesas y toneladas de libros viejos. Los niños llegaron antes que los jóvenes.",
        image: sceneBiblioteca,
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
        id: "e2-p4",
        eyebrow: "2017 · El nombre",
        title: "Raíz de Barro",
        narration:
          "[NARRACIÓN 8] Escogieron ese nombre para honrar a los abuelos que moldearon la tierra en los hornos. La arcilla ya no significa cadenas: es la fuerza con la que se moldea un futuro digno.",
        quote: "«La biblioteca nos encontró a nosotros.» — Nacho, fundador",
        image: sceneRaiz,
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
    ],
  },
];

/** Texto de la pantalla final. */
export const ENDING = {
  title: "Nuestra historia sigue en tus manos",
  text: "[NARRACIÓN FINAL] Del barro de los chircales a los libros de la biblioteca: la misma arcilla, otras manos, otro futuro.",
};
