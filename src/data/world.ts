import { parseCsv, toNumber } from "@/lib/parse-csv"
import { formatPeople, toMillions } from "@/lib/format"

const occupationCsv = `Nación,Ocupación
Oroszlan,48.8%
Polip,48.4%
Otros,2.8%`

const censusCsv = `País,Simpatizantes de Oroszlan,Oposición Polip,región,% de simpatizantes de Oroszlan,% de oposición Polip
Székesvár,4956.908934,105.6885825,Dunántúl,97.9,2.1
Győrhely,4051.096766,278.801548,Dunántúl,93.6,6.4
Pannonburg,4158.892522,429.6504006,Dunántúl,90.6,9.4
Debrecenfeld,5340.89168,758.6968631,Nagy-Alföld,87.6,12.4
Szegedvár,958.6342118,184.1181248,Nagy-Alföld,83.9,16.1
Hortobágy,418.2259769,101.2004033,Nagy-Alföld,80.5,19.5
Königsfeld,2197.382295,676.6563082,Karpatenland,76.5,23.5
Lichtenau,1176.424045,413.643482,Karpatenland,74,26
Várhegy,2651.301015,1131.066099,Karpatenland,70.1,29.9
Stralsundheim,3176.158416,1574.802849,Ostseeküste,66.9,33.1
Kielerholm,500.2290431,282.1472627,Ostseeküste,63.9,36.1
Bergheim,1346.052713,863.5377148,Alpenvorland,60.9,39.1
Innsbrucktal,855.0887825,668.6309689,Alpenvorland,56.1,43.9`

const trendCsv = `Year,Dunántúl,Nagy-Alföld,Karpatenland,Ostseeküste,Alpenvorland
2568,766747939,436414138,649984210,332085080,841753060
2730,839528911,474222906,775912340,586492170,702862278
2809,1021442216,495229454,911680730,508258920,819836619
2869,1280165750,526240276,1009797863,591579940,938303285
2945,1540177846,658903978,1319469878,787940140,980046759
2999,704201243,410873499,467799438,82886853,162061788
3010,659157743,398174895,219080863,105831537,194139982
3020,894753596,320075894,385722835,138875639,221814953
3030,847393877,209746934,361441805,187358958,247705111`

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
