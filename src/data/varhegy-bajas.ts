import { csvSources } from "@/data/csv-sources.generated"
import { controlColor } from "@/data/varhegy-division"
import { populationAt, regionKeys, type RegionName } from "@/data/world"
import { parseCsv, toNumber } from "@/lib/parse-csv"

/**
 * Guerra de 2999.
 * - Regiones: quién falta sale del censo (población 2945 menos población 2999).
 * - Bandos de Várhegy: borrador en src/data/csv/varhegy-bajas-2999.csv.
 *   El número es del bando completo y se repite en cada zona de ese bando.
 */

export type Fuego = {
  zona: string
  control: string
  col: number
  fila: number
  color: string
  muertosBando: number
}

export type Ausencia = {
  region: RegionName
  antes: number
  despues: number
  faltan: number
  /** Parte de la población de 2945 que ya no está en 2999, de 0 a 1. */
  parte: number
}

const rows = parseCsv(csvSources["varhegy-bajas-2999"])

export const fuegos: Fuego[] = rows.map((row) => ({
  zona: row.zona,
  control: row.control,
  col: toNumber(row.col),
  fila: toNumber(row.fila),
  color: controlColor[row.control] ?? "#ff7a2e",
  muertosBando: toNumber(row.muertos_bando),
}))

export function fuegoEn(col: number, fila: number) {
  return fuegos.find((fuego) => fuego.col === col && fuego.fila === fila)
}

/** Un número por bando. El CSV repite el total en cada zona: aquí se lee una sola vez. */
export const bajasPorBando = [...new Map(fuegos.map((fuego) => [fuego.control, fuego])).values()]

const demografia = parseCsv(csvSources["varhegy-demografia"])

function ciudadEn(year: number) {
  const row = demografia.find((item) => toNumber(item.anio) === year)
  return toNumber(row?.poblacion_ciudad)
}

export const ciudad2945 = ciudadEn(2945)
export const ciudad2999 = ciudadEn(2999)
export const faltanEnLaCiudad = ciudad2945 - ciudad2999

export const ausenciaRegiones: Ausencia[] = regionKeys.map((region) => {
  const antes = populationAt(region, 2945)
  const despues = populationAt(region, 2999)
  const faltan = Math.max(0, antes - despues)
  return {
    region,
    antes,
    despues,
    faltan,
    parte: antes ? faltan / antes : 0,
  }
})
