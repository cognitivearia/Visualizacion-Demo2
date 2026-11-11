import { csvSources } from "@/data/csv-sources.generated"
import { parseCsv, toNumber } from "@/lib/parse-csv"

/** Medidas para la comparativa de tamaño (datos: src/data/csv/varhegy-escala.csv). */

export type Medida = { objeto: string; metros: number; nota: string }

export const medidas: Medida[] = parseCsv(csvSources["varhegy-escala"]).map((row) => ({
  objeto: row.objeto,
  metros: toNumber(row.medida_m),
  nota: row.nota,
}))

export function medidaDe(objeto: string) {
  return medidas.find((item) => item.objeto === objeto)?.metros ?? 0
}
