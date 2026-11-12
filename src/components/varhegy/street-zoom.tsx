"use client"

import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { scenes } from "@/data/varhegy"
import { habitantesDe, type Habitante } from "@/data/varhegy-habitantes"
import { vidaDe, type VidaUrbana } from "@/data/varhegy-vida"
import { palette as brand, mixHex } from "@/lib/palette"
import { cn } from "@/lib/utils"
import { GroundScale, ScaleKey } from "./ground-scale"
import { TH, TW, UNIT, project, rhombus } from "./iso-primitives"
import { Building } from "./sprites"
import { ModalShell } from "./modal-shell"

/**
 * Zoom a la calle (momentos 2 y 3): una calle con personas.
 * Tocar a una persona abre su expediente, con aspecto de documento clasificado.
 * En 2730 el expediente tiene los datos básicos; desde 2945 suma horas, medicinas y
 * la proporción mecánico / natural.
 */

// Una letra = una casilla. Edificios (números), aceras (-) y calzada (=).
const STREET = [
  "3543245353",
  "----------",
  "==========",
  "----------",
  "1..1.1..1.",
]

/** Dónde se para cada persona (columna, fila) en 2945, sobre la calle entera. */
const SPOTS: Array<[number, number]> = [
  [1, 1], [2, 3], [3, 2], [4, 1], [5, 3], [6, 2], [7, 1], [8, 3], [2, 2], [8, 2],
]

/**
 * 2730 se recorre en 5 tramos, de izquierda a derecha, como en el dibujo de Mari.
 * Cada tramo son 2 columnas de la calle y 2 personas.
 */
export const STREET_SLICES = 5
const SLICE_COLS = STREET[0].length / STREET_SLICES

const SLICE_SPOTS: Array<[number, number]> = [
  [0, 1], [1, 3],
  [2, 1], [3, 3],
  [4, 1], [5, 3],
  [6, 1], [7, 3],
  [8, 1], [9, 3],
]

/** Qué tramo abre una casilla de la calle en el mapa de la ciudad (8×8). */
export function sliceForStreetCell(col: number, row: number) {
  const along = row === 3 ? col : row
  return Math.min(STREET_SLICES - 1, Math.floor((along / 8) * STREET_SLICES))
}

export function sliceViewBox(slice: number) {
  const start = slice * SLICE_COLS
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  for (let col = start; col < start + SLICE_COLS; col += 1) {
    for (let row = 0; row < STREET.length; row += 1) {
      const { x, y } = project(col, row)
      const ch = STREET[row][col] ?? "."
      const floors = /^[1-9]$/.test(ch) ? Number(ch) : 0
      minX = Math.min(minX, x - TW / 2)
      maxX = Math.max(maxX, x + TW / 2)
      const lift = Math.max(floors * UNIT + (floors >= 5 ? 16 : 0), 52)
      minY = Math.min(minY, y - lift)
      maxY = Math.max(maxY, y + TH / 2)
    }
  }
  const padX = 28
  const padY = 18
  return `${minX - padX} ${minY - padY} ${maxX - minX + padX * 2} ${maxY - minY + padY * 2}`
}

export function sliceStart(slice: number) {
  return slice * SLICE_COLS
}

const SKIN = ["#f1c9a5", "#d9a66f", "#b9814f", "#8a5a34", "#e8b98f"]
const HAIR = ["#2b1d12", "#5a3b1e", "#1a1a22", "#8a6a3a", "#3a2a2a"]
const MECH = "#22d3ee"
const NATURAL = "#a3e635"

const VIEW_BOX = "-180 -105 500 335"
/** Las personas se dibujan más grandes que la casilla para poder tocarlas y verlas bien. */
const PERSON_SCALE = 1.5

function Person({
  person,
  index,
  col,
  row,
  selected,
  onSelect,
}: {
  person: Habitante
  index: number
  col: number
  row: number
  selected: boolean
  onSelect: () => void
}) {
  const { x, y } = project(col, row)
  const side = person.asociacion === "Oroszlan" ? brand.oroszlan : brand.polip
  const mech = person.pctMecanico ?? 0

  return (
    <g
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      aria-label={`${person.nombre}, ${person.edad} años. Abrir expediente.`}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault()
          onSelect()
        }
      }}
      className="cursor-pointer outline-none [&:focus-visible_.person-ring]:stroke-white"
    >
      <polygon
        className={cn("person-ring", selected && "hotspot-pulse")}
        points={rhombus(x, y, 0.7)}
        fill={selected ? "#ffffff" : "transparent"}
        fillOpacity={0.18}
        stroke={selected ? "#ffffff" : "transparent"}
        strokeWidth={2}
        shapeRendering="crispEdges"
      />
      <g
        shapeRendering="crispEdges"
        transform={`translate(${x} ${y}) scale(${PERSON_SCALE}) translate(${-x} ${-y})`}
      >
        <rect x={x - 6} y={y - 1} width={12} height={3} fill="#000000" fillOpacity={0.35} />
        <rect x={x - 4} y={y - 9} width={3} height={9} fill="#2b2736" />
        <rect x={x + 1} y={y - 9} width={3} height={9} fill="#2b2736" />
        <rect x={x - 5} y={y - 22} width={10} height={14} fill={side} />
        <rect x={x - 5} y={y - 22} width={10} height={3} fill={mixHex(side, "#ffffff", 0.3)} />
        <rect x={x - 4} y={y - 30} width={8} height={8} fill={SKIN[index % SKIN.length]} />
        <rect x={x - 4} y={y - 31} width={8} height={3} fill={HAIR[index % HAIR.length]} />
        {mech >= 30 && <rect x={x + 5} y={y - 21} width={3} height={11} fill={MECH} />}
        {mech >= 50 && <rect x={x + 1} y={y - 27} width={2} height={2} fill={MECH} />}
      </g>
      {/* Zona de toque más grande que el dibujo. */}
      <rect x={x - 16} y={y - 50} width={32} height={56} fill="transparent" />
    </g>
  )
}

function Donut({ mech, natural }: { mech: number; natural: number }) {
  const radius = 34
  const circ = 2 * Math.PI * radius
  const mechLen = (mech / 100) * circ
  return (
    <svg
      viewBox="0 0 96 96"
      className="size-24 shrink-0"
      role="img"
      aria-label={`${mech} por ciento mecánico, ${natural} por ciento natural`}
    >
      <g transform="rotate(-90 48 48)" fill="none" strokeWidth={16}>
        <circle cx={48} cy={48} r={radius} stroke={NATURAL} />
        <circle
          cx={48}
          cy={48}
          r={radius}
          stroke={MECH}
          strokeDasharray={`${mechLen} ${circ - mechLen}`}
        />
      </g>
    </svg>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</dt>
      <dd className="text-sm">{children}</dd>
    </div>
  )
}

function Redacted({ width }: { width: string }) {
  return (
    <span
      className="inline-block h-3 translate-y-0.5 bg-foreground/85"
      style={{ width }}
      aria-hidden
    />
  )
}

function Dossier({
  person,
  number,
  city,
}: {
  person: Habitante
  number: string
  city?: VidaUrbana
}) {
  const side = person.asociacion === "Oroszlan" ? brand.oroszlan : brand.polip
  const hasWork = person.horas !== undefined

  return (
    <article
      key={person.nombre}
      aria-live="polite"
      className="relative space-y-4 rounded-md border-2 border-dashed border-foreground/30 bg-background/70 p-4 font-mono motion-safe:animate-in motion-safe:fade-in motion-safe:duration-300"
    >
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Expediente Nº {number}
          </p>
          <h3 className="mt-1 text-lg leading-tight">{person.nombre}</h3>
        </div>
        <span
          className="-rotate-6 rounded border-2 border-destructive px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-destructive"
          aria-label="Documento clasificado"
        >
          Clasificado
        </span>
      </header>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
        <Field label="Edad">{person.edad} años</Field>
        <Field label="Género">{person.genero === "F" ? "Femenino" : "Masculino"}</Field>
        <Field label="Familia">{person.familia} integrantes</Field>
        <Field label="Afinidad">
          <span style={{ color: side }}>{person.asociacion}</span>
        </Field>
      </dl>

      <div>
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Dato</p>
        <p className="text-sm">{person.dato}</p>
      </div>

      {hasWork && (
        <div className="space-y-3 border-t border-dashed border-foreground/20 pt-3">
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
            <Field label="Horas por semana">{person.horas} h</Field>
            <Field label="Medicinas al día">
              <span className="flex flex-wrap items-center gap-1">
                <span className="mr-1">{person.medicinas}</span>
                {Array.from({ length: person.medicinas ?? 0 }).map((_, i) => (
                  <span key={i} className="size-2 rounded-[2px] bg-foreground/70" aria-hidden />
                ))}
              </span>
            </Field>
          </dl>
          <div className="flex items-center gap-4">
            <Donut mech={person.pctMecanico ?? 0} natural={person.pctNatural ?? 0} />
            <ul className="space-y-1 text-sm">
              <li className="flex items-center gap-2">
                <span className="size-2.5 rounded-sm" style={{ backgroundColor: MECH }} aria-hidden />
                Mecánico {person.pctMecanico} %
              </li>
              <li className="flex items-center gap-2">
                <span className="size-2.5 rounded-sm" style={{ backgroundColor: NATURAL }} aria-hidden />
                Natural {person.pctNatural} %
              </li>
            </ul>
          </div>
        </div>
      )}

      {city?.horasMedia !== undefined && (
        <p className="text-xs text-muted-foreground">
          En la ciudad se trabajan {city.horasMedia} h por semana
          {city.racionDia !== undefined ? ` y la ración es de ${city.racionDia} al día` : ""}.
        </p>
      )}

      <p className="text-xs text-muted-foreground">
        Observaciones: <Redacted width="5rem" /> <Redacted width="3rem" />
        <br />
        Autorizó: <Redacted width="6rem" />
      </p>
    </article>
  )
}

function CouncilNotice({ city }: { city: VidaUrbana }) {
  const oroszlan = city.escanosOroszlan ?? 0
  const polip = city.escanosPolip ?? 0
  const seats = [
    ...Array.from({ length: oroszlan }, () => brand.oroszlan),
    ...Array.from({ length: polip }, () => brand.polip),
  ]

  return (
    <article className="space-y-3 rounded-md border-2 border-dashed border-foreground/30 bg-background/70 p-4">
      <header>
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Consejo de la ciudad</p>
        <h3 className="mt-1 font-mono text-lg tabular-nums">
          {oroszlan} <span style={{ color: brand.oroszlan }}>Oroszlan</span>
          {" · "}
          {polip} <span style={{ color: brand.polip }}>Polip</span>
        </h3>
      </header>
      <div
        className="flex flex-wrap gap-1"
        role="img"
        aria-label={`${oroszlan} escaños de Oroszlan y ${polip} de Polip, ${seats.length} en total`}
      >
        {seats.map((color, index) => (
          <span key={index} className="size-3" style={{ backgroundColor: color }} aria-hidden />
        ))}
      </div>
      <p className="text-sm text-muted-foreground">
        {oroszlan - polip > 4
          ? "El régimen ocupa casi toda la bancada."
          : "La bancada ya no tiene una mayoría clara."}
      </p>
      {city.horasMedia !== undefined && (
        <p className="text-sm text-muted-foreground">
          Jornada media de la ciudad: {city.horasMedia} h. Ración: {city.racionDia} al día.
        </p>
      )}
    </article>
  )
}

export function StreetZoom({
  year,
  cityPopulation,
  onClose,
  initialSlice,
}: {
  year: number
  cityPopulation: string
  onClose: () => void
  /** En 2730 y 2945, el tramo de la calle que se abre. */
  initialSlice?: number
}) {
  const people = habitantesDe(year)
  const sliced = initialSlice !== undefined
  const [slice, setSlice] = useState(initialSlice ?? 0)
  const [selected, setSelected] = useState<number | null>(null)
  const scene = scenes.find((item) => item.year === year)
  const colors = scene?.palette
  const person = selected === null ? null : people[selected]
  const city = vidaDe(year)
  const spots = sliced ? SLICE_SPOTS : SPOTS
  const startCol = sliceStart(slice)

  useEffect(() => {
    if (!sliced) return
    function onKey(event: KeyboardEvent) {
      if (event.key === "ArrowRight") moveSlice(Math.min(STREET_SLICES - 1, slice + 1))
      if (event.key === "ArrowLeft") moveSlice(Math.max(0, slice - 1))
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [sliced, slice])

  function moveSlice(next: number) {
    setSlice(next)
    setSelected(null)
  }

  // Las casillas se dibujan de atrás hacia delante.
  const cells = STREET.flatMap((line, row) =>
    Array.from(line).map((ch, col) => ({ col, row, ch })),
  ).sort((a, b) => a.col + a.row - (b.col + b.row))

  const standing = people
    .map((p, index) => ({ person: p, index, spot: spots[index % spots.length] }))
    .filter((item) => !sliced || (item.spot[0] >= startCol && item.spot[0] < startCol + SLICE_COLS))
    .sort((a, b) => a.spot[0] + a.spot[1] - (b.spot[0] + b.spot[1]))

  return (
    <ModalShell
      label={`Zoom a la calle de Várhegy en ${year}`}
      onClose={onClose}
      className="max-w-5xl md:p-8"
    >
      <header className="mb-4 space-y-3 pr-10">
        <p className="font-heading text-xs tracking-widest text-primary">
          {year} · {sliced ? `Casilla ${slice + 1} de ${STREET_SLICES}` : "La calle"}
        </p>
        {sliced ? (
          <div className="flex items-center justify-between gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => moveSlice(slice - 1)}
              disabled={slice === 0}
            >
              <ChevronLeft />
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => moveSlice(slice + 1)}
              disabled={slice === STREET_SLICES - 1}
            >
              Siguiente
              <ChevronRight />
            </Button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Muestra de {people.length} personas de una ciudad de {cityPopulation} habitantes. Toca a
            alguien para abrir su expediente. Las losas del suelo comparan la ciudad, el país y
            Karpatenland.
          </p>
        )}
      </header>

      <div className="flex flex-col gap-6 md:flex-row md:items-start">
        <div className="min-w-0 flex-1 overflow-hidden rounded-lg" style={{ backgroundColor: colors?.sky ?? "#222" }}>
        <svg
          viewBox={sliced ? sliceViewBox(slice) : VIEW_BOX}
          className="block w-full"
          role="group"
          aria-label={`Calle de Várhegy con ${people.length} personas`}
        >
          {cells.map((cell) => {
            const { x, y } = project(cell.col, cell.row)
            const ground =
              cell.ch === "="
                ? (colors?.road ?? "#2b2736")
                : cell.ch === "-"
                  ? mixHex(colors?.groundA ?? "#4a4560", "#ffffff", 0.12)
                  : (cell.col + cell.row) % 2 === 0
                    ? (colors?.groundA ?? "#4a4560")
                    : (colors?.groundB ?? "#524c69")
            return (
              <g key={`${cell.col}-${cell.row}`}>
                <polygon points={rhombus(x, y)} fill={ground} shapeRendering="crispEdges" />
                {cell.ch === "=" && cell.col % 2 === 0 && (
                  <polygon
                    points={rhombus(x, y, 0.18)}
                    fill="#e8e2d4"
                    fillOpacity={0.5}
                    shapeRendering="crispEdges"
                  />
                )}
              </g>
            )
          })}

          <GroundScale part="slabs" year={year} cityColor={colors?.building ?? "#c97b5a"} />

          {cells.map((cell) => {
            if (!/^[1-9]$/.test(cell.ch)) return null
            const { x, y } = project(cell.col, cell.row)
            return (
              <Building
                key={`b-${cell.col}-${cell.row}`}
                x={x}
                y={y}
                floors={Number(cell.ch)}
                color={colors?.building ?? "#c97b5a"}
                glow={year >= 2945 ? "#7ee7ff" : "#ffd166"}
                lit={0.75}
                seed={cell.col + cell.row}
              />
            )
          })}

          {standing.map(({ person: p, index, spot }) => (
            <Person
              key={p.nombre}
              person={p}
              index={index}
              col={spot[0]}
              row={spot[1]}
              selected={selected === index}
              onSelect={() => setSelected(index)}
            />
          ))}

          {sliced ? null : (
            <GroundScale part="labels" year={year} cityColor={colors?.building ?? "#c97b5a"} />
          )}
        </svg>
        {sliced && <ScaleKey year={year} cityColor={colors?.building ?? "#c97b5a"} />}
        </div>

        <div className="w-full shrink-0 md:w-80">
          {person && selected !== null ? (
            <Dossier
              person={person}
              number={`${year}-${String(selected + 1).padStart(2, "0")}`}
              city={city}
            />
          ) : city?.escanosOroszlan !== undefined ? (
            <CouncilNotice city={city} />
          ) : (
            <div className="rounded-md border-2 border-dashed border-foreground/20 p-6 text-center font-mono text-sm text-muted-foreground">
              Expediente cerrado.
              <br />
              Elige a alguien de la calle.
            </div>
          )}
        </div>
      </div>
    </ModalShell>
  )
}
