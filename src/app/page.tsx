import Link from "next/link"
import { PortalGrid } from "@/components/portal-grid"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { kpis } from "@/data/world"
import { project } from "@/data/catalog"

export default function HomePage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-12 px-4 py-10 sm:px-6 sm:py-14">
      <section className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
        <div className="space-y-5">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">Año 3030</Badge>
            <Badge variant="outline">Oroszlan / Polip</Badge>
          </div>
          <h1 className="max-w-xl text-4xl leading-[1.05] sm:text-6xl">
            Archivo de un planeta partido.
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {project.blurb} Nuestros colores nacionales nos mostraran esto.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link href="/graficos/mapa" className={buttonVariants()}>
              Abrir el mapa
            </Link>
            <Link href="/datos" className={buttonVariants({ variant: "outline" })}>
              Fuentes del censo
            </Link>
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-3">
          {kpis.map((item) => (
            <div
              key={item.label}
              className="rounded-lg bg-card/80 p-4 ring-1 ring-foreground/10"
            >
              <dt className="text-xs tracking-wide text-muted-foreground uppercase">
                {item.label}
              </dt>
              <dd className="mt-1 font-heading text-2xl sm:text-3xl">{item.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <PortalGrid />
    </div>
  )
}
