"use client"

import { useState } from "react"
import { buttonVariants } from "@/components/ui/button"
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
        className="relative flex snap-x gap-2 overflow-x-auto pb-1"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute top-[18px] right-8 left-8 hidden h-px bg-foreground/15 sm:block"
        />
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
                "relative min-w-[10.5rem] flex-1 shrink-0 snap-start rounded-lg bg-background/45 px-3 py-2 text-left ring-1 ring-foreground/10 transition-colors hover:bg-card/80 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                selected && "bg-card",
              )}
              style={{
                boxShadow: selected
                  ? `inset 0 0 0 1px ${moment.open ? palette.oroszlan : palette.polip}`
                  : undefined,
              }}
            >
              <span className="flex items-center gap-2">
                <span
                  className="size-2.5 rounded-full ring-2 ring-background"
                  style={{
                    background: moment.open
                      ? palette.oroszlan
                      : selected
                        ? palette.polip
                        : "rgba(183,174,200,0.45)",
                  }}
                />
                <span className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground">
                  0{moment.index}
                </span>
                {moment.open ? null : (
                  <span
                    className="ml-auto text-[10px] tracking-[0.14em] uppercase"
                    style={{ color: palette.polip }}
                  >
                    Próximo
                  </span>
                )}
              </span>
              <span className="mt-1.5 block font-heading text-xs leading-tight">{moment.label}</span>
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
        <section className="relative overflow-hidden rounded-xl bg-card/45 ring-1 ring-foreground/10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(77,140,255,0.09),transparent_62%)]" />
          <div className="pointer-events-none absolute top-3 left-3 z-10 flex flex-wrap gap-2">
            <span className="rounded-full bg-background/80 px-2.5 py-1 text-[10px] tracking-[0.16em] text-muted-foreground uppercase ring-1 ring-foreground/10">
              {active.open ? "Baldío" : "Archivo cerrado"}
            </span>
            {active.open ? (
              <span className="rounded-full bg-background/80 px-2.5 py-1 text-[10px] tracking-[0.16em] text-muted-foreground uppercase ring-1 ring-foreground/10">
                Sin edificios
              </span>
            ) : null}
          </div>
          <div className={active.open ? "h-[30rem] sm:h-[34rem]" : "h-[30rem] opacity-40 saturate-50 sm:h-[34rem]"}>
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
          {active.open && !lensOpen ? (
            <p className="pointer-events-none absolute bottom-3 left-3 text-xs text-muted-foreground">
              Pulsa una baldosa del suelo
            </p>
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
    <div className="absolute inset-0 z-10 grid place-items-center bg-background/60 p-6">
      <div
        className="max-w-sm rounded-xl bg-card px-5 py-6 text-center ring-1"
        style={{ boxShadow: `inset 0 0 0 1px ${palette.polip}` }}
      >
        <p className="text-[10px] tracking-[0.2em] uppercase" style={{ color: palette.polip }}>
          Próximo
        </p>
        <h2 className="mt-2 text-2xl">{moment.title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{moment.note}</p>
        <button
          type="button"
          onClick={onBack}
          className={cn(buttonVariants({ variant: "outline" }), "mt-4")}
        >
          Volver a la prehistoria
        </button>
      </div>
    </div>
  )
}

function MomentBlurb({ moment, reading }: { moment: Moment; reading: SoilReading | null }) {
  const layers = reading?.layers ?? soilPalette.map((layer) => ({ ...layer, pct: 0 }))

  return (
    <aside className="flex flex-col rounded-xl bg-card/80 p-5 ring-1 ring-foreground/10 sm:p-6">
      <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">{moment.kicker}</p>
      <h1 className="mt-2 text-3xl sm:text-4xl">{moment.title}</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">{moment.blurb}</p>
      <p className="mt-3 text-sm leading-relaxed">{moment.note}</p>

      {moment.open ? (
        <>
          <dl className="mt-5 grid grid-cols-2 gap-2">
            <div className="rounded-lg bg-background/50 px-3 py-2.5 ring-1 ring-foreground/10">
              <dt className="text-[10px] tracking-[0.16em] text-muted-foreground uppercase">Colonias</dt>
              <dd className="font-heading text-2xl">3</dd>
            </div>
            <div className="rounded-lg bg-background/50 px-3 py-2.5 ring-1 ring-foreground/10">
              <dt className="text-[10px] tracking-[0.16em] text-muted-foreground uppercase">Edificios</dt>
              <dd className="font-heading text-2xl">0</dd>
            </div>
          </dl>

          <div className="mt-5">
            <p className="text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
              {reading ? `Lectura · sector ${reading.sector}` : "Lectura del suelo"}
            </p>
            <ul className="mt-2 space-y-2">
              {layers.map((layer) => (
                <li key={layer.id}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2">
                      <span className="size-2 rounded-[2px]" style={{ background: layer.color }} />
                      {layer.label}
                    </span>
                    <span className="font-mono text-muted-foreground">
                      {reading ? `${layer.pct}%` : "—"}
                    </span>
                  </div>
                  <div className="mt-1 h-1 overflow-hidden rounded-full bg-background">
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
        <p className="mt-6 text-[10px] tracking-[0.18em] uppercase" style={{ color: palette.polip }}>
          Próximo
        </p>
      )}
    </aside>
  )
}
