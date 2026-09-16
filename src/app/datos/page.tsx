import type { Metadata } from "next"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { csvFiles } from "@/data/world"

export const metadata: Metadata = {
  title: "Fuentes",
  description: "Tablas de población y territorio del Archivo 3030.",
}

export default function DatosPage() {
  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
      <p className="text-xs tracking-[0.22em] text-muted-foreground uppercase">
        Fuente
      </p>
      <h1 className="mt-2 text-4xl sm:text-5xl">Los tres CSV ya están cargados.</h1>
      <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
        Oroszlan y Polip, las cinco regiones y los trece países de 2730 salen de tus archivos.
        Si más adelante cambias una tabla, sustituye el CSV en la carpeta de datos o mándalo otra vez.
      </p>

      <section className="mt-10 space-y-4">
        <h2 className="text-2xl">Archivos</h2>
        <ul className="space-y-3">
          {csvFiles.map((item) => (
            <li key={item.path} className="rounded-lg bg-card p-4 ring-1 ring-foreground/10">
              <p className="font-mono text-sm text-primary">{item.file}</p>
              <p className="mt-1 text-sm text-muted-foreground">{item.use}</p>
              <p className="mt-1 font-mono text-xs text-muted-foreground">{item.path}</p>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-10">
        <Link href="/" className={buttonVariants()}>
          Volver al archivo
        </Link>
      </div>
    </div>
  )
}
