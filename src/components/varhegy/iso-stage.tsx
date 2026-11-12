"use client"

import { useMemo, useState } from "react"
import { scenes, type Hotspot, type HotspotAction, type Scene } from "@/data/varhegy"
import { fuegoEn } from "@/data/varhegy-bajas"
import { mixHex } from "@/lib/palette"
import { TH, TW, UNIT, project, rhombus } from "./iso-primitives"
import {
  Building,
  FIRE_HEIGHT,
  Fire,
  HUT_HEIGHT,
  Hut,
  LUPINE_HEIGHT,
  LupineSprite,
  RUBBLE_HEIGHT,
  Rubble,
  RoadMark,
  Tuft,
} from "./sprites"
import { LensStrata } from "./lens-strata"
import { RegimeStreet } from "./regime-street"
import { LupineZoom } from "./lupine-zoom"
import { sliceForStreetCell, StreetZoom } from "./street-zoom"
import { WarMap } from "./war-map"

/** Escenario isométrico de Várhegy (las piezas de dibujo están en iso-primitives.tsx). */

/** Casillas por lado del tablero (los mapas de texto de varhegy.ts son de 8x8). */
const GRID_SIZE = 8

type Cell = { col: number; row: number; ch: string }

function toCells(layout: string[]): Cell[] {
  const cells: Cell[] = []
  layout.forEach((line, row) => {
    Array.from(line).forEach((ch, col) => cells.push({ col, row, ch }))
  })
  // De atrás hacia delante: las casillas lejanas se dibujan primero.
  return cells.sort((a, b) => a.col + a.row - (b.col + b.row) || a.col - b.col)
}

/** Casillas que cubre una zona tocable. */
function hotspotCellsOf(hotspot: Hotspot, cells: Cell[]) {
  if ("cells" in hotspot) {
    const keys = new Set(hotspot.cells.map(([col, row]) => `${col}-${row}`))
    return cells.filter((cell) => keys.has(`${cell.col}-${cell.row}`))
  }
  return cells.filter((cell) => hotspot.match.includes(cell.ch))
}

/** Altura visual (en unidades) de lo que hay en una casilla. Incluye antena, techo y llamas. */
function heightOf(ch: string) {
  if (/^[1-9]$/.test(ch)) return Number(ch) + (Number(ch) >= 5 ? 1 : 0)
  if (ch === "L") return LUPINE_HEIGHT
  if (ch === "h") return HUT_HEIGHT
  if (ch === "f") return FIRE_HEIGHT
  if (ch === "x") return RUBBLE_HEIGHT
  return 0
}

/** Color de las ventanas encendidas, según el momento. */
function windowGlow(sceneId: Scene["id"]) {
  if (sceneId === "incertidumbre") return "#7ee7ff"
  if (sceneId === "guerra") return "#ffb020"
  if (sceneId === "posguerra") return "#e7f0ff"
  return "#ffd166"
}

/**
 * Encuadre común a las 5 escenas, calculado con la pieza más alta de todas.
 * Así el escenario no "salta" al cambiar de momento y nada queda cortado.
 */
const VIEW = (() => {
  let minY = 0
  let maxY = 0
  for (const scene of scenes) {
    for (const cell of toCells(scene.layout)) {
      const { y } = project(cell.col, cell.row)
      minY = Math.min(minY, y - heightOf(cell.ch) * UNIT - TH / 2)
      maxY = Math.max(maxY, y + TH / 2)
    }
  }
  const pad = 12
  const width = GRID_SIZE * TW
  return `${-width / 2} ${minY - pad} ${width} ${maxY - minY + pad * 2}`
})()

export function IsoStage({
  scene,
  onAdvance,
}: {
  scene: Scene
  /** Pasa al siguiente momento (lo usa el botón de disparo del rifle). */
  onAdvance: () => void
}) {
  const cells = useMemo(() => toCells(scene.layout), [scene.layout])
  const zones = useMemo(
    () =>
      scene.hotspots.map((hotspot) => ({
        hotspot,
        cells: hotspotCellsOf(hotspot, cells),
      })),
    [scene.hotspots, cells],
  )
  const [open, setOpen] = useState<HotspotAction | null>(null)
  const [zoneLabel, setZoneLabel] = useState<string | null>(null)
  const [streetSlice, setStreetSlice] = useState(0)
  const { palette } = scene

  function activate(action: HotspotAction, label: string, slice = 0) {
    setZoneLabel(label)
    setStreetSlice(slice)
    setOpen(action)
  }

  function advance() {
    setOpen(null)
    onAdvance()
  }

  return (
    <figure
      className="overflow-hidden rounded-xl ring-1 ring-foreground/10"
      style={{
        background: `radial-gradient(ellipse at 50% 30%, ${mixHex(palette.sky, "#ffffff", 0.08)}, ${palette.sky} 70%)`,
      }}
    >
      <svg
        key={scene.id}
        viewBox={VIEW}
        className="block h-auto w-full motion-safe:animate-in motion-safe:fade-in motion-safe:duration-500"
        role="group"
        aria-label={`Maqueta isométrica de Várhegy en ${scene.year}: ${scene.title}`}
      >
        {cells.map((cell) => {
          const { x, y } = project(cell.col, cell.row)
          const isRoad = cell.ch === "="
          const isFire = cell.ch === "f"
          const fuego = isFire ? fuegoEn(cell.col, cell.row) : undefined
          const ground = isRoad
            ? palette.road
            : isFire
              ? mixHex(palette.road, fuego?.color ?? palette.fire, 0.4)
              : (cell.col + cell.row) % 2 === 0
                ? palette.groundA
                : palette.groundB
          const isBuilding = /^[1-9]$/.test(cell.ch)

          return (
            <g key={`${cell.col}-${cell.row}`}>
              <polygon
                points={rhombus(x, y)}
                fill={ground}
                shapeRendering="crispEdges"
              />
              {isRoad && (cell.col + cell.row) % 2 === 0 && <RoadMark x={x} y={y} />}
              {cell.ch === "." && (cell.col * 3 + cell.row) % 4 === 0 && (
                <Tuft
                  x={x}
                  y={y}
                  color={palette.groundA}
                  kind={scene.id === "prehistoria" ? "grass" : "pebble"}
                />
              )}
              {cell.ch === "h" && <Hut x={x} y={y} color={palette.hut} />}
              {cell.ch === "x" && <Rubble x={x} y={y} color={palette.rubble} />}
              {isFire && <Fire x={x} y={y} color={fuego?.color ?? palette.fire} />}
              {cell.ch === "L" && <LupineSprite x={x} y={y} color={palette.lupine} />}
              {isBuilding && (
                <Building
                  x={x}
                  y={y}
                  floors={Number(cell.ch)}
                  color={palette.building}
                  glow={windowGlow(scene.id)}
                  lit={scene.id === "guerra" ? 0.22 : 0.7}
                  seed={cell.col + cell.row * 3}
                />
              )}
            </g>
          )
        })}

        {zones.flatMap(({ hotspot, cells: zoneCells }) => {
          const perCell =
            hotspot.action === "street" && (scene.year === 2730 || scene.year === 2945)
          const groups = perCell
            ? zoneCells.map((cell) => ({
                cells: [cell],
                slice: sliceForStreetCell(cell.col, cell.row),
              }))
            : [{ cells: zoneCells, slice: undefined as number | undefined }]
          return groups.map((group) => {
            const only = group.cells.length === 1 ? group.cells[0] : undefined
            const tone = only ? (fuegoEn(only.col, only.row)?.color ?? palette.accent) : palette.accent
            const label =
              group.slice === undefined ? hotspot.label : `${hotspot.label}, casilla ${group.slice + 1}`
            return (
              <g
                key={`${hotspot.label}-${group.slice ?? "all"}-${only?.col ?? 0}-${only?.row ?? 0}`}
                role="button"
                tabIndex={0}
                aria-label={label}
                onClick={() => activate(hotspot.action, hotspot.label, group.slice ?? 0)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault()
                    activate(hotspot.action, hotspot.label, group.slice ?? 0)
                  }
                }}
                className="cursor-pointer outline-none [&:focus-visible_polygon]:stroke-[3]"
              >
                {group.cells.map((cell) => {
                  const { x, y } = project(cell.col, cell.row)
                  return (
                    <polygon
                      key={`hot-${cell.col}-${cell.row}`}
                      points={rhombus(x, y, 0.94)}
                      fill={tone}
                      fillOpacity={0.14}
                      stroke={tone}
                      strokeWidth={2}
                      className="hotspot-pulse"
                      shapeRendering="crispEdges"
                    />
                  )
                })}
              </g>
            )
          })
        })}
      </svg>

      {open === "lens" && <LensStrata onClose={() => setOpen(null)} />}
      {open === "street" && (
        <StreetZoom
          year={scene.year}
          cityPopulation={scene.stats[0]?.value ?? ""}
          initialSlice={
            scene.year === 2730 || scene.year === 2945 ? streetSlice : undefined
          }
          onClose={() => setOpen(null)}
        />
      )}
      {open === "division" && zoneLabel && (
        <WarMap key={zoneLabel} zona={zoneLabel} onClose={() => setOpen(null)} />
      )}
      {open === "regime" && <RegimeStreet onClose={() => setOpen(null)} />}
      {open === "lupine" && <LupineZoom onClose={() => setOpen(null)} onFire={advance} />}

    </figure>
  )
}
