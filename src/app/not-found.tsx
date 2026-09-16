import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-4 py-20 text-center">
      <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">404</p>
      <h1 className="mt-2 text-4xl">Ese gráfico no está en el portal</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Puede que el enlace esté mal o que esa vista todavía no exista. Vuelve al listado y elige otra.
      </p>
      <div className="mt-6">
        <Link href="/" className={buttonVariants()}>
          Ir al archivo
        </Link>
      </div>
    </div>
  )
}
