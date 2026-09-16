"use client"

import { useMemo, useState } from "react"
import { Search } from "lucide-react"
import { VizCard } from "@/components/viz-card"
import { visualizations } from "@/data/catalog"

export function PortalGrid() {
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return visualizations
    return visualizations.filter((viz) =>
      [viz.title, viz.summary, viz.kicker, ...viz.tags]
        .join(" ")
        .toLowerCase()
        .includes(needle),
    )
  }, [query])

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
            Gráficos
          </p>
          <h2 className="font-heading text-3xl">Entra a una visualización</h2>
        </div>
        <label className="relative block w-full sm:max-w-xs">
          <span className="sr-only">Buscar gráfico</span>
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por tema o nombre"
            className="h-9 w-full rounded-lg border border-input bg-background/60 pr-3 pl-9 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </label>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl bg-card px-6 py-16 text-center ring-1 ring-foreground/10">
          <p className="font-heading text-2xl">No hay gráficos con esa búsqueda</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Prueba “Oroszlan”, “2730” o “Dunántúl”.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((viz) => (
            <VizCard key={viz.slug} viz={viz} />
          ))}
        </div>
      )}
    </section>
  )
}
