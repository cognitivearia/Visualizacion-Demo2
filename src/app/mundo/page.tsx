import type { Metadata } from "next"
import { Silkscreen } from "next/font/google"
import { MundoExperience } from "@/components/mundo/mundo-experience"

const pixel = Silkscreen({
  subsets: ["latin"],
  weight: ["400", "700"],
})

export const metadata: Metadata = {
  title: "Mundo",
  description:
    "Prehistoria del Archivo 3030: tierras baldías, colonias de bloques y la composición del suelo.",
}

export default function MundoPage() {
  return (
    <div className={`${pixel.className} pixel-shell flex flex-1 flex-col`}>
      <MundoExperience />
    </div>
  )
}
