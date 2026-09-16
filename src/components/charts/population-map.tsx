"use client"

import { useEffect, useMemo, useState } from "react"
import { Pause, Play } from "lucide-react"
import {
  countries2730,
  eraMarks,
  peakPopulation,
  populationAt,
  trendYears,
  worldPopulationAt,
  type RegionName,
} from "@/data/world"
import {
  atlasColors,
  countryMarks,
  mapHeight,
  mapShapes,
  mapViewBox,
  mapWidth,
} from "@/data/map-geometry"
import { useMounted } from "@/hooks/use-mounted"
import { withBasePath } from "@/lib/base-path"
import { formatPeople } from "@/lib/format"
import { Button } from "@/components/ui/button"
import { ChartSkeleton } from "@/components/chart-frame"

function dimFor(region: RegionName, year: number) {
  const pop = populationAt(region, year)
  const peak = peakPopulation(region)
  const t = Math.pow(peak ? pop / peak : 0, 0.7)
  return 0.82 * (1 - t)
}

export function PopulationMap() {
  const mounted = useMounted()
  const lastIndex = trendYears.length - 1
  const [playing, setPlaying] = useState(false)
  const [index, setIndex] = useState(lastIndex)
  const [hover, setHover] = useState<RegionName | null>(null)
  const [selected, setSelected] = useState<RegionName | null>(null)

  const year = trendYears[index] ?? 3030
  const active = hover ?? selected

  useEffect(() => {
    if (!playing) return
    const timer = window.setInterval(() => {
      setIndex((current) => (current >= lastIndex ? 0 : current + 1))
    }, 900)
    return () => window.clearInterval(timer)
  }, [playing, lastIndex])

  const panel = useMemo(() => {
    if (!active) return null
    const pop = populationAt(active, year)
    const peak = peakPopulation(active)
    const origin = populationAt(active, 2568)
    const war = populationAt(active, 2999)
    const now = populationAt(active, 3030)
    const shape = mapShapes.find((item) => item.id === active)
    const countries = countries2730.filter((row) => row.region === active)
    return {
      name: active,
      realm: shape?.realm ?? "",
      pop,
      peak,
      vsPeak: peak ? (pop / peak) * 100 : 0,
      vsOrigin: origin ? ((pop - origin) / origin) * 100 : 0,
      warDrop: peak ? ((war - peak) / peak) * 100 : 0,
      now,
      countries,
    }
  }, [active, year])

  if (!mounted) return <ChartSkeleton />

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={playing ? "secondary" : "default"}
            onClick={() => setPlaying((value) => !value)}
          >
            {playing ? <Pause /> : <Play />}
            {playing ? "Pausa" : "Reproducir épocas"}
          </Button>
          {eraMarks.map((mark) => {
            const markIndex = trendYears.indexOf(mark.year)
            return (
              <Button
                key={mark.year}
                variant={year === mark.year ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setPlaying(false)
                  if (markIndex >= 0) setIndex(markIndex)
                }}
              >
                {mark.label}
              </Button>
            )
          })}
        </div>
        <p className="font-mono text-sm text-primary">{year}</p>
      </div>

      <input
        type="range"
        min={0}
        max={lastIndex}
        value={index}
        onChange={(event) => {
          setPlaying(false)
          setIndex(Number(event.target.value))
        }}
        className="w-full accent-primary"
        aria-label="Año del mapa"
      />
      <div className="flex justify-between font-mono text-[10px] text-muted-foreground">
        {trendYears.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.45fr_0.55fr]">
        <div className="overflow-hidden rounded-xl bg-[#14101c] ring-1 ring-foreground/10">
          <svg
            viewBox={mapViewBox}
            className="h-auto w-full"
            role="img"
            aria-label={`Mapa poblacional del año ${year}`}
          >
            <image
              href={withBasePath("/maps/continente.png")}
              width={mapWidth}
              height={mapHeight}
              preserveAspectRatio="xMidYMid meet"
              style={{ pointerEvents: "none" }}
            />

            {mapShapes.map((shape) => {
              const isOn = active === shape.id
              const dim = dimFor(shape.id, year)
              return (
                <path
                  key={shape.id}
                  d={shape.d}
                  fill="#0c0a14"
                  fillOpacity={Math.max(0, dim - (isOn ? 0.16 : 0))}
                  fillRule="evenodd"
                  stroke={isOn ? "#f4f0ff" : atlasColors[shape.id]}
                  strokeOpacity={isOn ? 0.95 : 0.28}
                  strokeWidth={isOn ? 2.2 : 0.8}
                  className="cursor-pointer transition-[fill-opacity,stroke] duration-500"
                  onMouseEnter={() => setHover(shape.id)}
                  onMouseLeave={() => setHover(null)}
                  onClick={() =>
                    setSelected((current) => (current === shape.id ? null : shape.id))
                  }
                />
              )
            })}

            {mapShapes.map((shape) => {
              const compact = shape.id === "Alpenvorland" || shape.id === "Karpatenland"
              return (
                <g
                  key={`${shape.id}-label`}
                  className="pointer-events-none"
                  style={{ fontFamily: "var(--font-chakra), sans-serif" }}
                >
                  <text
                    x={shape.labelX}
                    y={shape.labelY}
                    textAnchor="middle"
                    fill={active === shape.id ? "#f4f0ff" : "rgba(244,240,255,0.92)"}
                    stroke="rgba(12,10,18,0.72)"
                    strokeWidth="3.5"
                    paintOrder="stroke"
                    fontSize={compact ? 11 : 13}
                    letterSpacing="0.1em"
                    className="uppercase"
                  >
                    {shape.id}
                  </text>
                  <text
                    x={shape.labelX}
                    y={shape.labelY + (compact ? 13 : 15)}
                    textAnchor="middle"
                    fill={active === shape.id ? "#e8f6ff" : "rgba(244,240,255,0.78)"}
                    stroke="rgba(12,10,18,0.65)"
                    strokeWidth="3"
                    paintOrder="stroke"
                    fontSize={compact ? 8 : 9}
                  >
                    {shape.realm}
                  </text>
                </g>
              )
            })}

            {countryMarks
              .filter((mark) => active === mark.region)
              .map((mark) => (
                <text
                  key={mark.name}
                  x={mark.x}
                  y={mark.y}
                  textAnchor="middle"
                  fill="rgba(244,240,255,0.7)"
                  stroke="rgba(12,10,18,0.55)"
                  strokeWidth="2.5"
                  paintOrder="stroke"
                  fontSize="8"
                  className="pointer-events-none"
                >
                  {mark.name}
                </text>
              ))}
          </svg>
        </div>

        <div className="space-y-3">
          <div className="rounded-lg bg-card p-4 ring-1 ring-foreground/10">
            <p className="text-xs tracking-wide text-muted-foreground uppercase">
              Población mundial
            </p>
            <p className="mt-1 font-heading text-2xl">{formatPeople(worldPopulationAt(year))}</p>
            <p className="mt-1 font-mono text-xs text-muted-foreground">{year}</p>
          </div>

          {panel ? (
            <div className="rounded-lg bg-card p-4 ring-1 ring-primary/35">
              <p className="text-xs tracking-wide text-muted-foreground uppercase">Región</p>
              <h3 className="font-heading text-xl" style={{ color: atlasColors[panel.name] }}>
                {panel.name}
              </h3>
              <p className="text-sm text-muted-foreground">{panel.realm}</p>
              <p className="mt-2 font-mono text-lg">{formatPeople(panel.pop)}</p>
              <p className="text-xs text-muted-foreground">
                {panel.vsPeak.toFixed(0)}% de su pico · {panel.vsOrigin.toFixed(0)}% vs 2568
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                En la guerra (2945→2999) esta tierra{" "}
                {panel.warDrop < 0
                  ? `pierde ${Math.abs(panel.warDrop).toFixed(0)}%`
                  : "casi no se mueve"}
                .
              </p>
              <ul className="mt-3 space-y-1 text-sm">
                {panel.countries.map((country) => (
                  <li key={country.pais} className="flex justify-between gap-2">
                    <span>{country.pais}</span>
                    <span className="font-mono text-xs text-muted-foreground">
                      {country.pctOroszlan}% Oroszlan
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="rounded-lg bg-card p-4 text-sm text-muted-foreground ring-1 ring-foreground/10">
              Pasa el cursor o pulsa una tierra. El mapa es el tuyo: al bajar la población, esa
              región se apaga.
            </p>
          )}

          <div className="rounded-lg bg-card p-4 ring-1 ring-foreground/10">
            <p className="text-xs text-muted-foreground">Tierras del censo</p>
            <ul className="mt-2 space-y-1.5 text-sm">
              {mapShapes.map((shape) => (
                <li key={shape.id}>
                  <button
                    type="button"
                    className="flex w-full items-start gap-2 text-left"
                    onClick={() =>
                      setSelected((current) => (current === shape.id ? null : shape.id))
                    }
                  >
                    <span
                      className="mt-1 size-2.5 shrink-0 rounded-full"
                      style={{ background: atlasColors[shape.id] }}
                    />
                    <span>
                      <span className="block leading-tight">{shape.id}</span>
                      <span className="block text-[11px] text-muted-foreground">
                        {shape.realm}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex h-2 overflow-hidden rounded-full">
              <div className="flex-1 bg-[#14101c]" />
              <div className="flex-[2]" style={{ background: atlasColors.Dunántúl }} />
            </div>
            <div className="mt-1 flex justify-between font-mono text-[10px] text-muted-foreground">
              <span>Vacío</span>
              <span>Pico de esa región</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
