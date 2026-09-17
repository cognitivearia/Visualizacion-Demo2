export type VizSlug = "mapa" | "tendencia" | "territorio" | "censo2730" | "eras"

export type Visualization = {
  slug: VizSlug
  title: string
  kicker: string
  summary: string
  description: string
  interaction: string
  tags: string[]
  accent: string
}

export const visualizations: Visualization[] = [
  {
    slug: "mapa",
    title: "Continente por épocas",
    kicker: "Mapa",
    summary: "El mapa del mundo: cada región se enciende o se apaga con su población.",
    description:
      "Rosa es Ostseeküste (Patriarchate of Heraria), lima Dunántúl (Protectorate of Panes), menta Nagy-Alföld (Hudevorian Empire), naranja Karpatenland (Diocese of Cordamilia) y azul claro Alpenvorland (Grand Duchy of Avevaria). .",
    interaction:
      "Pulsa Reproducir o mueve el año. Haz clic en una región para ver sus países de 2730 y cuánto cayó en la guerra.",
    tags: ["mapa", "regiones", "épocas"],
    accent: "#4d8cff",
  },
  {
    slug: "tendencia",
    title: "Tendencia poblacional",
    kicker: "2568 — 3030",
    summary: "Población de las cinco regiones, antes y después de la guerra.",
    description:
      "Serie de las regiones Dunántúl, Nagy-Alföld, Karpatenland, Ostseeküste y Alpenvorland. Crece hasta 2945 y se parte entre 2945 y 2999.",
    interaction:
      "Pulsa Reproducir para ver los siglos. Apaga una región en la leyenda. El salto a 2999 es la guerra.",
    tags: ["tendencia", "regiones", "guerra"],
    accent: "#3dffb0",
  },
  {
    slug: "territorio",
    title: "División territorial 3030",
    kicker: "Año actual",
    summary: "Cómo se reparte el mapa entre Oroszlan, Polip y el resto.",
    description:
      "Ocupación mundial en 3030: Oroszlan 48,8 %, Polip 48,4 %, otros 2,8 %. La sociedad se ve divida por la influencia política de los partidos.",
    interaction:
      "Haz clic en una porción o en la lista para fijar un bando.",
    tags: ["territorio", "3030", "Oroszlan", "Polip"],
    accent: "#4d8cff",
  },
  {
    slug: "Censo2730",
    title: "Censo político mundial de 2730",
    kicker: "Trescientos años atrás",
    summary: "Qué porcentaje de cada país apoyaba a Oroszlan o a Polip.",
    description:
      "Antes de que el mapa se partiera. Cada barra es un país: azul Oroszlan, morado Polip. Dunántúl es el bloque más leal a Oroszlan.",
    interaction:
      "Filtra por región. Haz clic en un país para ver las cifras absolutas de simpatizantes y oposición.",
    tags: ["2730", "países", "Oroszlan", "Polip"],
    accent: "#c45cff",
  },
  {
    slug: "eras",
    title: "2730 frente a 3030",
    kicker: "Antes / después",
    summary: "Cuánta gente perdió cada región entre el censo viejo y el año actual.",
    description:
      "Misma geografía, dos siglos de distancia. Ostseeküste, Alpenvorland, Nagy-Alföld y Karpatenland se vacían. Dunántúl es la única región que no cae.",
    interaction:
      "Pasa el cursor por una barra. El recuadro de abajo resume la caída de cada región.",
    tags: ["comparativa", "regiones"],
    accent: "#4d8cff",
  },
]

export function getVisualization(slug: string) {
  return visualizations.find((item) => item.slug === slug)
}

export const project = {
  name: "Archivo 3030",
  line: "Censo de un mundo partido",
  blurb:
    "Archivo de la guerra: actualización #495, hoy se cumplen 300 años de historia escrita, veamos que nos cuentan sus víctimas.",
}
