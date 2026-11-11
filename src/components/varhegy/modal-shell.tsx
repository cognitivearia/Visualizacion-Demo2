"use client"

import { useEffect, useRef } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/**
 * Marco de las vistas de zoom (lupa, calle, despiece...).
 * Se cierra con la X, con Escape o tocando fuera. Al abrirse enfoca el botón de cerrar.
 */
export function ModalShell({
  label,
  onClose,
  className,
  children,
}: {
  label: string
  onClose: () => void
  className?: string
  children: React.ReactNode
}) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeRef.current?.focus()
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={label}
      className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm motion-safe:animate-in motion-safe:fade-in motion-safe:duration-300"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        className={cn(
          "relative w-full rounded-2xl bg-card p-5 ring-1 ring-foreground/15 motion-safe:animate-in motion-safe:zoom-in-50 motion-safe:duration-500",
          className,
        )}
      >
        <Button
          ref={closeRef}
          variant="ghost"
          size="icon"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-3 top-3 z-10"
        >
          <X />
        </Button>
        {children}
      </div>
    </div>
  )
}
