import { escalaDe } from "@/data/varhegy"
import { formatPeople } from "@/lib/format"
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
  const { escala, cityFill } = data
  const { x, y } = SEAL
  const lines = [
    { name: "Ciudad", value: formatPeople(escala.ciudad), color: cityFill },
    { name: "País", value: formatPeople(escala.pais), color: COUNTRY_EDGE },
    { name: "Karpatenland", value: formatPeople(escala.region), color: REGION_EDGE },
  ]
  const bottom = y + OUTER * (TH / 2)

  return (
    <g
      role="img"
      pointerEvents="none"
      aria-label={`Escala en el suelo. La ciudad tiene ${formatPeople(escala.ciudad)} habitantes, el país ${formatPeople(escala.pais)} y Karpatenland ${formatPeople(escala.region)}. El tamaño de cada losa sigue cuánta gente vive ahí.`}
    >
      <polyline
        points={`${x},${bottom} ${x},${bottom + 18} ${-158},${bottom + 22}`}
        fill="none"
        stroke={REGION_EDGE}
        strokeWidth={1.25}
      />
      <g
        fontFamily="var(--font-heading), sans-serif"
        fontSize={12}
        fill="#f4efe6"
        stroke="#100c14"
        strokeWidth={2.5}
        paintOrder="stroke"
        strokeLinejoin="round"
      >
        {lines.map((line, index) => {
          const ly = bottom + 36 + index * 15
          return (
            <g key={line.name}>
              <polygon points={rhombus(-166, ly - 4, 0.14)} fill={line.color} stroke="none" />
              <text x={-154} y={ly}>
                {line.name} {line.value}
              </text>
            </g>
          )
        })}
      </g>
    </g>
  )
}
