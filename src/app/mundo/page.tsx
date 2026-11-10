import type { Metadata } from "next"
import localFont from "next/font/local"
import { Bitcount_Prop_Double_Ink } from "next/font/google"
import { MundoExperience } from "@/components/mundo/mundo-experience"

const bitcount = Bitcount_Prop_Double_Ink({
  subsets: ["latin"],
  weight: "700",
  variable: "--font-bitcount",
  display: "swap",
  adjustFontFallback: false,
})

const redaction = localFont({
  src: [
    { path: "./fonts/redaction-35-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/redaction-35-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-redaction",
  display: "swap",
  adjustFontFallback: false,
})

export const metadata: Metadata = {
  title: "Mundo",
  description:
    "Prehistoria del Archivo 3030: tierras baldías, colonias de bloques y la composición del suelo.",
}

export default function MundoPage() {
  return (
    <div className={`${bitcount.variable} ${redaction.variable} pixel-shell flex flex-1 flex-col`}>
      <MundoExperience />
    </div>
  )
}
