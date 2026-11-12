"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { scenes } from "@/data/varhegy"
import { BlurbPanel } from "./blurb-panel"
import { IsoStage } from "./iso-stage"
import { ModalShell } from "./modal-shell"
import { Timeline } from "./timeline"

export function VarhegyExperience() {
  const [index, setIndex] = useState(0)
  const scene = scenes[index]
  const warIndex = scenes.findIndex((item) => item.year === 2999)
  const isLast = index === scenes.length - 1
  const [omen, setOmen] = useState(false)

  function go(next: number, viaFire = false) {
    const target = Math.min(scenes.length - 1, Math.max(0, next))
    if (target >= warIndex && index < warIndex && !viaFire) return
    setIndex(target)
  }

  function tryNext() {
    if (scene.year === 2945) {
      setOmen(true)
      return
    }
    go(index + 1)
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
        if (event.key === "ArrowRight") tryNext()
        if (event.key === "ArrowLeft") go(index - 1)
      }}
    >
      <Timeline scenes={scenes} index={index} onSelect={go} />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <IsoStage scene={scene} onAdvance={() => go(index + 1, true)} />
        <BlurbPanel scene={scene} />
      </div>

      <div className="grid grid-cols-3 items-center">
        <Button variant="outline" onClick={() => go(index - 1)} disabled={index === 0} className="w-fit">
          <ChevronLeft />
          Anterior
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Momento <span className="font-mono">{index + 1}</span> de {scenes.length}
        </p>
        <div className="flex justify-end">
          {isLast ? null : (
            <Button variant="outline" onClick={tryNext}>
              Siguiente
              <ChevronRight />
            </Button>
          )}
        </div>
      </div>
      {omen && (
        <ModalShell label="El inicio del fin" onClose={() => setOmen(false)} className="max-w-md">
          <p className="pr-8 text-lg leading-relaxed">
            El inicio del fin esta marcado por los frios pasos de Lupine
          </p>
        </ModalShell>
      )}
    </div>
  )
}
