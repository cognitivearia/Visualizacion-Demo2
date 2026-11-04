export type MomentId =
  | "prehistoria"
  | "civilizacion"
  | "incertidumbre"
  | "guerra"
  | "postguerra"

export type Moment = {
  id: MomentId
  index: number
  year: number
  label: string
  open: boolean
  kicker: string
  title: string
  blurb: string
  note: string
}

export const moments: Moment[] = [
  {
    id: "prehistoria",
    index: 1,
    year: 2568,
    label: "Prehistoria",
    open: true,
    kicker: "Momento 01",
    title: "Tierras baldías",
    blurb:
      "El planeta todavía no tiene ciudades. El suelo es un baldío: sin edificios, solo unas pocas colonias de bloques. Son los primeros colonos.",
    note: "Pulsa el suelo. La lupa abre la composición del terreno: suelo, roca, agua y restos. Cada clic toma una lectura un poco distinta.",
  },
  {
    id: "civilizacion",
    index: 2,
    year: 2730,
    label: "Primera civilización",
    open: true,
    kicker: "Momento 02",
    title: "Primera civilización",
    blurb:
      "Entre los edificios hay gente de la vida común. La tecnología es la de nuestra vida actual: casas, calles, oficios. No es un estado totalitario.",
    note: "Pulsa a una persona. Se abre una ficha corta, como un documento: edad, género y familia.",
  },
  {
    id: "incertidumbre",
    index: 3,
    year: 2945,
    label: "Incertidumbre política",
    open: true,
    kicker: "Momento 03",
    title: "Incertidumbre política",
    blurb:
      "La ciudad sigue en pie y el siglo se llena. La política se vuelve incierta. Lupine no es un edificio: está al costado, fuera del mapa, y señala hacia la ciudad.",
    note: "Pulsa a Lupine. La nota, las cifras y el botón FIRE aparecen al lado.",
  },
  {
    id: "guerra",
    index: 4,
    year: 2999,
    label: "Guerra",
    open: false,
    kicker: "Momento 04",
    title: "Guerra",
    blurb: "El registro del conflicto todavía no está dibujado.",
    note: "En la línea, esta fecha sigue en próximo. Se entra desde 2945, con el botón FIRE.",
  },
  {
    id: "postguerra",
    index: 5,
    year: 3030,
    label: "Postguerra",
    open: false,
    kicker: "Momento 05",
    title: "Postguerra",
    blurb: "El mundo partido del año 3030 se consulta más adelante.",
    note: "Este momento viene después.",
  },
]

export type PersonId = "nora" | "marek" | "ilsa" | "peter" | "amina" | "tomas"

export type PersonTint = "denim" | "red" | "green" | "ochre"

export type Person = {
  id: PersonId
  name: string
  age: number
  gender: string
  family: string
  col: number
  row: number
  tint: PersonTint
}

export const townspeople: Person[] = [
  {
    id: "nora",
    name: "Nóra Varga",
    age: 34,
    gender: "Mujer",
    family: "Vive con su pareja y una hija.",
    col: 3,
    row: 2,
    tint: "denim",
  },
  {
    id: "marek",
    name: "Marek Holm",
    age: 41,
    gender: "Hombre",
    family: "Vive con su madre.",
    col: 2,
    row: 3,
    tint: "ochre",
  },
  {
    id: "ilsa",
    name: "Ilsa Berg",
    age: 19,
    gender: "Mujer",
    family: "Vive sola. Los domingos ve a su hermano.",
    col: 5,
    row: 3,
    tint: "red",
  },
  {
    id: "peter",
    name: "Péter Nagy",
    age: 67,
    gender: "Hombre",
    family: "Vive con su esposa.",
    col: 6,
    row: 4,
    tint: "green",
  },
  {
    id: "amina",
    name: "Amina Kessler",
    age: 28,
    gender: "Mujer",
    family: "Comparte piso con dos compañeros.",
    col: 3,
    row: 4,
    tint: "denim",
  },
  {
    id: "tomas",
    name: "Tomás Ried",
    age: 8,
    gender: "Niño",
    family: "Vive con su padre y su hermana.",
    col: 6,
    row: 1,
    tint: "ochre",
  },
]

export type BuildingRoof = "clay" | "slate"

export type BlockBuilding = {
  col: number
  row: number
  levels: number
  roof?: BuildingRoof
}

export const firstBuildings: BlockBuilding[] = [
  { col: 5, row: 1, levels: 4, roof: "slate" },
  { col: 4, row: 2, levels: 3, roof: "clay" },
  { col: 1, row: 2, levels: 2 },
  { col: 0, row: 3, levels: 3, roof: "slate" },
  { col: 7, row: 2, levels: 2, roof: "clay" },
  { col: 1, row: 4, levels: 2 },
  { col: 7, row: 4, levels: 3, roof: "slate" },
]

export type SoilLayerId = "suelo" | "roca" | "agua" | "restos"

export type SoilLayer = {
  id: SoilLayerId
  label: string
  color: string
  pct: number
}

export const soilPalette: { id: SoilLayerId; label: string; color: string; base: number }[] = [
  { id: "suelo", label: "Suelo", color: "#f0c14a", base: 44 },
  { id: "roca", label: "Roca", color: "#8a4b32", base: 28 },
  { id: "agua", label: "Agua", color: "#3de4ff", base: 17 },
  { id: "restos", label: "Restos", color: "#c45cff", base: 11 },
]

export function sampleSoil(col: number, row: number, take: number): SoilLayer[] {
  const weights = soilPalette.map((layer, index) => {
    const swing =
      Math.sin((col + 3) * 1.37 + (row + 1) * 0.83 + take * 1.17 + index * 2.05) * 6 +
      Math.cos((row + 2) * 1.51 + take * 0.67 + index * 1.2) * 3
    return Math.max(6, layer.base + swing)
  })
  const total = weights.reduce((sum, value) => sum + value, 0)
  const pcts = weights.map((value) => Math.max(1, Math.round((value / total) * 100)))
  let drift = 100 - pcts.reduce((sum, value) => sum + value, 0)
  let guard = 0
  while (drift !== 0 && guard < 12) {
    const index = Math.abs(drift + take + guard) % pcts.length
    const next = pcts[index] + Math.sign(drift)
    if (next >= 1) {
      pcts[index] = next
      drift -= Math.sign(drift)
    }
    guard += 1
  }

  return soilPalette.map((layer, index) => ({
    id: layer.id,
    label: layer.label,
    color: layer.color,
    pct: pcts[index],
  }))
}
