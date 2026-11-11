import { mixHex } from "@/lib/palette"

/**
 * Piezas básicas del dibujo isométrico de Várhegy, compartidas por el escenario
 * y por las vistas de zoom.
 * - TW / TH: ancho y alto de una casilla (rombo 2:1, el estándar del pixel-art isométrico).
 * - UNIT: cuántos píxeles de alto vale "1" de altura de edificio.
 * Todo se dibuja con colores planos y bordes duros (crispEdges) para mantener el estilo pixel.
 */
export const TW = 64
export const TH = 32
export const UNIT = 14

export function project(col: number, row: number) {
  return { x: ((col - row) * TW) / 2, y: ((col + row) * TH) / 2 }
}

export function rhombus(x: number, y: number, scale = 1) {
  const hw = (TW / 2) * scale
  const hh = (TH / 2) * scale
  return `${x},${y - hh} ${x + hw},${y} ${x},${y + hh} ${x - hw},${y}`
}

type BlockProps = {
  x: number
  y: number
  /** Altura en unidades. */
  height: number
  /** Tamaño de la base respecto a la casilla (1 = casilla entera). */
  scale: number
  color: string
}

export function Block({ x, y, height, scale, color }: BlockProps) {
  const lift = height * UNIT
  const hw = (TW / 2) * scale
  const hh = (TH / 2) * scale
  const top = mixHex(color, "#ffffff", 0.2)
  const left = mixHex(color, "#000000", 0.25)
  const right = mixHex(color, "#000000", 0.45)

  return (
    <g shapeRendering="crispEdges">
      <polygon
        fill={left}
        points={`${x - hw},${y - lift} ${x},${y - lift + hh} ${x},${y + hh} ${x - hw},${y}`}
      />
      <polygon
        fill={right}
        points={`${x},${y - lift + hh} ${x + hw},${y - lift} ${x + hw},${y} ${x},${y + hh}`}
      />
      <polygon fill={top} points={rhombus(x, y - lift, scale)} />
    </g>
  )
}
