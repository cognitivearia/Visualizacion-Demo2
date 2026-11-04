"use client"

import { useEffect, useId, useRef, useState } from "react"
import type { PersonId, PersonTint, SoilLayer } from "@/data/moments"
import { firstBuildings, sampleSoil, townspeople } from "@/data/moments"
import { palette } from "@/lib/palette"

const COLS = 8
const ROWS = 7
const HALF_W = 40
const HALF_H = 20
const LENS_W = 208
const LENS_H = 308

const EARTH = ["#f3d27a", "#e8b84a", "#e09432", "#d36a2e", "#c45528", "#f0c56a"]

const colonies: { col: number; row: number; levels: number; tint: "gold" | "clay" | "leaf" }[] = [
  { col: 2, row: 1, levels: 1, tint: "gold" },
  { col: 3, row: 1, levels: 2, tint: "gold" },
  { col: 2, row: 2, levels: 1, tint: "gold" },
  { col: 6, row: 2, levels: 1, tint: "clay" },
  { col: 6, row: 3, levels: 1, tint: "clay" },
  { col: 3, row: 5, levels: 1, tint: "leaf" },
  { col: 4, row: 4, levels: 1, tint: "leaf" },
  { col: 4, row: 5, levels: 2, tint: "leaf" },
]

const colonyPaint = {
  gold: { top: "#ffe14a", left: "#a16207", right: "#f5b942" },
  clay: { top: "#ff7a3c", left: "#9a3412", right: "#ea580c" },
  leaf: { top: "#9bef55", left: "#3f6212", right: "#65a30d" },
} as const

const STONE = { top: "#d7c4a8", left: "#6b5344", right: "#a88868" }
const ROOF = {
  clay: "#c45528",
  slate: "#5c5346",
} as const

const personPaint: Record<PersonTint, { top: string; left: string; right: string; head: string }> = {
  denim: { top: "#3d5a80", left: "#1d3557", right: "#7aa2c4", head: "#f0c9a0" },
  red: { top: "#c44536", left: "#7f1d1d", right: "#f07167", head: "#e8b48a" },
  green: { top: "#3f6b4a", left: "#1f3d2b", right: "#7dcea0", head: "#d7a574" },
  ochre: { top: "#c9a227", left: "#7a5b12", right: "#e6c35c", head: "#f3d5b5" },
}

export type GroundScene = "baldio" | "civilizacion" | "incertidumbre" | "fuego" | "cerrado"

const PIXEL_CIRCLE =
  "polygon(18% 0, 82% 0, 100% 18%, 100% 82%, 82% 100%, 18% 100%, 0 82%, 0 18%)"

type Cell = { col: number; row: number; x: number; y: number }

const cells: Cell[] = Array.from({ length: ROWS }, (_, row) =>
  Array.from({ length: COLS }, (_, col) => ({
    col,
    row,
    x: (col - row) * HALF_W,
    y: (col + row) * HALF_H,
  })),
).flat()

const ordered = [...cells].sort((a, b) => a.row + a.col - (b.row + b.col) || a.col - b.col)

const minX = Math.min(...cells.map((cell) => cell.x)) - HALF_W - 16
const maxX = Math.max(...cells.map((cell) => cell.x)) + HALF_W + 16
const minY = Math.min(...cells.map((cell) => cell.y)) - HALF_H - 36
const maxY = Math.max(...cells.map((cell) => cell.y)) + HALF_H + 16

export type SoilReading = {
  sector: string
  col: number
  row: number
  layers: SoilLayer[]
  anchorX: number
  anchorY: number
}

type IsometricGroundProps = {
  scene: GroundScene
  reading: SoilReading | null
  lensOpen: boolean
  onSample: (reading: SoilReading) => void
  onCloseLens: () => void
  activePerson: PersonId | null
  onPickPerson: (id: PersonId) => void
}

function sectorCode(col: number, row: number) {
  return `${String.fromCharCode(65 + col)}${row + 1}`
}

function hash(col: number, row: number) {
  const n = Math.sin(col * 12.9898 + row * 78.233) * 43758.5453
  return n - Math.floor(n)
}

function groundColor(col: number, row: number) {
  const n = hash(col, row)
  if (n > 0.9) return "#6fbf3a"
  if (n > 0.78) return "#8ed14a"
  return EARTH[Math.floor(n * EARTH.length)]
}

function diamond(cx: number, cy: number, hw: number, hh: number) {
  return `${cx},${cy - hh} ${cx + hw},${cy} ${cx},${cy + hh} ${cx - hw},${cy}`
}

function BlockStack({
  cx,
  cy,
  levels,
  paint,
  hw,
  top,
}: {
  cx: number
  cy: number
  levels: number
  paint: { top: string; left: string; right: string }
  hw: number
  top?: string
}) {
  const hh = hw / 2
  const rise = 14 * levels
  const topY = cy - rise
  const edge = "#1a0a06"

  return (
    <g pointerEvents="none">
      <polygon
        points={`${cx - hw},${topY} ${cx},${topY + hh} ${cx},${cy + hh} ${cx - hw},${cy}`}
        fill={paint.left}
        stroke={edge}
        strokeWidth="2"
      />
      <polygon
        points={`${cx + hw},${topY} ${cx},${topY + hh} ${cx},${cy + hh} ${cx + hw},${cy}`}
        fill={paint.right}
        stroke={edge}
        strokeWidth="2"
      />
      <polygon points={diamond(cx, topY, hw, hh)} fill={top ?? paint.top} stroke={edge} strokeWidth="2" />
    </g>
  )
}

function PixelFigure({
  cx,
  cy,
  id,
  name,
  tint,
  selected,
  onPick,
}: {
  cx: number
  cy: number
  id: PersonId
  name: string
  tint: PersonTint
  selected: boolean
  onPick: (id: PersonId) => void
}) {
  const hw = 7
  const hh = 4
  const body = 18
  const topY = cy - body
  const headY = topY - 11
  const paint = personPaint[tint]
  const edge = selected ? "#f6edff" : "#1a0a06"

  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={`${name}. Abrir ficha`}
      aria-pressed={selected}
      className="cursor-pointer outline-none"
      onClick={(event) => {
        event.stopPropagation()
        onPick(id)
      }}
      onKeyDown={(event) => {
        if (event.key !== "Enter" && event.key !== " ") return
        event.preventDefault()
        onPick(id)
      }}
    >
      <polygon points={diamond(cx, cy - 10, 18, 18)} fill="transparent" />
      <polygon
        points={`${cx - hw},${topY} ${cx},${topY + hh} ${cx},${cy + hh} ${cx - hw},${cy}`}
        fill={paint.left}
        stroke={edge}
        strokeWidth="2"
      />
      <polygon
        points={`${cx + hw},${topY} ${cx},${topY + hh} ${cx},${cy + hh} ${cx + hw},${cy}`}
        fill={paint.right}
        stroke={edge}
        strokeWidth="2"
      />
      <polygon points={diamond(cx, topY, hw, hh)} fill={paint.top} stroke={edge} strokeWidth="2" />
      <polygon points={diamond(cx, headY, 6, 4)} fill={paint.head} stroke={edge} strokeWidth="2" />
    </g>
  )
}

function SoilLens({
  reading,
  stageWidth,
  stageHeight,
  onClose,
}: {
  reading: SoilReading
  stageWidth: number
  stageHeight: number
  onClose: () => void
}) {
  const titleId = useId()
  const anchorPx = reading.anchorX * stageWidth
  const anchorPy = reading.anchorY * stageHeight
  const gap = 18
  const roomOnRight = stageWidth - anchorPx - gap - LENS_W
  let left = roomOnRight >= 8 ? anchorPx + gap : anchorPx - gap - LENS_W
  left = Math.min(Math.max(8, left), Math.max(8, stageWidth - LENS_W - 8))
  const top = Math.min(Math.max(8, anchorPy - 72), Math.max(8, stageHeight - LENS_H - 8))

  return (
    <div
      role="dialog"
      aria-labelledby={titleId}
      className="absolute z-20"
      style={{ left, top, width: LENS_W }}
    >
      <div className="relative mx-auto size-44">
        <div className="absolute inset-0" style={{ background: palette.oroszlan, clipPath: PIXEL_CIRCLE }} />
        <div className="absolute inset-[4px] overflow-hidden" style={{ clipPath: PIXEL_CIRCLE }}>
          <div className="flex h-full w-full flex-col">
            {reading.layers.map((layer) => (
              <div key={layer.id} className="min-h-1.5" style={{ flexGrow: layer.pct, background: layer.color }} />
            ))}
          </div>
        </div>
        <span aria-hidden className="absolute right-2 bottom-1 size-3" style={{ background: palette.oroszlan }} />
        <span aria-hidden className="absolute -right-1 bottom-0 size-3" style={{ background: palette.polip }} />
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar lupa"
          className="absolute -top-1 -right-1 grid size-7 place-items-center border-2 text-sm leading-none"
          style={{ borderColor: palette.polip, background: "#16042e", color: "#f6edff" }}
        >
          ×
        </button>
      </div>
      <div className="mt-4 border-[3px] bg-[#16042e] p-2.5" style={{ borderColor: palette.polip }}>
        <p id={titleId} className="text-[10px] tracking-[0.08em] uppercase" style={{ color: "#d7c4ff" }}>
          Composición · sector {reading.sector}
        </p>
        <ul className="mt-1.5 space-y-1">
          {reading.layers.map((layer) => (
            <li key={layer.id} className="flex items-center gap-2 text-[11px]">
              <span className="size-2.5 shrink-0 border border-[#1a0a06]" style={{ background: layer.color }} />
              <span className="flex-1">{layer.label}</span>
              <span style={{ color: "#d7c4ff" }}>{layer.pct}%</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export function IsometricGround({
  scene,
  reading,
  lensOpen,
  onSample,
  onCloseLens,
  activePerson,
  onPickPerson,
}: IsometricGroundProps) {
  const stageRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const takeRef = useRef(0)
  const [hover, setHover] = useState<string | null>(null)
  const [stage, setStage] = useState({ width: 640, height: 480 })

  useEffect(() => {
    const node = stageRef.current
    if (!node) return
    const update = () => setStage({ width: node.clientWidth, height: node.clientHeight })
    update()
    const observer = new ResizeObserver(update)
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!lensOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCloseLens()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [lensOpen, onCloseLens])

  function anchorFromClient(clientX: number, clientY: number) {
    const rect = stageRef.current?.getBoundingClientRect()
    if (!rect || rect.width === 0 || rect.height === 0) return { x: 0.5, y: 0.5 }
    return {
      x: (clientX - rect.left) / rect.width,
      y: (clientY - rect.top) / rect.height,
    }
  }

  function anchorFromTile(x: number, y: number) {
    const svg = svgRef.current
    const rect = stageRef.current?.getBoundingClientRect()
    const matrix = svg?.getScreenCTM()
    if (!svg || !rect || !matrix || rect.width === 0 || rect.height === 0) {
      return { x: 0.5, y: 0.42 }
    }
    const point = svg.createSVGPoint()
    point.x = x
    point.y = y
    const screen = point.matrixTransform(matrix)
    return {
      x: (screen.x - rect.left) / rect.width,
      y: (screen.y - rect.top) / rect.height,
    }
  }

  function takeSample(cell: Cell, anchor: { x: number; y: number }) {
    takeRef.current += 1
    onSample({
      sector: sectorCode(cell.col, cell.row),
      col: cell.col,
      row: cell.row,
      layers: sampleSoil(cell.col, cell.row, takeRef.current),
      anchorX: anchor.x,
      anchorY: anchor.y,
    })
  }

  const soil = scene === "baldio"
  const city = scene === "civilizacion" || scene === "incertidumbre" || scene === "fuego"
  const crowd = scene === "civilizacion"
  const camps = scene === "baldio" || scene === "cerrado"
  const selectedKey = soil && reading ? `${reading.col}-${reading.row}` : null
  const extraSky = city ? 44 : 0
  const sceneView = `${minX} ${minY - extraSky} ${maxX - minX} ${maxY - minY + extraSky}`
  const sceneLabel =
    scene === "civilizacion"
      ? "Ciudad de 2730: edificios y personas de la vida común"
      : scene === "incertidumbre"
        ? "Ciudad de 2945"
        : scene === "fuego"
          ? "Ciudad al entrar en 2999"
          : "Terreno baldío en vista isométrica"

  return (
    <div ref={stageRef} className="relative h-full min-h-[28rem]">
      <svg
        ref={svgRef}
        viewBox={sceneView}
        role="group"
        aria-label={sceneLabel}
        className="h-full w-full touch-manipulation"
      >
        {ordered.map((cell) => {
          const key = `${cell.col}-${cell.row}`
          const selected = selectedKey === key
          const fill = groundColor(cell.col, cell.row)
          const blocks = camps
            ? colonies.filter((colony) => colony.col === cell.col && colony.row === cell.row)
            : []
          const stacks = city
            ? firstBuildings.filter((building) => building.col === cell.col && building.row === cell.row)
            : []
          const people = crowd
            ? townspeople.filter((person) => person.col === cell.col && person.row === cell.row)
            : []

          return (
            <g key={key}>
              <polygon
                points={diamond(cell.x, cell.y, HALF_W, HALF_H)}
                fill={fill}
                stroke={selected ? palette.oroszlan : hover === key ? "#fff4c2" : "#2a1208"}
                strokeWidth={selected ? 3 : 2}
                className={soil ? "cursor-pointer outline-none" : undefined}
                role={soil ? "button" : undefined}
                tabIndex={soil ? 0 : undefined}
                aria-label={soil ? `Tomar muestra de suelo en el sector ${sectorCode(cell.col, cell.row)}` : undefined}
                onMouseEnter={() => soil && setHover(key)}
                onMouseLeave={() => setHover((current) => (current === key ? null : current))}
                onClick={(event) => {
                  if (!soil) return
                  takeSample(cell, anchorFromClient(event.clientX, event.clientY))
                }}
                onKeyDown={(event) => {
                  if (!soil) return
                  if (event.key !== "Enter" && event.key !== " ") return
                  event.preventDefault()
                  takeSample(cell, anchorFromTile(cell.x, cell.y))
                }}
              />
              {blocks.map((block) => (
                <BlockStack
                  key={`${block.col}-${block.row}-${block.levels}`}
                  cx={cell.x}
                  cy={cell.y}
                  levels={block.levels}
                  hw={16}
                  paint={colonyPaint[block.tint]}
                />
              ))}
              {stacks.map((stack) => (
                <BlockStack
                  key={`edificio-${stack.col}-${stack.row}`}
                  cx={cell.x}
                  cy={cell.y}
                  levels={stack.levels}
                  hw={18}
                  paint={STONE}
                  top={stack.roof ? ROOF[stack.roof] : undefined}
                />
              ))}
              {people.map((person) => (
                <PixelFigure
                  key={person.id}
                  cx={cell.x}
                  cy={cell.y}
                  id={person.id}
                  name={person.name}
                  tint={person.tint}
                  selected={activePerson === person.id}
                  onPick={onPickPerson}
                />
              ))}
              {selected ? (
                <g pointerEvents="none" stroke={palette.oroszlan} strokeWidth="3">
                  <line x1={cell.x - 8} y1={cell.y} x2={cell.x + 8} y2={cell.y} />
                  <line x1={cell.x} y1={cell.y - 5} x2={cell.x} y2={cell.y + 5} />
                </g>
              ) : null}
            </g>
          )
        })}
      </svg>

      {soil && lensOpen && reading ? (
        <SoilLens
          reading={reading}
          stageWidth={stage.width}
          stageHeight={stage.height}
          onClose={onCloseLens}
        />
      ) : null}
    </div>
  )
}
