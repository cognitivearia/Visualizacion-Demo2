"use client"

import { useEffect, useMemo, useState } from "react"
import { Pause, Play } from "lucide-react"
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { populationTrend, regionKeys, type RegionName } from "@/data/world"
import { useMounted } from "@/hooks/use-mounted"
import { toMillions } from "@/lib/format"
import { regionColors } from "@/lib/palette"
import { Button } from "@/components/ui/button"
import { ChartCanvas, ChartEmpty, ChartFrame, ChartSkeleton } from "@/components/chart-frame"
import { ChartTooltip } from "@/components/charts/chart-tooltip"

type SeriesKey = RegionName

export function TrendChart() {
  const mounted = useMounted()
  const [playing, setPlaying] = useState(false)
  const [cursor, setCursor] = useState(populationTrend.length)
  const [visible, setVisible] = useState<Record<SeriesKey, boolean>>({
    Dunántúl: true,
    "Nagy-Alföld": true,
    Karpatenland: true,
    Ostseeküste: true,
    Alpenvorland: true,
  })

  useEffect(() => {
    if (!playing) return
    const timer = window.setInterval(() => {
      setCursor((current) =>
        current >= populationTrend.length ? 2 : current + 1,
      )
    }, 480)
    return () => window.clearInterval(timer)
  }, [playing])

  const data = useMemo(
    () =>
      populationTrend.slice(0, Math.max(2, cursor)).map((row) => ({
        anio: row.anio,
        Dunántúl: toMillions(row.Dunántúl),
        "Nagy-Alföld": toMillions(row["Nagy-Alföld"]),
        Karpatenland: toMillions(row.Karpatenland),
        Ostseeküste: toMillions(row.Ostseeküste),
        Alpenvorland: toMillions(row.Alpenvorland),
        totalM: row.totalM,
      })),
    [cursor],
  )
  const latest = data[data.length - 1]
  const anyVisible = Object.values(visible).some(Boolean)

  if (!mounted) return <ChartSkeleton />

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant={playing ? "secondary" : "default"}
            onClick={() => {
              if (cursor >= populationTrend.length) setCursor(2)
              setPlaying((value) => !value)
            }}
          >
            {playing ? <Pause /> : <Play />}
            {playing ? "Pausa" : "Reproducir"}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setPlaying(false)
              setCursor(populationTrend.length)
            }}
          >
            Serie completa
          </Button>
        </div>
        <p className="font-mono text-xs text-muted-foreground">
          {latest.anio} · {latest.totalM.toLocaleString("es-ES")} M en las cinco regiones
        </p>
      </div>

      <input
        type="range"
        min={2}
        max={populationTrend.length}
        value={cursor}
        onChange={(event) => {
          setPlaying(false)
          setCursor(Number(event.target.value))
        }}
        className="w-full accent-primary"
        aria-label="Recorrer años"
      />

      <ChartFrame>
        {!anyVisible ? (
          <ChartEmpty message="Activa al menos una región en la leyenda." />
        ) : (
          <ChartCanvas>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 24, right: 16, left: 8, bottom: 8 }}>
                <CartesianGrid stroke="rgba(183,174,200,0.1)" vertical={false} />
                <XAxis
                  dataKey="anio"
                  tick={{ fill: "#b7aec8", fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fill: "#b7aec8", fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  width={48}
                  unit=" M"
                />
                <Tooltip content={ChartTooltip} />
                <Legend
                  onClick={(entry) => {
                    const key = entry.dataKey as SeriesKey
                    if (!key) return
                    setVisible((current) => ({ ...current, [key]: !current[key] }))
                  }}
                  wrapperStyle={{ cursor: "pointer" }}
                />
                {regionKeys.map((key) =>
                  visible[key] ? (
                    <Line
                      key={key}
                      type="monotone"
                      dataKey={key}
                      name={`${key} (M)`}
                      stroke={regionColors[key]}
                      strokeWidth={2.4}
                      dot={false}
                      activeDot={{ r: 5 }}
                      animationDuration={450}
                    />
                  ) : null,
                )}
              </LineChart>
            </ResponsiveContainer>
          </ChartCanvas>
        )}
      </ChartFrame>
    </div>
  )
}
