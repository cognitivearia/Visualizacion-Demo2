import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { ChartView } from "@/components/charts/chart-view"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { getVisualization, visualizations, type VizSlug } from "@/data/catalog"

type PageProps = {
  params: Promise<{ slug: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return visualizations.map((viz) => ({ slug: viz.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const viz = getVisualization(slug)
  if (!viz) return { title: "Gráfico no encontrado" }
  return {
    title: viz.title,
    description: viz.summary,
  }
}

export default async function GraficoPage({ params }: PageProps) {
  const { slug } = await params
  const viz = getVisualization(slug)
  if (!viz) notFound()

  const index = visualizations.findIndex((item) => item.slug === viz.slug)
  const previous = visualizations[index - 1]
  const next = visualizations[index + 1]

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10">
      <div className="flex flex-wrap items-center gap-3">
        <Link href="/" className={buttonVariants({ variant: "ghost" })}>
          <ArrowLeft />
          Archivo
        </Link>
        <Badge variant="outline">{viz.kicker}</Badge>
      </div>

      <header className="max-w-3xl space-y-3">
        <h1 className="text-4xl sm:text-5xl">{viz.title}</h1>
        <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
          {viz.description}
        </p>
        <p className="rounded-xl bg-card/70 px-4 py-3 text-sm ring-1 ring-foreground/10">
          <span className="text-primary">Cómo usarlo. </span>
          {viz.interaction}
        </p>
      </header>

      <ChartView slug={viz.slug as VizSlug} />

      <nav className="flex flex-col gap-2 border-t border-border/70 pt-6 sm:flex-row sm:justify-between">
        {previous ? (
          <Link
            href={`/graficos/${previous.slug}`}
            className={buttonVariants({ variant: "outline" })}
          >
            <ArrowLeft />
            {previous.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/graficos/${next.slug}`}
            className={buttonVariants({ variant: "outline" })}
          >
            {next.title}
            <ArrowRight />
          </Link>
        ) : null}
      </nav>
    </div>
  )
}
