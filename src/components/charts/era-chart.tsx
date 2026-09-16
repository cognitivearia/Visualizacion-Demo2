"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { eraComparison } from "@/data/world"
import { useMounted } from "@/hooks/use-mounted"
import { palette } from "@/lib/palette"
import { ChartCanvas, ChartFrame, ChartSkeleton } from "@/components/chart-frame"
import { ChartTooltip } from "@/components/charts/chart-tooltip"

export function EraChart() {
  const mounted = useMounted()

  if (!mounted) return <ChartSkeleton />

  return (
    <div className="space-y-4">
      <ChartFrame>
        <ChartCanvas>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={eraComparison} margin={{ top: 24, right: 8, left: 0, bottom: 8 }}>
              <CartesianGrid stroke="rgba(183,174,200,0.1)" vertical={false} />
              <XAxis
                dataKey="region"
                tick={{ fill: "#b7aec8", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fill: "#b7aec8", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                width={40}
                unit=" M"
              />
              <Tooltip content={ChartTooltip} />
              <Bar
                dataKey="poblacion2730M"
                name="2730 (M)"
                fill={palette.green}
                maxBarSize={28}
              />
              <Bar
                dataKey="poblacion3030M"
                name="3030 (M)"
                fill={palette.blue}
                maxBarSize={28}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCanvas>
      </ChartFrame>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {eraComparison.map((row) => (
          <div key={row.region} className="rounded-lg bg-card p-3 ring-1 ring-foreground/10">
            <p className="text-xs text-muted-foreground">{row.region}</p>
            <p className="mt-1 font-mono text-lg text-primary">
              {row.cambioPct.toLocaleString("es-ES", { maximumFractionDigits: 0 })}%
            </p>
            <p className="text-xs text-muted-foreground">respecto a 2730</p>
          </div>
        ))}
      </div>
    </div>
  )
}
