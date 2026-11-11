"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { medidaDe } from "@/data/varhegy-escala"
import { rifle, rifleParts, type RiflePartId } from "@/data/varhegy-rifle"
import { mixHex } from "@/lib/palette"
import { cn } from "@/lib/utils"
import { ModalShell } from "./modal-shell"

/**
 * Zoom a LUPINE (momento 3). Dos vistas:
 *  - Tamaño: LUPINE junto a una persona, el rifle y el edificio más alto.
 *  - Rifle: despiece interactivo del AMR-652-4 y el botón de disparo que lleva a la guerra.
 */

type View = "tamano" | "rifle"

const LUPINE_COLOR = "#c45cff"
const METAL = "#aab2c5"
const DARK = "#4a5068"
const PINK = "#ff4f8b"
const PURPLE = "#8a5fc0"

const nf = new Intl.NumberFormat("es-ES", { maximumFractionDigits: 1 })

// ------------------------------------------------------------------ tamaño

/** Píxeles del dibujo por metro real. 30 m de LUPINE = 270 px. */
const PX_PER_M = 9
const GROUND = 320

function SizeCompare() {
  const persona = medidaDe("Persona")
  const rifleLen = medidaDe("Rifle AMR-652-4")
  const edificio = medidaDe("Edificio de 6 pisos")
  const lupine = medidaDe("LUPINE")
  const h = (m: number) => m * PX_PER_M

  const lupineTop = GROUND - h(lupine)
  const ruler = [10, 20, 30]

  return (
    <div className="space-y-4">
      <svg
        viewBox="0 0 560 350"
        className="w-full rounded-lg bg-[#150f26]"
        role="img"
        aria-label={`Comparativa de tamaño: persona ${nf.format(persona)} m, rifle ${nf.format(rifleLen)} m, edificio de 6 pisos ${nf.format(edificio)} m y LUPINE ${nf.format(lupine)} m.`}
      >
        <g shapeRendering="crispEdges">
          {ruler.map((m) => (
            <g key={m}>
              <line
                x1={0}
                x2={560}
                y1={GROUND - h(m)}
                y2={GROUND - h(m)}
                stroke="#ffffff"
                strokeOpacity={0.15}
                strokeDasharray="4 4"
              />
              <text x={6} y={GROUND - h(m) - 4} fontSize={10} fill="#b7aec8" fontFamily="monospace">
                {m} m
              </text>
            </g>
          ))}
          <rect x={0} y={GROUND} width={560} height={30} fill="#262040" />

          {/* Persona */}
          <g>
            <rect x={68} y={GROUND - h(persona)} width={4} height={3} fill="#f1c9a5" />
            <rect x={67} y={GROUND - h(persona) + 3} width={6} height={7} fill="#4d8cff" />
            <rect x={67} y={GROUND - 5} width={2} height={5} fill="#2b2736" />
            <rect x={71} y={GROUND - 5} width={2} height={5} fill="#2b2736" />
          </g>

          {/* Rifle (acostado: la medida es su largo) */}
          <g>
            <rect x={120} y={GROUND - 7} width={h(rifleLen)} height={7} fill={METAL} />
            <rect x={120} y={GROUND - 7} width={14} height={7} fill={PINK} />
            <rect x={150} y={GROUND - 12} width={30} height={5} fill={DARK} />
            <rect x={120 + h(rifleLen) - 22} y={GROUND - 5} width={22} height={5} fill={PURPLE} />
          </g>

          {/* Edificio */}
          <g>
            <rect x={238} y={GROUND - h(edificio)} width={82} height={h(edificio)} fill="#4b3f87" />
            <rect x={238} y={GROUND - h(edificio)} width={82} height={6} fill="#6e62ad" />
            {Array.from({ length: 8 }).map((_, row) =>
              Array.from({ length: 5 }).map((__, col) => {
                const lit = (row * 7 + col * 3) % 4 !== 0
                return (
                  <rect
                    key={`${row}-${col}`}
                    x={246 + col * 15}
                    y={GROUND - h(edificio) + 16 + row * 19}
                    width={8}
                    height={9}
                    fill={lit ? "#ffd166" : "#2b2354"}
                  />
                )
              }),
            )}
          </g>

          {/* LUPINE */}
          <g>
            <rect x={398} y={GROUND - 100} width={24} height={100} fill={mixHex(LUPINE_COLOR, "#000000", 0.35)} />
            <rect x={438} y={GROUND - 100} width={24} height={100} fill={mixHex(LUPINE_COLOR, "#000000", 0.35)} />
            <rect x={392} y={GROUND - 112} width={76} height={20} fill={mixHex(LUPINE_COLOR, "#000000", 0.2)} />
            <rect x={400} y={lupineTop + 56} width={60} height={GROUND - 100 - (lupineTop + 56)} fill={LUPINE_COLOR} />
            <rect x={384} y={lupineTop + 32} width={92} height={28} fill={mixHex(LUPINE_COLOR, "#ffffff", 0.12)} />
            <rect x={414} y={lupineTop} width={32} height={34} fill={mixHex(LUPINE_COLOR, "#ffffff", 0.25)} />
            <rect x={420} y={lupineTop + 12} width={20} height={6} fill={PINK} />
          </g>
        </g>

        {[
          { x: 70, name: "Persona", m: persona },
          { x: 162, name: "Rifle", m: rifleLen },
          { x: 279, name: "Edificio", m: edificio },
          { x: 430, name: "LUPINE", m: lupine },
        ].map((item) => (
          <text
            key={item.name}
            x={item.x}
            y={GROUND + 20}
            textAnchor="middle"
            fontSize={11}
            fill="#e5e1ee"
            fontFamily="monospace"
          >
            {item.name} {nf.format(item.m)} m
          </text>
        ))}
      </svg>

      <ul className="grid gap-2 text-sm sm:grid-cols-3">
        <li className="rounded-md bg-background/60 px-3 py-2 ring-1 ring-foreground/10">
          <span className="font-mono text-lg tabular-nums text-primary">
            {nf.format(lupine / persona)}×
          </span>{" "}
          una persona
        </li>
        <li className="rounded-md bg-background/60 px-3 py-2 ring-1 ring-foreground/10">
          <span className="font-mono text-lg tabular-nums text-primary">
            {nf.format(lupine / edificio)}×
          </span>{" "}
          el edificio más alto
        </li>
        <li className="rounded-md bg-background/60 px-3 py-2 ring-1 ring-foreground/10">
          <span className="font-mono text-lg tabular-nums text-primary">
            {nf.format(rifleLen / persona)}×
          </span>{" "}
          el rifle frente a una persona
        </li>
      </ul>
      <p className="text-xs text-muted-foreground">
        La altura de LUPINE es un borrador (<code>varhegy-escala.csv</code>).
      </p>
    </div>
  )
}

// ------------------------------------------------------------------- rifle

/** Caja de cada pieza en el dibujo montado: [x, y, ancho, alto]. */
const BOX: Record<RiflePartId, [number, number, number, number]> = {
  placas: [10, 120, 150, 100],
  plasma: [40, 146, 80, 48],
  boca: [170, 150, 36, 40],
  condensador: [214, 142, 26, 56],
  reserva: [248, 128, 170, 84],
  membrana: [418, 138, 22, 64],
  cuerpo: [330, 96, 400, 34],
  atf: [350, 78, 26, 18],
  camara: [560, 62, 74, 34],
  lente: [638, 66, 62, 28],
}

function PartShape({ id }: { id: RiflePartId }) {
  switch (id) {
    case "placas":
      return (
        <g>
          <rect x={10} y={120} width={150} height={22} fill={METAL} />
          <rect x={14} y={134} width={142} height={6} fill={PINK} />
          <rect x={10} y={198} width={150} height={22} fill={METAL} />
          <rect x={14} y={200} width={142} height={6} fill={PINK} />
        </g>
      )
    case "plasma":
      return (
        <g fill={PINK}>
          <rect x={52} y={165} width={56} height={10} />
          <rect x={75} y={150} width={10} height={40} />
          <rect x={60} y={154} width={8} height={8} />
          <rect x={92} y={154} width={8} height={8} />
          <rect x={60} y={178} width={8} height={8} />
          <rect x={92} y={178} width={8} height={8} />
        </g>
      )
    case "boca":
      return (
        <g>
          <rect x={170} y={150} width={36} height={40} fill={DARK} />
          <rect x={182} y={164} width={12} height={12} fill="#0b0912" />
        </g>
      )
    case "condensador":
      return (
        <g>
          <rect x={214} y={142} width={26} height={56} fill={DARK} />
          <rect x={220} y={150} width={14} height={40} fill={METAL} />
        </g>
      )
    case "reserva":
      return (
        <g>
          <rect x={248} y={128} width={170} height={84} fill={PURPLE} />
          {[0, 1, 2, 3, 4].map((i) => (
            <rect key={i} x={262 + i * 34} y={128} width={10} height={84} fill={mixHex(PURPLE, "#ffffff", 0.18)} />
          ))}
        </g>
      )
    case "membrana":
      return (
        <g>
          <rect x={418} y={138} width={22} height={64} fill={PINK} />
          <rect x={424} y={150} width={10} height={40} fill="#c1204f" />
        </g>
      )
    case "cuerpo":
      return (
        <g>
          <rect x={330} y={96} width={400} height={26} fill={METAL} />
          <rect x={440} y={122} width={60} height={8} fill={DARK} />
        </g>
      )
    case "atf":
      return (
        <g>
          <rect x={350} y={78} width={26} height={18} fill={DARK} />
          <rect x={360} y={84} width={6} height={6} fill="#ff4fd8" />
        </g>
      )
    case "camara":
      return (
        <g>
          <rect x={560} y={62} width={74} height={34} fill="#1d2140" />
          <rect x={568} y={68} width={32} height={22} fill="#4d5bd6" />
          <rect x={606} y={68} width={8} height={8} fill="#3dffb0" />
          <rect x={618} y={68} width={8} height={8} fill="#ff4f4f" />
          <rect x={606} y={80} width={8} height={8} fill="#ffb84d" />
          <rect x={618} y={80} width={8} height={8} fill="#ffffff" />
        </g>
      )
    case "lente":
      return (
        <g>
          <rect x={638} y={70} width={52} height={20} fill={DARK} />
          <rect x={690} y={66} width={10} height={28} fill={METAL} />
        </g>
      )
  }
}

function RifleView({ firing, onFire }: { firing: boolean; onFire: () => void }) {
  const [spread, setSpread] = useState(60)
  const [selected, setSelected] = useState<RiflePartId>("reserva")
  const t = spread / 100
  const part = rifleParts.find((item) => item.id === selected) ?? rifleParts[0]

  return (
    <div className="space-y-4">
      <svg
        viewBox="-110 -45 940 290"
        className="w-full rounded-lg bg-[#150f26]"
        role="group"
        aria-label={`Despiece del rifle ${rifle.name}`}
      >
        {firing && (
          <rect x={-110} y={166} width={280} height={8} fill={PINK} className="hotspot-pulse" />
        )}
        {rifleParts.map((item) => {
          const [bx, by, bw, bh] = BOX[item.id]
          const active = item.id === selected
          return (
            <g
              key={item.id}
              role="button"
              tabIndex={0}
              aria-pressed={active}
              aria-label={item.name}
              onClick={() => setSelected(item.id)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault()
                  setSelected(item.id)
                }
              }}
              className="cursor-pointer outline-none transition-transform duration-300 motion-reduce:transition-none [&:focus-visible_.part-box]:stroke-white"
              style={{
                transform: `translate(${item.explode.dx * t}px, ${item.explode.dy * t}px)`,
              }}
              shapeRendering="crispEdges"
            >
              <PartShape id={item.id} />
              <rect
                className="part-box"
                x={bx - 4}
                y={by - 4}
                width={bw + 8}
                height={bh + 8}
                fill="transparent"
                stroke={active ? "#ffffff" : "transparent"}
                strokeWidth={2}
                strokeDasharray="5 4"
              />
            </g>
          )
        })}
      </svg>

      <div className="flex items-center gap-3">
        <label htmlFor="despiece" className="text-sm text-muted-foreground">
          Despiece
        </label>
        <input
          id="despiece"
          type="range"
          min={0}
          max={100}
          value={spread}
          onChange={(event) => setSpread(Number(event.target.value))}
          className="h-2 flex-1 cursor-pointer accent-primary"
        />
        <span className="w-10 text-right font-mono text-sm tabular-nums">{spread} %</span>
      </div>

      <div className="rounded-md bg-background/60 p-4 ring-1 ring-foreground/10" aria-live="polite">
        <h3 className="font-heading text-sm tracking-wide">{part.name}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{part.description}</p>
      </div>

      <ul className="flex flex-wrap gap-2" aria-label="Piezas del rifle">
        {rifleParts.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => setSelected(item.id)}
              aria-pressed={item.id === selected}
              className={cn(
                "rounded-md border px-2.5 py-1 text-xs outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
                item.id === selected
                  ? "border-primary bg-primary/15 text-foreground"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {item.name}
            </button>
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-3 rounded-lg border border-destructive/40 bg-destructive/10 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm">
          Para avanzar, hay que <strong>disparar</strong>. Después de esto la ciudad no vuelve a ser
          la misma.
        </p>
        <Button
          variant="destructive"
          size="lg"
          onClick={onFire}
          disabled={firing}
          className="shrink-0 font-heading uppercase tracking-widest"
        >
          {firing ? "Disparando…" : "Disparar"}
        </Button>
      </div>
    </div>
  )
}

// ------------------------------------------------------------------ marco

export function LupineZoom({ onClose, onFire }: { onClose: () => void; onFire: () => void }) {
  const [view, setView] = useState<View>("tamano")
  const [firing, setFiring] = useState(false)
  const timer = useRef<number | null>(null)

  useEffect(
    () => () => {
      if (timer.current !== null) window.clearTimeout(timer.current)
    },
    [],
  )

  function fire() {
    if (firing) return
    setFiring(true)
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    timer.current = window.setTimeout(onFire, reduce ? 200 : 1100)
  }

  return (
    <ModalShell
      label="LUPINE: comparativa de tamaño y despiece del rifle"
      onClose={firing ? () => {} : onClose}
      className="max-w-4xl md:p-8"
    >
      <header className="mb-4 space-y-3 pr-10">
        <div>
          <p className="font-heading text-xs tracking-widest text-primary">2945 · LUPINE</p>
          <h2 className="text-2xl">El mecha</h2>
        </div>
        <div role="group" aria-label="Vista" className="inline-flex rounded-lg border border-border p-1">
          {(
            [
              ["tamano", "Tamaño"],
              ["rifle", `Rifle ${rifle.name}`],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              aria-pressed={view === id}
              onClick={() => setView(id)}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
                view === id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      {view === "tamano" ? <SizeCompare /> : <RifleView firing={firing} onFire={fire} />}

      {firing && (
        <div
          className="fire-flash pointer-events-none fixed inset-0 z-[60] grid place-items-center bg-white"
          aria-hidden
        >
          <span className="font-heading text-6xl text-destructive sm:text-8xl">¡Fuego!</span>
        </div>
      )}
    </ModalShell>
  )
}
