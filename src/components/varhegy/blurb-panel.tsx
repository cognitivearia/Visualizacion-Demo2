import { Badge } from "@/components/ui/badge"
import type { Scene } from "@/data/varhegy"

/** Blurb informativo: texto fijo por momento + cifras de contexto. */
export function BlurbPanel({ scene }: { scene: Scene }) {
  return (
    <article
      key={scene.id}
      aria-live="polite"
      className="flex h-full flex-col gap-5 rounded-xl bg-card/80 p-5 ring-1 ring-foreground/10 motion-safe:animate-in motion-safe:fade-in motion-safe:duration-500 sm:p-6"
    >
      <header className="space-y-2">
        <Badge variant="outline" className="font-mono">
          {scene.year}
        </Badge>
        <h2 className="text-2xl sm:text-3xl">{scene.title}</h2>
      </header>

      <p className="text-base leading-relaxed text-muted-foreground">{scene.blurb}</p>

      <dl className="grid grid-cols-3 gap-2">
        {scene.stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg bg-background/60 px-3 py-2 ring-1 ring-foreground/10"
          >
            <dt className="text-xs text-muted-foreground">{stat.label}</dt>
            <dd className="font-mono text-sm tabular-nums sm:text-base">{stat.value}</dd>
          </div>
        ))}
      </dl>

      {scene.split && (
        <section className="space-y-2">
          <h3 className="font-heading text-xs tracking-wider text-muted-foreground">
            {scene.split.title}
          </h3>
          <div
            className="flex h-3 overflow-hidden rounded-full"
            role="img"
            aria-label={scene.split.parts
              .map((part) => `${part.name} ${part.value} por ciento`)
              .join(", ")}
          >
            {scene.split.parts.map((part) => (
              <div
                key={part.name}
                style={{ width: `${part.value}%`, backgroundColor: part.color }}
              />
            ))}
          </div>
          <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
            {scene.split.parts.map((part) => (
              <li key={part.name} className="flex items-center gap-2">
                <span
                  className="size-2.5 rounded-sm"
                  style={{ backgroundColor: part.color }}
                  aria-hidden
                />
                {part.name}{" "}
                <span className="font-mono tabular-nums text-muted-foreground">
                  {part.value.toLocaleString("es-ES")} %
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  )
}
