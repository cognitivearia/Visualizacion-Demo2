import { csvSources } from "@/data/csv-sources.generated"
import { parseCsv, toNumber } from "@/lib/parse-csv"
import { formatPeople, toMillions } from "@/lib/format"

// Los datos vienen de src/data/csv/*.csv (ver scripts/sync-csv.mjs).
const occupationCsv: string = csvSources["division-territorial-3030"]
const censusCsv: string = csvSources["porcentaje-poblacional-por-pais-2730"]
const trendCsv: string = csvSources["tendencia-poblacional"]

export const regionKeys = [
  "Dunántúl",
  "Nagy-Alföld",
  "Karpatenland",
  "Ostseeküste",
  "Alpenvorland",
] as const

export type RegionName = (typeof regionKeys)[number]

export type OccupationRow = {
  nacion: string
  ocupacion: number
}

export type Country2730 = {
  pais: string
  oroszlan: number
  polip: number
  region: RegionName
  pctOroszlan: number
  pctPolip: number
  total: number
}

export type TrendPoint = {
  anio: number
  total: number
  totalM: number
} & Record<RegionName, number>

export type EraPoint = {
  region: RegionName
  poblacion2730: number
  poblacion3030: number
  poblacion2730M: number
  poblacion3030M: number
  cambioPct: number
}

function regionFromRaw(value: string): RegionName {
  const match = regionKeys.find((region) => region === value)
  return match ?? "Dunántúl"
}

export const occupation3030: OccupationRow[] = parseCsv(occupationCsv).map((row) => ({
  nacion: row.nacion,
  ocupacion: toNumber(row.ocupacion),
}))

export const countries2730: Country2730[] = parseCsv(censusCsv).map((row) => {
  const oroszlan = toNumber(row.simpatizantes_de_oroszlan)
  const polip = toNumber(row.oposicion_polip)
  return {
    pais: row.pais,
    oroszlan,
    polip,
    region: regionFromRaw(row.region),
    pctOroszlan: toNumber(row.de_simpatizantes_de_oroszlan),
    pctPolip: toNumber(row.de_oposicion_polip),
    total: oroszlan + polip,
  }
})

export const regions = Array.from(
  new Set(countries2730.map((row) => row.region)),
)

export const populationTrend: TrendPoint[] = parseCsv(trendCsv).map((row) => {
  const values = {
    Dunántúl: toNumber(row.dunantul),
    "Nagy-Alföld": toNumber(row.nagy_alfold),
    Karpatenland: toNumber(row.karpatenland),
    Ostseeküste: toNumber(row.ostseekuste),
    Alpenvorland: toNumber(row.alpenvorland),
  }
  const total = regionKeys.reduce((sum, key) => sum + values[key], 0)
  return {
    anio: toNumber(row.year),
    ...values,
    total,
    totalM: toMillions(total),
  }
})

const year2730 = populationTrend.find((row) => row.anio === 2730)
const year3030 = populationTrend.find((row) => row.anio === 3030)

export const eraComparison: EraPoint[] = regionKeys.map((region) => {
  const before = year2730?.[region] ?? 0
  const after = year3030?.[region] ?? 0
  return {
    region,
    poblacion2730: before,
    poblacion3030: after,
    poblacion2730M: toMillions(before),
    poblacion3030M: toMillions(after),
    cambioPct: before ? ((after - before) / before) * 100 : 0,
  }
})

const latest = populationTrend[populationTrend.length - 1]
const oroszlanShare =
  occupation3030.find((row) => row.nacion === "Oroszlan")?.ocupacion ?? 0

export const kpis = [
  { label: "Año del archivo", value: "3030" },
  { label: "Oroszlan", value: `${oroszlanShare}%` },
  { label: "Países en 2730", value: String(countries2730.length) },
  { label: "Población 3030", value: formatPeople(latest.total) },
]

export const trendYears = populationTrend.map((row) => row.anio)

export const eraMarks = [
  { year: 2568, label: "Origen" },
  { year: 2730, label: "Censo" },
  { year: 2945, label: "Pico" },
  { year: 2999, label: "Guerra" },
  { year: 3030, label: "Ahora" },
] as const

export function peakPopulation(region: RegionName) {
  return Math.max(...populationTrend.map((row) => row[region]))
}

export function populationAt(region: RegionName, year: number) {
  const exact = populationTrend.find((row) => row.anio === year)
  if (exact) return exact[region]

  const next = populationTrend.find((row) => row.anio > year)
  const prev = [...populationTrend].reverse().find((row) => row.anio < year)
  if (!prev && next) return next[region]
  if (prev && !next) return prev[region]
  if (!prev || !next) return 0

  const t = (year - prev.anio) / (next.anio - prev.anio)
  return prev[region] + t * (next[region] - prev[region])
}

export function worldPopulationAt(year: number) {
  return regionKeys.reduce((sum, region) => sum + populationAt(region, year), 0)
}

export const csvFiles = [
  {
    file: "división territorial 3030.csv",
    path: "src/data/csv/division-territorial-3030.csv",
    use: "Ocupación mundial en 3030: Oroszlan, Polip y otros.",
  },
  {
    file: "porcentaje poblacional por país 2730.csv",
    path: "src/data/csv/porcentaje-poblacional-por-pais-2730.csv",
    use: "Simpatizantes de Oroszlan frente a oposición Polip, por país y región.",
  },
  {
    file: "tendencia poblacional.csv",
    path: "src/data/csv/tendencia-poblacional.csv",
    use: "Población de las cinco regiones de 2568 a 3030.",
  },
]
