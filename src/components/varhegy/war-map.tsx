"use client"

import { useState } from "react"
import { atlasColors, countryMarks, mapHeight, mapShapes, mapViewBox, mapWidth } from "@/data/map-geometry"
import {
  ausenciaRegiones,
  bajasPorBando,
  ciudad2945,
  faltanEnLaCiudad,
  fuegos,
} from "@/data/varhegy-bajas"
import { zonasPorControl } from "@/data/varhegy-division"
import type { RegionName } from "@/data/world"
import { formatPeople } from "@/lib/format"
import { withBasePath } from "@/lib/base-path"
import { cn } from "@/lib/utils"
import { ModalShell } from "./modal-shell"

const ENTERO = new Intl.NumberFormat("es-ES")
const PORCIENTO = new Intl.NumberFormat("es-ES", { maximumFractionDigits: 0 })

function parteDe(region: RegionName) {
  return ausenciaRegiones.find((item) => item.region === region)?.parte ?? 0
}

export function WarMap({ zona, onClose }: { zona: string; onClose: () => void }) {
  const inicial = fuegos.find((fuego) => fuego.zona === zona) ?? fuegos[0]
  const [bando, setBando] = useState(inicial.control)
  const [region, setRegion] = useState<RegionName>("Karpatenland")
  const elegido = bajasPorBando.find((item) => item.control === bando) ?? inicial
  const ausencia = ausenciaRegiones.find((item) => item.region === region) ?? ausenciaRegiones[0]
  const siguen = zonasPorControl.find((item) => item.control === bando)?.total ?? 0
  const varhegy = countryMarks.find((mark) => mark.name === "Várhegy")

  return (
    <ModalShell
      label="Mapa de 2999: población que falta y muertos por bando"
      onClose={onClose}
      className="max-w-5xl md:p-8"
    >
      <header className="mb-4 space-y-1 pr-10">
        <p className="font-heading text-xs tracking-widest text-primary">2999 · Quién falta</p>
        <h2 className="text-2xl">El continente se apaga</h2>
        <p className="max-w-2xl text-sm text-muted-foreground">
          El negro es la gente que estaba en 2945 y ya no está en 2999. En Várhegy faltan{" "}
          {ENTERO.format(faltanEnLaCiudad)} de {formatPeople(ciudad2945)}.
        </p>
      </header>

      <div className="grid items-start gap-5 lg:grid-cols-[1.45fr_0.7fr]">
        <svg
          viewBox={mapViewBox}
          className="w-full rounded-lg bg-[#14101c]"
          role="group"
          aria-label="Mapa del continente en 2999. Cada región se oscurece según la población que falta."
        >
          <image
            href={withBasePath("/maps/continente.png")}
            width={mapWidth}
            height={mapHeight}
            preserveAspectRatio="xMidYMid meet"
          />
          {mapShapes.map((shape) => {
            const on = region === shape.id
            const parte = parteDe(shape.id)
            return (
              <path
                key={shape.id}
                d={shape.d}
                role="button"
                tabIndex={0}
                aria-label={`${shape.id}: falta el ${PORCIENTO.format(parte * 100)} por ciento`}
                aria-pressed={on}
                fill="#050308"
                fillOpacity={parte}
                fillRule="evenodd"
                stroke={on ? "#f4f0ff" : atlasColors[shape.id]}
                strokeOpacity={on ? 0.95 : 0.45}
                strokeWidth={on ? 2.4 : 0.8}
                className="cursor-pointer outline-none motion-reduce:transition-none"
                onClick={() => setRegion(shape.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault()
                    setRegion(shape.id)
                  }
                }}
              />
            )
          })}
          {varhegy && (
            <g className="pointer-events-none">
              <circle cx={varhegy.x} cy={varhegy.y} r={5} fill="#f4f0ff" />
              <circle cx={varhegy.x} cy={varhegy.y} r={2.5} fill={elegido.color} />
              <text
                x={varhegy.x}
                y={varhegy.y - 10}
                textAnchor="middle"
                fill="#f4f0ff"
                stroke="#050308"
                strokeWidth="3"
                paintOrder="stroke"
                fontSize="11"
                fontFamily="var(--font-chakra), sans-serif"
              >
                Várhegy
              </text>
            </g>
          )}
        </svg>

        <div className="space-y-4">
          <section className="rounded-lg bg-background/60 p-4 ring-1 ring-foreground/10" aria-live="polite">
            <p className="text-sm text-muted-foreground">
              {fuegos
                .filter((fuego) => fuego.control === bando)
                .map((fuego) => fuego.zona)
                .join(" · ")}
            </p>
            <h3 className="mt-1 text-lg" style={{ color: elegido.color }}>
              {elegido.control}
            </h3>
            <p className="mt-2 font-mono text-3xl tabular-nums">{ENTERO.format(elegido.muertosBando)}</p>
            <p className="text-sm text-muted-foreground">muertos de este bando, en borrador</p>
            <p className="mt-2 text-sm text-muted-foreground">
              En sus zonas siguen {ENTERO.format(siguen)} personas.
            </p>
          </section>

          <ul className="flex flex-wrap gap-2" aria-label="Bando">
            {bajasPorBando.map((item) => (
              <li key={item.control}>
                <button
                  type="button"
                  aria-pressed={item.control === bando}
                  onClick={() => setBando(item.control)}
                  className={cn(
                    "rounded-md border px-2.5 py-1 text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    item.control === bando
                      ? "border-transparent text-white"
                      : "border-border text-muted-foreground",
                  )}
                  style={
                    item.control === bando
                      ? { backgroundColor: item.color }
                      : { borderColor: item.color }
                  }
                >
                  {item.control}
                </button>
              </li>
            ))}
          </ul>

          <section>
            <h3 className="text-sm text-muted-foreground">Por región</h3>
            <ul className="mt-2 space-y-1">
              {ausenciaRegiones
                .toSorted((a, b) => b.parte - a.parte)
                .map((item) => (
                  <li key={item.region}>
                    <button
                      type="button"
                      aria-pressed={item.region === region}
                      onClick={() => setRegion(item.region)}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        item.region === region && "bg-background/70",
                      )}
                    >
                      <span
                        className="size-3 shrink-0 rounded-sm bg-[#050308]"
                        style={{ opacity: Math.max(0.25, item.parte) }}
                        aria-hidden
                      />
                      <span className="min-w-0 flex-1 truncate">{item.region}</span>
                      <span className="font-mono text-xs tabular-nums text-muted-foreground">
                        {PORCIENTO.format(item.parte * 100)} %
                      </span>
                    </button>
                  </li>
                ))}
            </ul>
            <p className="mt-2 text-sm text-muted-foreground">
              {ausencia.region}: faltan {formatPeople(ausencia.faltan)}. Quedan{" "}
              {formatPeople(ausencia.despues)}.
            </p>
          </section>
        </div>
      </div>
    </ModalShell>
  )
}
