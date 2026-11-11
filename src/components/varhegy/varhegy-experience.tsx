"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { scenes } from "@/data/varhegy"
import { BlurbPanel } from "./blurb-panel"
import { IsoStage } from "./iso-stage"
import { Timeline } from "./timeline"

export function VarhegyExperience() {
  const [index, setIndex] = useState(0)
  const scene = scenes[index]

  function go(next: number) {
    setIndex(Math.min(scenes.length - 1, Math.max(0, next)))
  }

  return (
    <div
      className="flex flex-col gap-6"
      onKeyDown={(event) => {
        // No cambiar de momento con las flechas mientras hay una lupa abierta o un botón enfocado.
        if (
          event.target instanceof HTMLElement &&
          event.target.closest("[role='button'], [role='dialog']")
        )
          return
        if (event.key === "ArrowRight") go(index + 1)
        if (event.key === "ArrowLeft") go(index - 1)
      }}
    >
      <Timeline scenes={scenes} index={index} onSelect={go} />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <IsoStage scene={scene} onAdvance={() => go(index + 1)} />
        <BlurbPanel scene={scene} />
      </div>

      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => go(index - 1)} disabled={index === 0}>
          <ChevronLeft />
          Anterior
        </Button>
        <p className="text-sm text-muted-foreground">
          Momento <span className="font-mono">{index + 1}</span> de {scenes.length}
        </p>
        <Button
          variant="outline"
          onClick={() => go(index + 1)}
          disabled={index === scenes.length - 1}
        >
          Siguiente
          <ChevronRight />
        </Button>
      </div>
    </div>
  )
}
