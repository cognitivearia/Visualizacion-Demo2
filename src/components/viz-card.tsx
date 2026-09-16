import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MiniChart } from "@/components/mini-chart"
import type { Visualization } from "@/data/catalog"

export function VizCard({ viz }: { viz: Visualization }) {
  return (
    <Link href={`/graficos/${viz.slug}`} className="group block h-full">
      <Card className="h-full transition-all duration-200 group-hover:-translate-y-0.5 group-hover:ring-primary/40">
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <Badge variant="outline">{viz.kicker}</Badge>
            <ArrowUpRight className="size-4 text-muted-foreground transition-colors group-hover:text-primary" />
          </div>
          <CardTitle className="font-heading text-2xl">{viz.title}</CardTitle>
          <CardDescription>{viz.summary}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg bg-background/50 p-3 ring-1 ring-foreground/8">
            <MiniChart slug={viz.slug} />
          </div>
          <p className="mt-3 text-xs text-muted-foreground">{viz.interaction}</p>
        </CardContent>
      </Card>
    </Link>
  )
}
