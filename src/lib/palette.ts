export const palette = {
  blue: "#4d8cff",
  green: "#3dffb0",
  purple: "#c45cff",
  oroszlan: "#4d8cff",
  polip: "#c45cff",
  otros: "#3dffb0",
  mist: "#b7aec8",
} as const

export const regionColors: Record<string, string> = {
  Dunántúl: "#4d8cff",
  "Nagy-Alföld": "#c45cff",
  Karpatenland: "#3dffb0",
  Ostseeküste: "#7aa2ff",
  Alpenvorland: "#d08cff",
}

export const chartColors = [
  palette.blue,
  palette.purple,
  palette.green,
  palette.mist,
]

export function mixHex(from: string, to: string, amount: number) {
  const t = Math.min(1, Math.max(0, amount))
  const a = hexToRgb(from)
  const b = hexToRgb(to)
  if (!a || !b) return to
  const lerp = (start: number, end: number) => Math.round(start + (end - start) * t)
  return `#${[lerp(a[0], b[0]), lerp(a[1], b[1]), lerp(a[2], b[2])]
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("")}`
}

function hexToRgb(value: string): [number, number, number] | null {
  const hex = value.replace("#", "")
  if (hex.length !== 6) return null
  return [
    Number.parseInt(hex.slice(0, 2), 16),
    Number.parseInt(hex.slice(2, 4), 16),
    Number.parseInt(hex.slice(4, 6), 16),
  ]
}

export const mapDim = "#2a2438"

export function factionColor(bando: string) {
  const key = bando.trim().toLowerCase()
  if (key.includes("oroszlan")) return palette.oroszlan
  if (key.includes("polip")) return palette.polip
  return palette.otros
}
