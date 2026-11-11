import { cn } from "@/lib/utils"
import type { Scene } from "@/data/varhegy"

type TimelineProps = {
  scenes: Scene[]
  index: number
  onSelect: (index: number) => void
}

/** Línea de tiempo con un tick por momento. Cada tick es un botón. */
export function Timeline({ scenes, index, onSelect }: TimelineProps) {
  const progress = (index / (scenes.length - 1)) * 100

  return (
    <nav aria-label="Línea de tiempo de Várhegy" className="px-8 sm:px-10">
      <div className="relative">
        <div className="absolute inset-x-0 top-[9px] h-0.5 bg-border" aria-hidden />
        <div
          className="absolute left-0 top-[9px] h-0.5 bg-primary transition-[width] duration-500 motion-reduce:transition-none"
          style={{ width: `${progress}%` }}
          aria-hidden
        />
        <ol className="relative flex justify-between">
          {scenes.map((scene, i) => {
            const active = i === index
            const passed = i <= index
            return (
              <li key={scene.id} className="flex w-0 justify-center">
                <button
                  type="button"
                  onClick={() => onSelect(i)}
                  aria-current={active ? "step" : undefined}
                  className="group flex w-24 flex-col items-center gap-1.5 rounded-md px-1 pb-1 outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-32"
                >
                  <span
                    className={cn(
                      "block size-5 rotate-45 border-2 transition-colors motion-reduce:transition-none",
                      passed
                        ? "border-primary bg-primary"
                        : "border-border bg-background group-hover:border-primary",
                      active && "ring-4 ring-primary/30",
                    )}
                    aria-hidden
                  />
                  <span
                    className={cn(
                      "font-mono text-sm tabular-nums",
                      active ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {scene.year}
                  </span>
                  <span
                    className={cn(
                      "hidden text-center text-xs leading-tight sm:block",
                      active ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    {scene.short}
                  </span>
                </button>
              </li>
            )
          })}
        </ol>
      </div>
    </nav>
  )
}
