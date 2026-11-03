import type { Metadata } from "next"
import { WorldShell } from "@/components/mundo/world-shell"

export const metadata: Metadata = {
  title: "Mundo",
  description:
    "Prehistoria del Archivo 3030: tierras baldías, colonias de bloques y la composición del suelo.",
}

export default function MundoPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-6 sm:px-6 sm:py-8">
      <WorldShell />
    </div>
  )
}
