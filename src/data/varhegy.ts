import { csvSources } from "@/data/csv-sources.generated"
import { fuegos } from "@/data/varhegy-bajas"
import { countries2730, occupation3030 } from "@/data/world"
import { formatPeople } from "@/lib/format"
import { parseCsv, toNumber } from "@/lib/parse-csv"
import { palette } from "@/lib/palette"

/**
 * Las 5 escenas de Várhegy (ver docs/spec-varhegy.md).
 * Los textos del blurb son BORRADOR: Mari los edita aquí.
 * Las cifras salen de src/data/csv/varhegy-demografia.csv y de los CSV originales.
 */

export type SceneId =
  | "prehistoria"
  | "primera-civilizacion"
  | "incertidumbre"
  | "guerra"
  | "posguerra"

/**
 * Cómo se lee el mapa de texto de cada escena (una letra = una casilla):
 *   .  suelo            =  calle
 *   h  choza            1-9  edificio (el número es la altura)
 *   x  escombros        f  fuego
 *   L  LUPINE (mecha)
 */
export type ScenePalette = {
  sky: string
  groundA: string
  groundB: string
  road: string
  building: string
  hut: string
  rubble: string
  fire: string
  lupine: string
  accent: string
}

/** Qué hace cada zona tocable. */
export type HotspotAction = "lens" | "street" | "lupine" | "division" | "regime"

export type Hotspot = ({ match: string } | { cells: Array<[number, number]> }) & {
  action: HotspotAction
  label: string
}

export type SplitPart = { name: string; value: number; color: string }

export type Scene = {
  id: SceneId
  year: number
  /** Nombre corto para la línea de tiempo. */
  short: string
  title: string
  blurb: string
  layout: string[]
  palette: ScenePalette
  hotspots: Hotspot[]
  interaction: { label: string; detail: string }
  stats: Array<{ label: string; value: string }>
  split?: { title: string; parts: SplitPart[] }
}

const demografia = parseCsv(csvSources["varhegy-demografia"])

/** Población de la ciudad, el país y Karpatenland en un año. Sale de varhegy-demografia.csv. */
export function escalaDe(year: number) {
  const row = demografia.find((item) => toNumber(item.anio) === year)
  if (!row) return null
  const ciudad = toNumber(row.poblacion_ciudad)
  const pais = toNumber(row.poblacion_pais)
  const region = toNumber(row.poblacion_karpatenland)
  if (ciudad <= 0 || pais <= 0 || region <= 0) return null
  return { ciudad, pais, region }
}

function demo(year: number) {
  const escala = escalaDe(year)
  return {
    ciudad: escala?.ciudad ?? 0,
    pais: escala?.pais ?? 0,
    karpatenland: escala?.region ?? 0,
  }
}

function baseStats(year: number, ciudadLabel = "Ciudad") {
  const d = demo(year)
  return [
    { label: ciudadLabel, value: formatPeople(d.ciudad) },
    { label: "País", value: formatPeople(d.pais) },
    { label: "Karpatenland", value: formatPeople(d.karpatenland) },
  ]
}

const varhegyCensus = countries2730.find((country) => country.pais === "Várhegy")

export const scenes: Scene[] = [
  {
    id: "prehistoria",
    year: 2568,
    short: "Prehistoria",
    title: "Las primeras raíces",
    blurb:
      "Durante el siglo 36, 90 años luego del primer exódo, el territorio indigena habitado por los nómadas sobrevivientes de la guerra que \"reinicio\" al mundo, Naolla, sin saberlo sería la cuna del nuevo renacimiento y la futura Karpatenland, gracias a sus suelos ricos en Lenario.",
    layout: [
      "........",
      "..h.....",
      "........",
      ".....h..",
      "........",
      "...h....",
      "........",
      "........",
    ],
    palette: {
      sky: "#1d2a22",
      groundA: "#5f7a45",
      groundB: "#6b8650",
      road: "#7a6a48",
      building: "#8a6f45",
      hut: "#a47c4a",
      rubble: "#6b5a3e",
      fire: "#e8923a",
      lupine: "#7a7390",
      accent: "#3dffb0",
    },
    hotspots: [{ cells: [[4, 4]], action: "lens", label: "El suelo" }],
    interaction: {
      label: "Clic en el suelo",
      detail: "Lupa con un corte vertical de la tierra: capas, minerales y Lenario.",
    },
    stats: baseStats(2568, "Aldea"),
  },
  {
    id: "primera-civilizacion",
    year: 2730,
    short: "Primera civilización",
    title: "Nuestra capital",
    blurb:
      "Siglos después, Váhergy es una ciudad de calles pequeñas y edificios bajos, los vecinos se conocen entre ellos, pero los retazos de las generaciones que migraron fuera del planeta estan resurgiendo y la política mundial se empieza a ver manipulada nuevamente.",
    layout: [
      "11.=.22.",
      "1..=..1.",
      "..2=.1..",
      "========",
      ".1.=22..",
      "2..=..1.",
      "..1=.2..",
      "11.=..2.",
    ],
    palette: {
      sky: "#2a2438",
      groundA: "#4a4560",
      groundB: "#524c69",
      road: "#2b2736",
      building: "#c97b5a",
      hut: "#a47c4a",
      rubble: "#6b5a3e",
      fire: "#e8923a",
      lupine: "#7a7390",
      accent: "#3dffb0",
    },
    hotspots: [{ match: "=", action: "street", label: "Las calles" }],
    interaction: {
      label: "Clic en las calles",
      detail:
        "Zoom a la calle: fichas de personas con aspecto de documento clasificado. En el suelo, tres losas comparan la ciudad, el país y Karpatenland.",
    },
    stats: baseStats(2730),
    split: {
      title: "Censo 2730 del país",
      parts: [
        {
          name: "Oroszlan",
          value: varhegyCensus?.pctOroszlan ?? 0,
          color: palette.oroszlan,
        },
        { name: "Polip", value: varhegyCensus?.pctPolip ?? 0, color: palette.polip },
      ],
    },
  },
  {
    id: "incertidumbre",
    year: 2945,
    short: "Incertidumbre",
    title: "La noche se acerca",
    blurb:
      "Los edificios crecen y la ciudad se acerca a una noche permanente. Karpatenland alcanza su pico de población, pero la incertidumbre política crece. Mientras tanto una figura gigante nos mira con la misma frialdad que nos mira nuestro futuro.",
    layout: [
      "35.=.46.",
      "4..=..5.",
      ".6.=.3..",
      "========",
      ".5.=.2..",
      "3..=.L..",
      "..4=....",
      "35.=..2.",
    ],
    palette: {
      sky: "#150f26",
      groundA: "#262040",
      groundB: "#2c2548",
      road: "#120d20",
      building: "#4b3f87",
      hut: "#a47c4a",
      rubble: "#6b5a3e",
      fire: "#e8923a",
      lupine: "#c45cff",
      accent: "#3dffb0",
    },
    hotspots: [
      { match: "=", action: "street", label: "Las calles" },
      { match: "L", action: "lupine", label: "LUPINE" },
    ],
    interaction: {
      label: "Clic en LUPINE y en las calles",
      detail:
        "Comparativa de tamaño, despiece del rifle AMR-652-4 y datos de personas. En el suelo de la calle, tres losas comparan la ciudad, el país y Karpatenland. El botón de disparo avanza a la guerra.",
    },
    stats: baseStats(2945),
  },
  {
    id: "guerra",
    year: 2999,
    short: "Guerra",
    title: "La ciudad destruida",
    blurb:
      "La ciudad está en ruinas. En 2999 la guerra parte a la población: Várhegy se reparte entre el régimen, la oposición, la línea del frente y los desplazados.",
    layout: [
      "x1.=.x2.",
      "x..=..f.",
      ".f.=.x..",
      "====f===",
      ".x.=f1..",
      "1..=..x.",
      "..x=.f..",
      "xf.=..x.",
    ],
    palette: {
      sky: "#1c1517",
      groundA: "#3a3438",
      groundB: "#403a3e",
      road: "#231e21",
      building: "#6b6068",
      hut: "#a47c4a",
      rubble: "#4a4350",
      fire: "#ff7a2e",
      lupine: "#7a7390",
      accent: "#ff7a2e",
    },
    hotspots: fuegos.map((fuego) => ({
      cells: [[fuego.col, fuego.fila] as [number, number]],
      action: "division" as const,
      label: fuego.zona,
    })),
    interaction: {
      label: "Clic en un fuego",
      detail:
        "Cada color es un bando. Abre el mapa del continente: el negro es quien falta en 2999, y al lado los muertos de ese bando.",
    },
    stats: baseStats(2999),
  },
  {
    id: "posguerra",
    year: 3030,
    short: "Posguerra",
    title: "Un solo color",
    blurb:
      "En 3030 todo el estado es de un solo color: el azul de Oroszlan. Las personas visten uniforme y varios LUPINE vigilan el mundo. Esta ciudad que alguna vez fue un bastión para el mundo libre, es ahora un mar de plata sin voz.",
    layout: [
      "44.=.44.",
      "4..=.L.4",
      "44.=...4",
      "========",
      "4L.=.44.",
      "4..=.44.",
      "44.=.L.4",
      "44.=...4",
    ],
    palette: {
      sky: "#0f1d3d",
      groundA: "#2a4d99",
      groundB: "#2f549f",
      road: "#1e3a78",
      building: "#4d8cff",
      hut: "#4d8cff",
      rubble: "#3a6ccc",
      fire: "#4d8cff",
      lupine: "#9bbcff",
      accent: "#9bbcff",
    },
    hotspots: [{ match: "=", action: "regime", label: "La calle" }],
    interaction: {
      label: "Clic en la calle",
      detail:
        "Zoom a la calle: gente uniformada, militantes, colores y banderas. En el suelo, tres losas comparan la ciudad, el país y Karpatenland.",
    },
    stats: baseStats(3030),
    split: {
      title: "Ocupación mundial 3030",
      parts: occupation3030.map((row) => ({
        name: row.nacion,
        value: row.ocupacion,
        color:
          row.nacion === "Oroszlan"
            ? palette.oroszlan
            : row.nacion === "Polip"
              ? palette.polip
              : palette.otros,
      })),
    },
  },
]
