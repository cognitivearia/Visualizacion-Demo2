import { csvSources } from "@/data/csv-sources.generated"
import { parseCsv, toNumber } from "@/lib/parse-csv"

/** Personas de Várhegy (datos: src/data/csv/varhegy-habitantes.csv). */

export type Habitante = {
  year: number
  nombre: string
  edad: number
  genero: "F" | "M"
  familia: number
  dato: string
  asociacion: "Oroszlan" | "Polip"
  /** Solo desde 2945. */
  horas?: number
  medicinas?: number
  pctMecanico?: number
  pctNatural?: number
}

function optional(value: string | undefined) {
  return value !== undefined && value.trim().length > 0 ? toNumber(value) : undefined
}

const all: Habitante[] = parseCsv(csvSources["varhegy-habitantes"]).map((row) => ({
  year: toNumber(row.anio),
  nombre: row.nombre,
  edad: toNumber(row.edad),
  genero: row.genero === "F" ? "F" : "M",
  familia: toNumber(row.integrantes_familia),
  dato: row.dato_aleatorio,
  asociacion: row.asociacion_politica === "Polip" ? "Polip" : "Oroszlan",
  horas: optional(row.horas_semana),
  medicinas: optional(row.medicinas_dia),
  pctMecanico: optional(row.pct_mecanico),
  pctNatural: optional(row.pct_natural),
}))

export function habitantesDe(year: number) {
  return all.filter((person) => person.year === year)
}
