export type MomentId =
  | "prehistoria"
  | "civilizacion"
  | "incertidumbre"
  | "guerra"
  | "postguerra"

export type Moment = {
  id: MomentId
  index: number
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
    label: "Primera civilización",
    open: false,
    kicker: "Momento 02",
    title: "Primera civilización",
    blurb: "Las primeras construcciones todavía no están en este corte del archivo.",
    note: "Este momento viene después. La prehistoria ya se puede explorar.",
  },
  {
    id: "incertidumbre",
    index: 3,
    label: "Incertidumbre política",
    open: false,
    kicker: "Momento 03",
    title: "Incertidumbre política",
    blurb: "La disputa por el territorio se abre en un corte posterior.",
    note: "Este momento viene después. La prehistoria ya se puede explorar.",
  },
  {
    id: "guerra",
    index: 4,
    label: "Guerra",
    open: false,
    kicker: "Momento 04",
    title: "Guerra",
    blurb: "El registro del conflicto todavía no está dibujado.",
    note: "Este momento viene después. La prehistoria ya se puede explorar.",
  },
  {
    id: "postguerra",
    index: 5,
    label: "Postguerra",
    open: false,
    kicker: "Momento 05",
    title: "Postguerra",
    blurb: "El mundo partido del año 3030 se consulta más adelante.",
    note: "Este momento viene después. La prehistoria ya se puede explorar.",
  },
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
