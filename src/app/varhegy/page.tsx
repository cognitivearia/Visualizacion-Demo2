import type { Metadata } from "next"
import { VarhegyExperience } from "@/components/varhegy/varhegy-experience"

export const metadata: Metadata = {
  title: "Várhegy",
  description:
    "La historia de Várhegy, capital de Karpatenland, en cinco momentos: de la prehistoria al estado totalitario de 3030.",
}

export default function VarhegyPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10">
      <header className="max-w-3xl space-y-3">
        <p className="font-heading text-xs tracking-widest text-primary">
          Capital de Karpatenland
        </p>
        <h1 className="text-4xl sm:text-5xl">Várhegy</h1>
        <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
          Cinco momentos de una ciudad que se opuso. Recorre la línea de tiempo y toca
          la zona resaltada de cada escena.
        </p>
      </header>

      <VarhegyExperience />
    </div>
  )
}
