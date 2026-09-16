import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>Archivo 3030 · censo de un universo cyberpunk / mecha.</p>
        <Link href="/datos" className="underline-offset-4 hover:text-foreground hover:underline">
          Fuentes del censo
        </Link>
      </div>
    </footer>
  )
}
