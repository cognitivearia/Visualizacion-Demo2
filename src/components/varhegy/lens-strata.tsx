"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { materialColor, strata, strataTones } from "@/data/varhegy-estratos"
import { ModalShell } from "./modal-shell"

/**
 * Lupa de la escena 1: corte vertical de la tierra.
 * - Las 5 capas se dibujan con la misma altura (la profundidad real se indica en el panel,
 *   porque 120 m contra 0,6 m haría ilegibles las capas de arriba).
 * - Cada cuadrito es un mineral; hay más cuadritos de los que tienen más porcentaje.
 * - El Lenario brilla: es el metal precioso de la historia.
 */

const CENTER = 170
const RADIUS = 140
const SKY_BOTTOM = 70
const BAND_HEIGHTS = [32, 40, 48, 56, 64]
const SQUARES_PER_BAND = 110

function rand(index: number, seed: number) {
  const n = Math.imul(index + 1, 2654435761) ^ Math.imul(seed + 7, 40503)
  return (((n ^ (n >>> 15)) >>> 0) % 1000) / 1000
}

type Speck = { x: number; y: number; size: number; color: string; precious: boolean }

/** Dónde empieza (arriba) cada capa dentro de la lupa. */
const BAND_TOPS = BAND_HEIGHTS.map((_, index) =>
  BAND_HEIGHTS.slice(0, index).reduce((sum, h) => sum + h, SKY_BOTTOM),
)

function buildSpecks(): Speck[][] {
  return strata.map((stratum, bandIndex) => {
    const top = BAND_TOPS[bandIndex] ?? SKY_BOTTOM
    const height = BAND_HEIGHTS[bandIndex] ?? 50
    const specks: Speck[] = []
    const sorted = [...stratum.materials]
    // Reparte los cuadritos según el porcentaje de cada material.
    const slots: typeof sorted = []
    let acc = 0
    for (const material of sorted) {
      acc += (material.pct / 100) * SQUARES_PER_BAND
      while (slots.length < Math.round(acc)) slots.push(material)
    }
    slots.forEach((material, i) => {
      const size = material.precious ? 9 : 4 + Math.floor(rand(i, bandIndex) * 3)
      specks.push({
        x: 30 + rand(i, bandIndex + 11) * 280,
        y: top + 3 + rand(i, bandIndex + 29) * (height - size - 6),
        size,
        color: materialColor(material.name),
        precious: material.precious,
      })
    })
    return specks
  })
}

const SPECKS = buildSpecks()

function formatDepth(from: number, to: number) {
  const f = (value: number) => value.toLocaleString("es-ES")
  return `${f(from)} – ${f(to)} m`
}

export function LensStrata({ onClose }: { onClose: () => void }) {
  const [selected, setSelected] = useState(0)
  const stratum = strata[selected]
  const materials = [...stratum.materials].sort((a, b) => b.pct - a.pct)

  return (
    <ModalShell
      label="Lupa: corte vertical de la tierra en 2568"
      onClose={onClose}
      className="flex max-w-4xl flex-col items-center gap-6 md:flex-row md:items-start md:p-8"
    >
        <svg
          viewBox="0 0 360 360"
          className="w-full max-w-[360px] shrink-0"
          role="img"
          aria-label="Corte vertical de la tierra con cinco capas; el Lenario brilla en la más profunda."
        >
          <defs>
            <clipPath id="varhegy-lens-clip">
              <circle cx={CENTER} cy={CENTER} r={RADIUS} />
            </clipPath>
          </defs>

          <g clipPath="url(#varhegy-lens-clip)" shapeRendering="crispEdges">
            <rect x={0} y={0} width={360} height={SKY_BOTTOM} fill="#26372c" />
            {[105, 170, 235].map((x) => (
              <g key={x}>
                <polygon points={`${x - 14},${SKY_BOTTOM} ${x},${SKY_BOTTOM - 20} ${x + 14},${SKY_BOTTOM}`} fill="#a47c4a" />
                <rect x={x - 3} y={SKY_BOTTOM - 8} width={6} height={8} fill="#2b1d12" />
              </g>
            ))}

            {strata.map((item, index) => {
              const top = BAND_TOPS[index] ?? SKY_BOTTOM
              const height = BAND_HEIGHTS[index] ?? 50
              const active = index === selected
              return (
                <g
                  key={item.name}
                  opacity={active ? 1 : 0.55}
                  onClick={() => setSelected(index)}
                  className="cursor-pointer"
                >
                  <rect x={0} y={top} width={360} height={height} fill={strataTones[index]} />
                  {SPECKS[index]?.map((speck, i) => (
                    <rect
                      key={i}
                      x={speck.x}
                      y={speck.y}
                      width={speck.size}
                      height={speck.size}
                      fill={speck.color}
                      className={speck.precious ? "hotspot-pulse" : undefined}
                      stroke={speck.precious ? "#ffffff" : undefined}
                      strokeWidth={speck.precious ? 1 : undefined}
                    />
                  ))}
                  {active && (
                    <rect
                      x={0}
                      y={top + 1}
                      width={360}
                      height={height - 2}
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth={2}
                      strokeDasharray="6 4"
                    />
                  )}
                </g>
              )
            })}
          </g>

          <circle
            cx={CENTER}
            cy={CENTER}
            r={RADIUS}
            fill="none"
            stroke="#e8e2d4"
            strokeWidth={10}
          />
          <polygon points="268,268 282,254 348,320 334,334" fill="#8a6f45" stroke="#e8e2d4" strokeWidth={3} />
        </svg>

        <div className="w-full min-w-0 flex-1 space-y-5">
          <header className="space-y-1 pr-10">
            <p className="font-heading text-xs tracking-widest text-primary">
              2568 · Corte de la tierra
            </p>
            <h2 className="text-2xl">{stratum.name}</h2>
            <p className="font-mono text-sm text-muted-foreground">
              Profundidad {formatDepth(stratum.fromM, stratum.toM)}
            </p>
          </header>

          <ul className="space-y-2" aria-label={`Composición de ${stratum.name}`}>
            {materials.map((material) => (
              <li key={material.name} className="space-y-1">
                <div className="flex items-baseline justify-between gap-2 text-sm">
                  <span className="flex items-center gap-2">
                    <span
                      className="size-3 rounded-sm"
                      style={{ backgroundColor: materialColor(material.name) }}
                      aria-hidden
                    />
                    {material.name}
                    {material.precious && (
                      <span className="rounded bg-primary/20 px-1.5 py-0.5 text-xs text-primary">
                        metal precioso
                      </span>
                    )}
                  </span>
                  <span className="font-mono tabular-nums">{material.pct} %</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${material.pct}%`,
                      backgroundColor: materialColor(material.name),
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>

          <div>
            <p className="mb-2 text-xs text-muted-foreground">Elige una capa (o toca el corte):</p>
            <ol className="flex flex-wrap gap-2">
              {strata.map((item, index) => (
                <li key={item.name}>
                  <button
                    type="button"
                    onClick={() => setSelected(index)}
                    aria-pressed={index === selected}
                    className={cn(
                      "rounded-md border px-3 py-1.5 text-left text-xs outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
                      index === selected
                        ? "border-primary bg-primary/15 text-foreground"
                        : "border-border text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <span className="block">{item.name}</span>
                    <span className="block font-mono text-[11px]">
                      {formatDepth(item.fromM, item.toM)}
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </div>
    </ModalShell>
  )
}
