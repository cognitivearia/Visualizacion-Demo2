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
        <div className="flex flex-wrap items-baseline gap-x-4">
          <h1 className="text-4xl sm:text-5xl">Várhegy</h1>
          <p className="font-heading text-xs tracking-widest text-primary">
            Capital de Karpatenland
          </p>
        </div>
        <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
          La historia de nuestra civilización esta escrita en los suelos de Várhegy, permiteme
          enseñarte a leerla. -El biólogo
        </p>
      </header>

      <VarhegyExperience />
    </div>
  )
}
