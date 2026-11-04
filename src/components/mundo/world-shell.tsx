"use client"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { IsometricGround, type GroundScene, type SoilReading } from "@/components/mundo/isometric-ground"
import { occupation3030, populationTrend, regionKeys } from "@/data/world"
import { firstBuildings, moments, soilPalette, townspeople, type Moment, type MomentId, type Person, type PersonId } from "@/data/moments"
import { formatPeople } from "@/lib/format"
import { palette, regionColors } from "@/lib/palette"

const year2945 = populationTrend.find((row) => row.anio === 2945)

export function WorldShell({ onYear }: { onYear?: (year: number) => void }) {
  const [activeId, setActiveId] = useState<MomentId>("prehistoria")
  const [reading, setReading] = useState<SoilReading | null>(null)
  const [lensOpen, setLensOpen] = useState(false)
  const [personId, setPersonId] = useState<PersonId | null>(null)
  const [lupineOpen, setLupineOpen] = useState(false)
  const [flash, setFlash] = useState<"pink" | "white" | null>(null)
  const flashTimers = useRef<number[]>([])
  const active = moments.find((moment) => moment.id === activeId) ?? moments[0]
  const scene: GroundScene =
    active.id === "guerra"
      ? "guerra"
      : active.id === "postguerra"
        ? "postguerra"
        : active.id === "incertidumbre"
          ? "incertidumbre"
          : active.id === "civilizacion"
            ? "civilizacion"
            : active.open
              ? "baldio"
              : "cerrado"
  const person = townspeople.find((item) => item.id === personId) ?? null

  function selectMoment(id: MomentId) {
    setActiveId(id)
    setPersonId(null)
    setLupineOpen(false)
    if (id !== "prehistoria") setLensOpen(false)
  }

  function playFire() {
    flashTimers.current.forEach((timer) => window.clearTimeout(timer))
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduce) {
      setFlash(null)
      selectMoment("guerra")
      return
    }
    setFlash("pink")
    flashTimers.current = [
      window.setTimeout(() => setFlash("white"), 220),
      window.setTimeout(() => {
        selectMoment("guerra")
        setFlash(null)
      }, 520),
    ]
  }

  useEffect(() => {
    onYear?.(active.year)
  }, [active.year, onYear])

  useEffect(() => {
    const timers = flashTimers
    return () => {
      timers.current.forEach((timer) => window.clearTimeout(timer))
    }
  }, [])

  useEffect(() => {
    if (!person && !lupineOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return
      setPersonId(null)
      setLupineOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [person, lupineOpen])

  const spoken = reading
    ? `Sector ${reading.sector}. ${reading.layers.map((layer) => `${layer.label} ${layer.pct}%`).join(", ")}.`
    : ""

  return (
    <div className="flex flex-col gap-4">
      <div role="tablist" aria-label="Línea de tiempo" className="relative px-1 pt-1">
        <div
          aria-hidden
          className="pointer-events-none absolute top-[6px] right-[10%] left-[10%] flex h-1"
        >
          <div className="h-full flex-1" style={{ background: palette.oroszlan }} />
          <div className="h-full flex-1" style={{ background: palette.polip }} />
        </div>
        <div className="relative flex">
          {moments.map((moment) => {
            const selected = moment.id === activeId
            const color = moment.open ? palette.oroszlan : palette.polip
            return (
              <button
                key={moment.id}
                type="button"
                role="tab"
                id={`momento-${moment.id}`}
                aria-selected={selected}
                aria-controls="momento-panel"
                onClick={() => selectMoment(moment.id)}
                className="flex flex-1 flex-col items-center gap-2 border-0 bg-transparent p-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f6edff]"
              >
                <span
                  aria-hidden
                  className="size-4 border-[3px]"
                  style={{
                    borderColor: color,
                    background: selected ? color : "#120228",
                  }}
                />
                <span className="text-[12px] leading-none" style={{ color: selected ? color : "#f6edff" }}>
                  {moment.year}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div
        id="momento-panel"
        role="tabpanel"
        aria-labelledby={`momento-${active.id}`}
        className="grid items-stretch gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(17rem,0.72fr)]"
      >
        <section className="pixel-frame relative overflow-hidden">
          <div className="pointer-events-none absolute top-3 left-3 z-10 flex flex-wrap gap-2">
            <span className="pixel-chip">
              {scene === "baldio"
                ? "Baldío"
                : scene === "cerrado"
                  ? "Archivo cerrado"
                  : scene === "guerra"
                    ? "Guerra"
                    : scene === "postguerra"
                      ? "Postguerra"
                      : "Ciudad"}
            </span>
            {scene === "baldio" ? <span className="pixel-chip">Sin edificios</span> : null}
            {scene === "civilizacion" ? <span className="pixel-chip">Vida actual</span> : null}
            {scene === "incertidumbre" ? <span className="pixel-chip">Lupine al borde</span> : null}
            {scene === "guerra" ? <span className="pixel-chip">Bloques rotos</span> : null}
            {scene === "postguerra" ? <span className="pixel-chip">Estado totalitario</span> : null}
          </div>
          <div className="h-[30rem] sm:h-[34rem]">
            <IsometricGround
              scene={scene}
              reading={reading}
              lensOpen={lensOpen && scene === "baldio"}
              onSample={(next) => {
                setReading(next)
                setLensOpen(true)
              }}
              onCloseLens={() => setLensOpen(false)}
              activePerson={scene === "civilizacion" ? personId : null}
              onPickPerson={setPersonId}
            />
          </div>
          {scene === "cerrado" ? (
            <div aria-hidden className="pixel-veil pointer-events-none absolute inset-0 z-[5]" />
          ) : null}
          {scene === "baldio" && !lensOpen ? (
            <p className="pixel-chip pointer-events-none absolute bottom-3 left-3">Pulsa una baldosa del suelo</p>
          ) : null}
          {scene === "civilizacion" && !person ? (
            <p className="pixel-chip pointer-events-none absolute bottom-3 left-3">Pulsa a una persona</p>
          ) : null}
          {scene === "incertidumbre" && !lupineOpen ? (
            <p className="pixel-chip pointer-events-none absolute bottom-3 left-3">Pulsa a Lupine, fuera del mapa</p>
          ) : null}
          {scene === "incertidumbre" ? (
            <LupineMark pressed={lupineOpen} onClick={() => setLupineOpen(true)} />
          ) : null}
          {scene === "cerrado" ? <SoonOverlay moment={active} onBack={() => selectMoment("prehistoria")} /> : null}
          {scene === "civilizacion" && person ? (
            <PersonFile person={person} onClose={() => setPersonId(null)} />
          ) : null}
        </section>

        <MomentBlurb
          moment={active}
          scene={scene}
          reading={scene === "baldio" ? reading : null}
          person={scene === "civilizacion" ? person : null}
          onPickPerson={setPersonId}
          lupineOpen={scene === "incertidumbre" && lupineOpen}
          onFire={playFire}
        />
      </div>

      <p className="sr-only" aria-live="polite">
        {lensOpen ? spoken : ""}
      </p>
      {flash
        ? createPortal(
            <div
              aria-hidden
              data-flash={flash}
              className="pointer-events-none fixed inset-0"
              style={{ zIndex: 80, background: flash === "pink" ? "#ff4fa3" : "#ffffff" }}
            />,
            document.body,
          )
        : null}
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

function PersonFile({ person, onClose }: { person: Person; onClose: () => void }) {
  return (
    <div role="dialog" aria-labelledby="ficha-titulo" className="pixel-panel absolute right-3 bottom-3 z-20 w-64 p-4">
      <p className="text-[10px] tracking-[0.12em] uppercase" style={{ color: palette.mist }}>
        Documento inventado
      </p>
      <h2 id="ficha-titulo" className="mt-1 text-lg">
        {person.name}
      </h2>
      <dl className="mt-3 space-y-1.5 text-xs" style={{ color: "#f6edff" }}>
        <div className="flex justify-between gap-3">
          <dt>Edad</dt>
          <dd>{person.age}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>Género</dt>
          <dd>{person.gender}</dd>
        </div>
        <div>
          <dt>Familia</dt>
          <dd className="mt-1 leading-relaxed">{person.family}</dd>
        </div>
      </dl>
      <button type="button" onClick={onClose} className="pixel-btn mt-3">
        Cerrar
      </button>
    </div>
  )
}

function LupineMark({ pressed, onClick }: { pressed: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={pressed}
      aria-label="Lupine, fuera del mapa. Abrir la nota"
      className="absolute top-1/2 left-2 z-20 flex -translate-y-1/2 flex-col items-start gap-1 border-0 bg-transparent p-0"
    >
      <svg width="78" height="64" viewBox="0 0 78 64" aria-hidden>
        <polygon points="18,28 30,22 30,46 18,40" fill="#1d4ed8" stroke="#1a0a06" strokeWidth="2" />
        <polygon points="30,28 42,22 42,46 30,40" fill="#4d8cff" stroke="#1a0a06" strokeWidth="2" />
        <polygon points="22,16 34,16 38,24 18,24" fill="#dbeafe" stroke="#1a0a06" strokeWidth="2" />
        <polygon points="42,30 62,30 62,34 42,34" fill="#4d8cff" stroke="#1a0a06" strokeWidth="2" />
        <polygon points="58,24 72,32 58,40" fill="#c45cff" stroke="#1a0a06" strokeWidth="2" />
      </svg>
      <span className="pixel-chip">Lupine</span>
    </button>
  )
}

function Population2945() {
  if (!year2945) return null
  const rows = regionKeys.map((region) => ({ region, value: year2945[region] }))
  const max = Math.max(...rows.map((row) => row.value))
  const total = rows.reduce((sum, row) => sum + row.value, 0)

  return (
    <div className="mt-4">
      <p className="text-[10px] tracking-[0.1em] uppercase" style={{ color: palette.oroszlan }}>
        Archivo · población 2945
      </p>
      <p className="mt-1 text-[11px] leading-relaxed" style={{ color: "#d7c4ff" }}>
        Cifras del portal, no inventadas. Total {formatPeople(total)}.
      </p>
      <ul className="mt-3 space-y-2">
        {rows.map((row) => (
          <li key={row.region}>
            <div className="flex items-center justify-between gap-2 text-[11px]">
              <span>{row.region}</span>
              <span style={{ color: "#d7c4ff" }}>{formatPeople(row.value)}</span>
            </div>
            <div className="mt-1 h-2 bg-[#120228]">
              <div className="h-full" style={{ width: `${(row.value / max) * 100}%`, background: regionColors[row.region] }} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

const shareColor: Record<string, string> = {
  Oroszlan: palette.oroszlan,
  Polip: palette.polip,
  Otros: palette.otros,
}

function TerritorySplit() {
  return (
    <div className="mt-5">
      <p className="text-[10px] tracking-[0.1em] uppercase" style={{ color: palette.oroszlan }}>
        Archivo · división territorial
      </p>
      <p className="mt-1 text-[11px] leading-relaxed" style={{ color: "#d7c4ff" }}>
        Cifras del portal: Oroszlan, Polip y otros.
      </p>
      <div className="mt-3 flex h-3 bg-[#120228]">
        {occupation3030.map((row) => (
          <div key={row.nacion} style={{ width: `${row.ocupacion}%`, background: shareColor[row.nacion] ?? palette.mist }} />
        ))}
      </div>
      <ul className="mt-3 space-y-2">
        {occupation3030.map((row) => (
          <li key={row.nacion} className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-2">
              <span className="size-2.5 border border-[#1a0a06]" style={{ background: shareColor[row.nacion] ?? palette.mist }} />
              {row.nacion}
            </span>
            <span style={{ color: "#d7c4ff" }}>
              {row.ocupacion.toLocaleString("es-ES", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function MomentBlurb({
  moment,
  scene,
  reading,
  person,
  onPickPerson,
  lupineOpen,
  onFire,
}: {
  moment: Moment
  scene: GroundScene
  reading: SoilReading | null
  person: Person | null
  onPickPerson: (id: PersonId) => void
  lupineOpen: boolean
  onFire: () => void
}) {
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

      {scene === "civilizacion" ? (
        <>
          <dl className="mt-5 grid grid-cols-2 gap-2">
            <div className="border-2 px-3 py-2.5" style={{ borderColor: palette.oroszlan }}>
              <dt className="text-[10px] tracking-[0.1em] uppercase" style={{ color: "#d7e6ff" }}>
                Edificios
              </dt>
              <dd className="text-2xl">{firstBuildings.length}</dd>
            </div>
            <div className="border-2 px-3 py-2.5" style={{ borderColor: palette.polip }}>
              <dt className="text-[10px] tracking-[0.1em] uppercase" style={{ color: "#f0d4ff" }}>
                Personas
              </dt>
              <dd className="text-2xl">{townspeople.length}</dd>
            </div>
          </dl>
          <ul className="mt-4 space-y-2">
            {townspeople.map((item) => {
              const selected = person?.id === item.id
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    aria-pressed={selected}
                    onClick={() => onPickPerson(item.id)}
                    className="flex w-full items-center justify-between border-2 px-3 py-2 text-left text-xs"
                    style={{
                      borderColor: "#d7c4a8",
                      background: selected ? "#d7c4a8" : "#120228",
                      color: selected ? "#140228" : "#f6edff",
                    }}
                  >
                    <span>{item.name}</span>
                    <span>{item.age}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </>
      ) : scene === "incertidumbre" && lupineOpen ? (
        <>
          <p className="mt-4 text-[10px] tracking-[0.1em] uppercase" style={{ color: palette.polip }}>
            Flavor
          </p>
          <p className="mt-2 text-xs leading-relaxed" style={{ color: "#f6edff" }}>
            Lupine no vive en una baldosa. Está fuera de la ciudad y la señala. Estas dos frases son flavor: el archivo no guarda su voz, solo el gesto.
          </p>
          <Population2945 />
          <button type="button" onClick={onFire} className="pixel-btn mt-5 w-fit">
            FIRE
          </button>
          <p className="mt-2 text-[11px] leading-relaxed" style={{ color: "#d7c4ff" }}>
            FIRE no es una persona. Pasa a la fecha siguiente, 2999.
          </p>
        </>
      ) : scene === "baldio" ? (
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
      ) : scene === "guerra" ? (
        <TerritorySplit />
      ) : scene === "postguerra" ? null : (
        <p className="mt-6 text-[10px] tracking-[0.12em] uppercase" style={{ color: palette.polip }}>
          Próximo
        </p>
      )}
    </aside>
  )
}
