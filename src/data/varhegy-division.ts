import { csvSources } from "@/data/csv-sources.generated"
import { parseCsv, toNumber } from "@/lib/parse-csv"

/** División de Várhegy en 2999 (datos: src/data/csv/varhegy-division-2999.csv). */

export type Zona = { zona: string; control: string; poblacion: number }

export const zonas: Zona[] = parseCsv(csvSources["varhegy-division-2999"]).map((row) => ({
  zona: row.zona,
  control: row.control,
  poblacion: toNumber(row.poblacion),
}))

export const totalCiudad = zonas.reduce((sum, item) => sum + item.poblacion, 0)

/** Color de cada bando de control. */
export const controlColor: Record<string, string> = {
  "Régimen (Oroszlan)": "#4d8cff",
  "Oposición (Polip)": "#c45cff",
  "En disputa": "#ff8a3d",
  Desplazados: "#b7aec8",
}

/** Zonas ordenadas por bando (para que los colores queden juntos). */
export const zonasPorControl = Object.keys(controlColor).map((control) => {
  const items = zonas.filter((item) => item.control === control)
  return {
    control,
    items,
    total: items.reduce((sum, item) => sum + item.poblacion, 0),
  }
})
