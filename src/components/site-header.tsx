import Link from "next/link"
import { project } from "@/data/catalog"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid size-8 place-items-center rounded-md bg-primary text-primary-foreground">
            <span className="font-heading text-[11px] leading-none">30</span>
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-medium tracking-wide">
              {project.name}
            </span>
            <span className="block text-xs text-muted-foreground">
              {project.line}
            </span>
          </span>
        </Link>
      </div>
    </header>
  )
}
