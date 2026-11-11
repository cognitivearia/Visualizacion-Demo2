import { csvSources } from "@/data/csv-sources.generated"
import { parseCsv, toNumber } from "@/lib/parse-csv"

/**
 * Datos de la vida en la ciudad (borrador: src/data/csv/varhegy-vida-urbana.csv).
 * Cada año solo trae las columnas que le tocan. Una celda vacía no es un cero.
 */

export type VidaUrbana = {
  anio: number
  escanosOroszlan?: number
  escanosPolip?: number
  horasMedia?: number
  racionDia?: number
  muralesTotales?: number
  muralesVisibles?: number
  nota: string
}

function optional(value: string | undefined) {
  if (!value?.trim()) return undefined
  return toNumber(value)
}

export const vidaUrbana: VidaUrbana[] = parseCsv(csvSources["varhegy-vida-urbana"]).map((row) => ({
  anio: toNumber(row.anio),
  escanosOroszlan: optional(row.escanos_oroszlan),
  escanosPolip: optional(row.escanos_polip),
  horasMedia: optional(row.horas_media),
  racionDia: optional(row.racion_dia),
  muralesTotales: optional(row.murales_totales),
  muralesVisibles: optional(row.murales_visibles),
  nota: row.nota,
}))

export function vidaDe(year: number) {
  return vidaUrbana.find((item) => item.anio === year)
}
