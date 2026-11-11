"use client"

import { useState } from "react"
import { scenes } from "@/data/varhegy"
import { vidaDe } from "@/data/varhegy-vida"
import { palette as brand, mixHex } from "@/lib/palette"
import { cn } from "@/lib/utils"
import { GroundScale } from "./ground-scale"
import { UNIT, project, rhombus } from "./iso-primitives"
import { Building } from "./sprites"
import { ModalShell } from "./modal-shell"

/**
 * Zoom a la calle del momento 5 (3030). Sin datos de personas: solo uniformes, militantes y banderas.
 * Todo en azul Oroszlan; lo único que cambia entre figuras es el accesorio.
 * Los textos de cada figura son borrador.
 */

const STREET = ["3543245353", "----------", "==========", "----------", "1..1.1..1."]

type Role = "soldado" | "militante" | "funcionario" | "civil"

const ROLES: Record<Role, { name: string; text: string }> = {
  soldado: {
    name: "Soldado",
    text: "Patrulla la calle. Su casco y su arma son lo primero que se ve de él.",
  },
  militante: {
    name: "Militante",
    text: "Lleva el brazalete del partido. Vigila a los vecinos y avisa si algo cambia.",
  },
  funcionario: {
    name: "Funcionario",
    text: "Gorra y carpeta: administra permisos, cupos y papeles.",
  },
  civil: {
    name: "Civil uniformado",
    text: "Ya no hay ropa de calle: todos visten el mismo azul.",
  },
}

/** Dónde se para cada figura (columna, fila) y qué rol tiene. */
const CROWD: Array<{ spot: [number, number]; role: Role }> = [
  { spot: [1, 1], role: "soldado" },
  { spot: [2, 3], role: "civil" },
  { spot: [3, 2], role: "militante" },
  { spot: [4, 1], role: "civil" },
  { spot: [5, 3], role: "soldado" },
  { spot: [6, 2], role: "funcionario" },
  { spot: [7, 1], role: "civil" },
  { spot: [8, 3], role: "militante" },
  { spot: [2, 2], role: "civil" },
  { spot: [8, 2], role: "soldado" },
]

const SKIN = ["#e8b98f", "#d9a66f", "#f1c9a5", "#b9814f", "#8a5a34"]
const VIEW_BOX = "-180 -135 500 365"
const PERSON_SCALE = 1.5
const BLUE = brand.oroszlan
const MURAL_COLORS = ["#c45cff", "#e6b15a"]

function muralSlots(
  cells: Array<{ col: number; row: number; ch: string }>,
  total: number,
  visible: number,
) {
  const buildings = cells.filter((cell) => /^[1-9]$/.test(cell.ch)).slice(0, total)
  const firstVisible = Math.max(0, total - visible)
  return new Map(
    buildings.map((cell, index) => [
      `${cell.col}-${cell.row}`,
      {
        visible: index >= firstVisible,
        color: MURAL_COLORS[(index - firstVisible) % MURAL_COLORS.length] ?? MURAL_COLORS[0],
      },
    ]),
  )
}

function MuralPatch({
  x,
  y,
  height,
  visible,
  color,
}: {
  x: number
  y: number
  height: number
  visible: boolean
  color: string
}) {
  const top = y - height * UNIT * 0.72
  return (
    <g shapeRendering="crispEdges">
      <rect
        x={x + 4}
        y={top}
        width={14}
        height={10}
        fill={visible ? color : mixHex(BLUE, "#061022", 0.35)}
      />
      {visible ? (
        <>
          <rect x={x + 6} y={top + 2} width={4} height={4} fill="#f4f0ff" />
          <rect x={x + 11} y={top + 5} width={5} height={3} fill={mixHex(color, "#000000", 0.35)} />
        </>
      ) : (
        <rect x={x + 4} y={top + 4} width={14} height={2} fill={BLUE} />
      )}
    </g>
  )
}

function Figure({
  role,
  index,
  col,
  row,
  selected,
  onSelect,
}: {
  role: Role
  index: number
  col: number
  row: number
  selected: boolean
  onSelect: () => void
}) {
  const { x, y } = project(col, row)
  const dark = mixHex(BLUE, "#000000", 0.45)
  const light = mixHex(BLUE, "#ffffff", 0.35)

  return (
    <g
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      aria-label={`${ROLES[role].name}. Ver descripción.`}
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
        <rect x={x - 4} y={y - 9} width={3} height={9} fill={dark} />
        <rect x={x + 1} y={y - 9} width={3} height={9} fill={dark} />
        <rect x={x - 5} y={y - 22} width={10} height={14} fill={BLUE} />
        <rect x={x - 5} y={y - 22} width={10} height={3} fill={light} />
        <rect x={x - 4} y={y - 30} width={8} height={8} fill={SKIN[index % SKIN.length]} />
        {role === "soldado" && (
          <>
            <rect x={x - 5} y={y - 33} width={10} height={6} fill={dark} />
            <rect x={x + 5} y={y - 26} width={2} height={18} fill="#0b0912" />
          </>
        )}
        {role === "militante" && (
          <>
            <rect x={x - 4} y={y - 31} width={8} height={3} fill={dark} />
            <rect x={x - 5} y={y - 17} width={10} height={3} fill="#ffffff" />
          </>
        )}
        {role === "funcionario" && (
          <>
            <rect x={x - 5} y={y - 33} width={10} height={4} fill={dark} />
            <rect x={x + 5} y={y - 16} width={4} height={6} fill="#e8e2d4" />
          </>
        )}
        {role === "civil" && <rect x={x - 4} y={y - 31} width={8} height={3} fill={dark} />}
      </g>
      <rect x={x - 16} y={y - 52} width={32} height={58} fill="transparent" />
    </g>
  )
}

/** Bandera sobre un edificio: mástil y paño azul con un emblema blanco. */
function Flag({ col, row, height }: { col: number; row: number; height: number }) {
  const { x, y } = project(col, row)
  const top = y - height * UNIT
  return (
    <g shapeRendering="crispEdges">
      <rect x={x - 1} y={top - 30} width={2} height={30} fill="#e8e2d4" />
      <rect x={x + 1} y={top - 30} width={20} height={13} fill={BLUE} />
      <rect x={x + 8} y={top - 26} width={6} height={6} fill="#ffffff" />
    </g>
  )
}

export function RegimeStreet({ onClose }: { onClose: () => void }) {
  const [selected, setSelected] = useState<number | null>(null)
  const colors = scenes.find((item) => item.year === 3030)?.palette
  const role = selected === null ? null : CROWD[selected].role

  const cells = STREET.flatMap((line, row) =>
    Array.from(line).map((ch, col) => ({ col, row, ch })),
  ).sort((a, b) => a.col + a.row - (b.col + b.row))

  const city = vidaDe(3030)
  const murales = muralSlots(cells, city?.muralesTotales ?? 0, city?.muralesVisibles ?? 0)
  const standing = CROWD.map((item, index) => ({ ...item, index })).sort(
    (a, b) => a.spot[0] + a.spot[1] - (b.spot[0] + b.spot[1]),
  )

  return (
    <ModalShell label="Zoom a la calle de Várhegy en 3030" onClose={onClose} className="max-w-5xl md:p-8">
      <header className="mb-4 space-y-1 pr-10">
        <p className="font-heading text-xs tracking-widest text-primary">3030 · La calle</p>
        <p className="text-sm text-muted-foreground">
          Ya no hay expedientes ni cifras de personas. De {city?.muralesTotales ?? 0} murales, quedan{" "}
          {city?.muralesVisibles ?? 0} visibles. Las losas del suelo comparan la ciudad, el país y
          Karpatenland.
        </p>
      </header>

      <div className="flex flex-col gap-6 md:flex-row md:items-start">
        <svg
          viewBox={VIEW_BOX}
          className="w-full min-w-0 flex-1 rounded-lg"
          style={{ backgroundColor: colors?.sky ?? "#0d1a3a" }}
          role="group"
          aria-label={`Calle de Várhegy en 3030. Quedan ${city?.muralesVisibles ?? 0} murales visibles de ${city?.muralesTotales ?? 0}.`}
        >
          {cells.map((cell) => {
            const { x, y } = project(cell.col, cell.row)
            const ground =
              cell.ch === "="
                ? (colors?.road ?? "#0b1630")
                : cell.ch === "-"
                  ? mixHex(colors?.groundA ?? "#16306b", "#ffffff", 0.1)
                  : (cell.col + cell.row) % 2 === 0
                    ? (colors?.groundA ?? "#16306b")
                    : (colors?.groundB ?? "#1b3a80")
            return (
              <g key={`${cell.col}-${cell.row}`}>
                <polygon points={rhombus(x, y)} fill={ground} shapeRendering="crispEdges" />
              </g>
            )
          })}

          <GroundScale part="slabs" year={3030} cityColor={colors?.accent ?? "#9bbcff"} />

          {cells.map((cell) => {
            if (!/^[1-9]$/.test(cell.ch)) return null
            const { x, y } = project(cell.col, cell.row)
            const mural = murales.get(`${cell.col}-${cell.row}`)
            return (
              <g key={`b-${cell.col}-${cell.row}`}>
                <Building
                  x={x}
                  y={y}
                  floors={Number(cell.ch)}
                  color={colors?.building ?? BLUE}
                  glow="#e7f0ff"
                  lit={0.85}
                  seed={cell.col + cell.row}
                />
                {mural && (
                  <MuralPatch
                    x={x}
                    y={y}
                    height={Number(cell.ch)}
                    visible={mural.visible}
                    color={mural.color}
                  />
                )}
                {cell.row === 0 && cell.col % 3 === 1 && (
                  <Flag col={cell.col} row={cell.row} height={Number(cell.ch)} />
                )}
              </g>
            )
          })}

          {standing.map(({ role: r, index, spot }) => (
            <Figure
              key={index}
              role={r}
              index={index}
              col={spot[0]}
              row={spot[1]}
              selected={selected === index}
              onSelect={() => setSelected(index)}
            />
          ))}

          <GroundScale part="labels" year={3030} cityColor={colors?.accent ?? "#9bbcff"} />
        </svg>

        <div className="w-full shrink-0 space-y-3 md:w-72" aria-live="polite">
          <div
            className="flex flex-wrap gap-1"
            role="img"
            aria-label={`${city?.muralesVisibles ?? 0} murales visibles de ${city?.muralesTotales ?? 0}`}
          >
            {Array.from({ length: city?.muralesTotales ?? 0 }, (_, index) => {
              const visible = index >= (city?.muralesTotales ?? 0) - (city?.muralesVisibles ?? 0)
              return (
                <span
                  key={index}
                  className="size-4"
                  style={{
                    backgroundColor: visible
                      ? MURAL_COLORS[(index - ((city?.muralesTotales ?? 0) - (city?.muralesVisibles ?? 0))) % MURAL_COLORS.length]
                      : mixHex(BLUE, "#061022", 0.45),
                  }}
                  aria-hidden
                />
              )
            })}
          </div>
          {role ? (
            <div className="rounded-md border-2 border-dashed border-foreground/30 bg-background/70 p-4 motion-safe:animate-in motion-safe:fade-in">
              <h3 className="font-heading text-sm tracking-wide">{ROLES[role].name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{ROLES[role].text}</p>
            </div>
          ) : (
            <div className="rounded-md border-2 border-dashed border-foreground/20 p-6 text-center text-sm text-muted-foreground">
              Toca una figura de la calle.
            </div>
          )}
        </div>
      </div>
    </ModalShell>
  )
}
