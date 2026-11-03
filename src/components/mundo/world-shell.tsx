"use client"

import { useState } from "react"
import { IsometricGround, type SoilReading } from "@/components/mundo/isometric-ground"
import { moments, soilPalette, type Moment, type MomentId } from "@/data/moments"
import { palette } from "@/lib/palette"
import { cn } from "@/lib/utils"

export function WorldShell() {
  const [activeId, setActiveId] = useState<MomentId>("prehistoria")
  const [reading, setReading] = useState<SoilReading | null>(null)
  const [lensOpen, setLensOpen] = useState(false)
  const active = moments.find((moment) => moment.id === activeId) ?? moments[0]

  function selectMoment(id: MomentId) {
    setActiveId(id)
    if (id !== "prehistoria") setLensOpen(false)
  }

  const spoken = reading
    ? `Sector ${reading.sector}. ${reading.layers.map((layer) => `${layer.label} ${layer.pct}%`).join(", ")}.`
    : ""

  return (
    <div className="flex flex-col gap-4">
      <div
        role="tablist"
        aria-label="Momentos del archivo"
        className="relative flex snap-x gap-2 overflow-x-auto pb-2"
      >
        {moments.map((moment) => {
          const selected = moment.id === activeId
          return (
            <button
              key={moment.id}
              type="button"
              role="tab"
              id={`momento-${moment.id}`}
              aria-selected={selected}
              aria-controls="momento-panel"
              onClick={() => selectMoment(moment.id)}
              className={cn(
                "pixel-tab relative min-w-[10.5rem] flex-1 shrink-0 snap-start",
                selected && moment.open && "pixel-tab-now",
                selected && !moment.open && "pixel-tab-soon",
              )}
            >
              <span className="flex items-center gap-2">
                <span
                  className="size-2 shrink-0"
                  style={{
                    background: selected ? "#140228" : moment.open ? palette.oroszlan : palette.polip,
                  }}
                />
                <span className="text-[10px] tracking-[0.08em]">0{moment.index}</span>
                {moment.open ? null : (
                  <span className="ml-auto text-[10px] tracking-[0.08em] uppercase">Próximo</span>
                )}
              </span>
              <span className="mt-1.5 block text-[11px] leading-tight">{moment.label}</span>
            </button>
          )
        })}
      </div>

      <div
        id="momento-panel"
        role="tabpanel"
        aria-labelledby={`momento-${active.id}`}
        className="grid items-stretch gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(17rem,0.72fr)]"
      >
        <section className="pixel-frame relative overflow-hidden">
          <div className="pointer-events-none absolute top-3 left-3 z-10 flex flex-wrap gap-2">
            <span className="pixel-chip">{active.open ? "Baldío" : "Archivo cerrado"}</span>
            {active.open ? <span className="pixel-chip">Sin edificios</span> : null}
          </div>
          <div className="h-[30rem] sm:h-[34rem]">
            <IsometricGround
              interactive={active.open}
              reading={reading}
              lensOpen={lensOpen && active.open}
              onSample={(next) => {
                setReading(next)
                setLensOpen(true)
              }}
              onCloseLens={() => setLensOpen(false)}
            />
          </div>
          {active.open ? null : <div aria-hidden className="pixel-veil pointer-events-none absolute inset-0 z-[5]" />}
          {active.open && !lensOpen ? (
            <p className="pixel-chip pointer-events-none absolute bottom-3 left-3">Pulsa una baldosa del suelo</p>
          ) : null}
          {active.open ? null : <SoonOverlay moment={active} onBack={() => selectMoment("prehistoria")} />}
        </section>

        <MomentBlurb moment={active} reading={active.open ? reading : null} />
      </div>

      <p className="sr-only" aria-live="polite">
        {lensOpen ? spoken : ""}
      </p>
    </div>
  )
}

function SoonOverlay({ moment, onBack }: { moment: Moment; onBack: () => void }) {
  return (
    <div className="absolute inset-0 z-10 grid place-items-center p-6">
      <div className="pixel-panel max-w-sm px-5 py-6 text-center">
        <p className="text-[10px] tracking-[0.12em] uppercase">Próximo</p>
        <h2 className="mt-2 text-xl">{moment.title}</h2>
        <p className="mt-2 text-xs leading-relaxed" style={{ color: "#f6edff" }}>
          {moment.note}
        </p>
        <button type="button" onClick={onBack} className="pixel-btn mt-4">
          Volver a la prehistoria
        </button>
      </div>
    </div>
  )
}

function MomentBlurb({ moment, reading }: { moment: Moment; reading: SoilReading | null }) {
  const layers = reading?.layers ?? soilPalette.map((layer) => ({ ...layer, pct: 0 }))

  return (
    <aside className="pixel-panel flex flex-col p-5 sm:p-6">
      <p className="text-[11px] tracking-[0.12em] uppercase" style={{ color: palette.oroszlan }}>
        {moment.kicker}
      </p>
      <h1 className="mt-2 text-2xl sm:text-3xl">{moment.title}</h1>
      <p className="mt-3 text-xs leading-relaxed sm:text-sm" style={{ color: "#f6edff" }}>
        {moment.blurb}
      </p>
      <p className="mt-3 text-xs leading-relaxed sm:text-sm">{moment.note}</p>

      {moment.open ? (
        <>
          <dl className="mt-5 grid grid-cols-2 gap-2">
            <div className="border-2 px-3 py-2.5" style={{ borderColor: palette.oroszlan }}>
              <dt className="text-[10px] tracking-[0.1em] uppercase" style={{ color: "#d7e6ff" }}>
                Colonias
              </dt>
              <dd className="text-2xl">3</dd>
            </div>
            <div className="border-2 px-3 py-2.5" style={{ borderColor: palette.polip }}>
              <dt className="text-[10px] tracking-[0.1em] uppercase" style={{ color: "#f0d4ff" }}>
                Edificios
              </dt>
              <dd className="text-2xl">0</dd>
            </div>
          </dl>

          <div className="mt-5">
            <p className="text-[10px] tracking-[0.1em] uppercase" style={{ color: palette.oroszlan }}>
              {reading ? `Lectura · sector ${reading.sector}` : "Lectura del suelo"}
            </p>
            <ul className="mt-2 space-y-2">
              {layers.map((layer) => (
                <li key={layer.id}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2">
                      <span className="size-2.5 border border-[#1a0a06]" style={{ background: layer.color }} />
                      {layer.label}
                    </span>
                    <span style={{ color: "#d7c4ff" }}>{reading ? `${layer.pct}%` : "—"}</span>
                  </div>
                  <div className="mt-1 h-2 bg-[#120228]">
                    <div
                      className="h-full"
                      style={{
                        width: reading ? `${layer.pct}%` : "0%",
                        background: layer.color,
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <p className="mt-6 text-[10px] tracking-[0.12em] uppercase" style={{ color: palette.polip }}>
          Próximo
        </p>
      )}
    </aside>
  )
}
