"use client"

import { useMemo, useState } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { countries2730, regions } from "@/data/world"
import { useMounted } from "@/hooks/use-mounted"
import { palette } from "@/lib/palette"
import { ChartEmpty, ChartFrame, ChartSkeleton } from "@/components/chart-frame"
import { ChartTooltip } from "@/components/charts/chart-tooltip"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function CensusChart() {
  const mounted = useMounted()
  const [region, setRegion] = useState("Todas")
  const [selected, setSelected] = useState<string | null>(null)

  const data = useMemo(() => {
    return countries2730.filter(
      (row) => region === "Todas" || row.region === region,
    )
  }, [region])

  const detail = countries2730.find((row) => row.pais === selected)

  if (!mounted) return <ChartSkeleton />

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Select
          value={region}
          onValueChange={(value) => {
            if (value) setRegion(value)
          }}
        >
          <SelectTrigger className="min-w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todas">Todas las regiones</SelectItem>
            {regions.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Azul = Oroszlan. Morado = Polip. Clic en una barra para fijar el país.
        </p>
      </div>

      <ChartFrame>
        {data.length === 0 ? (
          <ChartEmpty message="No hay países con ese filtro." />
        ) : (
          <div className="h-[420px] w-full md:h-[520px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                layout="vertical"
                margin={{ top: 16, right: 16, left: 8, bottom: 8 }}
              >
                <CartesianGrid stroke="rgba(183,174,200,0.1)" horizontal={false} />
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  tick={{ fill: "#b7aec8", fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  unit="%"
                />
                <YAxis
                  type="category"
                  dataKey="pais"
                  width={110}
                  tick={{ fill: "#b7aec8", fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={ChartTooltip} />
                <Bar
                  dataKey="pctOroszlan"
                  name="Oroszlan %"
                  stackId="split"
                  fill={palette.oroszlan}
                  cursor="pointer"
                  onClick={(entry) => {
                    const point = entry as { pais?: string; payload?: { pais?: string } }
                    const name = point.payload?.pais ?? point.pais
                    if (name) setSelected((current) => (current === name ? null : name))
                  }}
                />
                <Bar
                  dataKey="pctPolip"
                  name="Polip %"
                  stackId="split"
                  fill={palette.polip}
                  cursor="pointer"
                  onClick={(entry) => {
                    const point = entry as { pais?: string; payload?: { pais?: string } }
                    const name = point.payload?.pais ?? point.pais
                    if (name) setSelected((current) => (current === name ? null : name))
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </ChartFrame>

      {detail ? (
        <div className="rounded-lg bg-card p-4 ring-1 ring-primary/35">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-heading text-xl">{detail.pais}</h3>
            <Button variant="ghost" size="sm" onClick={() => setSelected(null)}>
              Cerrar
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">{detail.region}</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-xs text-muted-foreground">Simpatizantes Oroszlan</p>
              <p className="font-mono text-lg" style={{ color: palette.oroszlan }}>
                {detail.pctOroszlan}% · {detail.oroszlan.toLocaleString("es-ES", { maximumFractionDigits: 1 })}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Oposición Polip</p>
              <p className="font-mono text-lg" style={{ color: palette.polip }}>
                {detail.pctPolip}% · {detail.polip.toLocaleString("es-ES", { maximumFractionDigits: 1 })}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          El orden va del país más oroszlani al más dividido. Innsbrucktal es el más cercano a un empate.
        </p>
      )}
    </div>
  )
}
