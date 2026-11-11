import { csvSources } from "@/data/csv-sources.generated"
import { parseCsv, toNumber } from "@/lib/parse-csv"

/** Capas del suelo de Várhegy en 2568 (datos: src/data/csv/varhegy-estratos-2568.csv). */

export type StratumMaterial = {
  name: string
  pct: number
  /** Es el metal precioso (Lenario). */
  precious: boolean
}

export type Stratum = {
  name: string
  order: number
  fromM: number
  toM: number
  materials: StratumMaterial[]
}

export const strata: Stratum[] = (() => {
  const byName = new Map<string, Stratum>()
  for (const row of parseCsv(csvSources["varhegy-estratos-2568"])) {
    const existing = byName.get(row.capa)
    const stratum: Stratum = existing ?? {
      name: row.capa,
      order: toNumber(row.orden),
      fromM: toNumber(row.desde_m),
      toM: toNumber(row.hasta_m),
      materials: [],
    }
    stratum.materials.push({
      name: row.material,
      pct: toNumber(row.porcentaje),
      precious: row.destacado.trim().length > 0,
    })
    byName.set(row.capa, stratum)
  }
  return [...byName.values()].sort((a, b) => a.order - b.order)
})()

const materialColors: Record<string, string> = {
  "Materia orgánica": "#2b1d12",
  Arcilla: "#b0693c",
  Arena: "#d9bd84",
  Agua: "#4d8cff",
  Limo: "#8f7e5c",
  Cuarzo: "#efe9da",
  Hierro: "#c0452c",
  Feldespato: "#e8aaa0",
  Mica: "#d3d6df",
  Calcita: "#f4f0e0",
  Dolomita: "#dccfae",
  Sílice: "#bcd9e0",
  Cobre: "#d98a3a",
  Lenario: "#3dffb0",
}

export function materialColor(name: string) {
  return materialColors[name] ?? "#888888"
}

/** Tono de fondo de cada capa, de la superficie hacia abajo. */
export const strataTones = ["#4a3321", "#7a4f33", "#85796a", "#a9a58f", "#2f2f45"]
