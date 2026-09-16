"use client"

import { useState } from "react"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { occupation3030 } from "@/data/world"
import { useMounted } from "@/hooks/use-mounted"
import { factionColor } from "@/lib/palette"
import { ChartCanvas, ChartFrame, ChartSkeleton } from "@/components/chart-frame"
import { ChartTooltip } from "@/components/charts/chart-tooltip"
import { cn } from "@/lib/utils"

export function TerritoryChart() {
  const mounted = useMounted()
  const [active, setActive] = useState<string | null>(null)
  const selected = occupation3030.find((item) => item.nacion === active)

  if (!mounted) return <ChartSkeleton />

  return (
    <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
      <ChartFrame>
        <ChartCanvas>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={ChartTooltip} />
              <Pie
                data={occupation3030}
                dataKey="ocupacion"
                nameKey="nacion"
                cx="50%"
                cy="50%"
                innerRadius="48%"
                outerRadius="74%"
                paddingAngle={2}
                onClick={(_, index) => {
                  const nacion = occupation3030[index]?.nacion
                  setActive((current) => (current === nacion ? null : nacion ?? null))
                }}
              >
                {occupation3030.map((item) => (
                  <Cell
                    key={item.nacion}
                    fill={factionColor(item.nacion)}
                    opacity={!active || active === item.nacion ? 1 : 0.22}
                    cursor="pointer"
                    stroke="rgba(14,12,20,0.55)"
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ChartCanvas>
      </ChartFrame>

      <div className="space-y-2">
        {occupation3030.map((item) => {
          const isActive = active === item.nacion
          return (
            <button
              key={item.nacion}
              type="button"
              onClick={() => setActive(isActive ? null : item.nacion)}
              className={cn(
                "w-full rounded-lg p-3 text-left ring-1 ring-foreground/10 transition",
                isActive ? "bg-card ring-primary/50" : "bg-card/50 hover:ring-primary/30",
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-sm">
                  <span
                    className="size-2.5 rounded-full"
                    style={{ background: factionColor(item.nacion) }}
                  />
                  {item.nacion}
                </span>
                <span className="font-mono text-sm">{item.ocupacion}%</span>
              </div>
            </button>
          )
        })}

        <div className="rounded-lg bg-card p-4 ring-1 ring-foreground/10">
          {selected ? (
            <>
              <p className="text-xs tracking-wide text-muted-foreground uppercase">
                Ocupación 3030
              </p>
              <h3 className="font-heading text-xl">{selected.nacion}</h3>
              <p className="mt-1 font-mono text-2xl" style={{ color: factionColor(selected.nacion) }}>
                {selected.ocupacion}%
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {selected.nacion === "Otros"
                  ? "Ni Oroszlan ni Polip. El resto del mapa, después de la guerra."
                  : `${selected.nacion} controla casi la mitad del territorio mundial.`}
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Azul Oroszlan, morado Polip, verde el resto. Elige una porción para fijarla.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
