"use client"

import { CensusChart } from "@/components/charts/census-chart"
import { EraChart } from "@/components/charts/era-chart"
import { PopulationMap } from "@/components/charts/population-map"
import { TerritoryChart } from "@/components/charts/territory-chart"
import { TrendChart } from "@/components/charts/trend-chart"
import type { VizSlug } from "@/data/catalog"

export function ChartView({ slug }: { slug: VizSlug }) {
  if (slug === "mapa") return <PopulationMap />
  if (slug === "tendencia") return <TrendChart />
  if (slug === "territorio") return <TerritoryChart />
  if (slug === "censo2730") return <CensusChart />
  return <EraChart />
}
