import { escalaDe } from "@/data/varhegy"
import { mixHex } from "@/lib/palette"
import { TH, project, rhombus } from "./iso-primitives"

/**
 * Tres losas en el suelo de la calle: ciudad dentro del país, país dentro de Karpatenland.
 * El área sigue la población: el lado de cada losa es la raíz cuadrada de su parte del total.
 * Las cifras salen de varhegy-demografia.csv.
 * Las losas se dibujan antes que los edificios; el rótulo, después, para que no lo tapen.
 */

const REGION = "#14382c"
const REGION_EDGE = "#3dffb0"
const COUNTRY = "#3a3446"
const COUNTRY_EDGE = "#d2c9de"

const SEAL = (() => {
  const a = project(1, 4)
  const b = project(2, 4)
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
})()

/** Cabe en el hueco delantero y aún se lee el país dentro de la región. */
const OUTER = 2.15

function escalaVisual(year: number, cityColor: string) {
  const escala = escalaDe(year)
  if (!escala) return null
  const country = Math.sqrt(escala.pais / escala.region)
  const city = Math.sqrt(escala.ciudad / escala.region)
  return {
    escala,
    country,
    city,
    cityFill: mixHex(cityColor, "#ffffff", 0.4),
  }
}

function porCien(parte: number) {
  if (parte >= 99.5) return "100"
  if (parte < 0.05) return "<1"
  if (parte >= 9.95) return String(Math.round(parte))
  return parte.toLocaleString("es-ES", { minimumFractionDigits: 1, maximumFractionDigits: 1 })
}

function millones(personas: number) {
  const m = personas / 1_000_000
  if (m >= 1000) {
    return Math.round(m)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  }
  if (m >= 100) return String(Math.round(m))
  return m.toLocaleString("es-ES", { maximumFractionDigits: 1 })
}

function lineas(data: NonNullable<ReturnType<typeof escalaVisual>>) {
  const { escala } = data
  const base = escala.region
  return [
    {
      name: "Karpatenland",
      millones: millones(escala.region),
      share: "100",
      color: REGION_EDGE,
    },
    {
      name: "País",
      millones: millones(escala.pais),
      share: porCien((escala.pais / base) * 100),
      color: COUNTRY_EDGE,
    },
    {
      name: "Ciudad",
      millones: millones(escala.ciudad),
      share: porCien((escala.ciudad / base) * 100),
      color: "#fff8ea",
    },
  ]
}
export function GroundScale({
  year,
  cityColor,
  part,
}: {
  year: number
  cityColor: string
  part: "slabs" | "labels"
}) {
  const data = escalaVisual(year, cityColor)
  if (!data) return null

  if (part === "slabs") return <Slabs data={data} />
  return <Labels data={data} />
}

function Slabs({
  data,
}: {
  data: NonNullable<ReturnType<typeof escalaVisual>>
}) {
  const { x, y } = SEAL
  const slabs = [
    { key: "region", scale: OUTER, fill: REGION, edge: REGION_EDGE },
    { key: "pais", scale: OUTER * data.country, fill: COUNTRY, edge: COUNTRY_EDGE },
    { key: "ciudad", scale: OUTER * data.city, fill: data.cityFill, edge: "#fff8ea" },
  ]

  return (
    <g pointerEvents="none">
      <polygon points={rhombus(x, y + 4, OUTER)} fill="#07060c" shapeRendering="crispEdges" />
      {slabs.map((slab) => (
        <polygon
          key={slab.key}
          points={rhombus(x, y, slab.scale)}
          fill={slab.fill}
          stroke={slab.edge}
          strokeWidth={2}
          shapeRendering="crispEdges"
        />
      ))}
    </g>
  )
}

function Labels({
  data,
}: {
  data: NonNullable<ReturnType<typeof escalaVisual>>
}) {
  const lines = lineas(data)
  const { x, y } = SEAL
  const top = y - OUTER * (TH / 2)

  return (
    <g
      role="img"
      pointerEvents="none"
      aria-label={`Karpatenland tiene ${lines[0].millones} millones de habitantes. El país tiene ${lines[1].millones} millones, ${lines[1].share} de cada 100. La ciudad tiene ${lines[2].millones} millones, ${lines[2].share} de cada 100.`}
    >
      <g
        fontFamily="var(--font-heading), sans-serif"
        fontSize={11}
        fill="#f4efe6"
        stroke="#100c14"
        strokeWidth={2.5}
        paintOrder="stroke"
        strokeLinejoin="round"
      >
        {lines.map((line, index) => {
          const ly = top - 8 - index * 14
          return (
            <g key={line.name}>
              <polygon points={rhombus(x - 78, ly - 4, 0.12)} fill={line.color} stroke="none" />
              <text x={x - 64} y={ly}>
                {line.name} {line.millones} millones
              </text>
            </g>
          )
        })}
      </g>
    </g>
  )
}

export function ScaleKey({ year, cityColor }: { year: number; cityColor: string }) {
  const data = escalaVisual(year, cityColor)
  if (!data) return null
  const lines = lineas(data)
  return (
    <div className="space-y-2 px-3 pb-3" aria-label={lines.map((line) => `${line.name}: ${line.millones} millones`).join(", ")}>
      <p className="text-sm text-[#f4efe6]">
        <span className="font-mono text-base tabular-nums">{lines[0].millones}</span> millones de
        habitantes en Karpatenland
      </p>
      <ul className="grid grid-cols-3 gap-2">
        {lines.map((line) => (
          <li key={line.name} className="min-w-0">
            <span className="mb-1.5 block h-1.5 w-full" style={{ backgroundColor: line.color }} aria-hidden />
            <span className="block text-[11px] leading-tight text-[#c8c0d4]">{line.name}</span>
            <span className="font-mono text-sm tabular-nums text-[#f4efe6]">{line.millones}</span>
            <span className="block text-[11px] leading-tight text-[#c8c0d4]">millones · {line.share} de 100</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
