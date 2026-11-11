import { mixHex } from "@/lib/palette"
import { TH, TW, UNIT, rhombus } from "./iso-primitives"

/**
 * Kit pequeño de Várhegy. Las mismas piezas se reutilizan en las 5 escenas;
 * cada momento solo les cambia el color.
 * Alturas en "unidades" (1 unidad = UNIT píxeles), iguales a las de los edificios.
 */

/** Alto total de LUPINE, para que el encuadre no lo corte. */
export const LUPINE_HEIGHT = 10.8
export const HUT_HEIGHT = 1.6
export const FIRE_HEIGHT = 2.4
export const RUBBLE_HEIGHT = 0.9

const VISOR = "#ff4f8b"

type VolumeProps = {
  x: number
  y: number
  height: number
  scale: number
  color: string
  children?: React.ReactNode
}

function facePoint(
  x: number,
  y: number,
  hw: number,
  hh: number,
  lift: number,
  side: "left" | "right",
  u: number,
  t: number,
) {
  if (side === "left") {
    return `${Math.round(x - hw + u * hw)},${Math.round(y + u * hh - t * lift)}`
  }
  return `${Math.round(x + u * hw)},${Math.round(y + hh - u * hh - t * lift)}`
}

function faceQuad(
  x: number,
  y: number,
  hw: number,
  hh: number,
  lift: number,
  side: "left" | "right",
  u0: number,
  u1: number,
  t0: number,
  t1: number,
) {
  return [
    facePoint(x, y, hw, hh, lift, side, u0, t0),
    facePoint(x, y, hw, hh, lift, side, u1, t0),
    facePoint(x, y, hw, hh, lift, side, u1, t1),
    facePoint(x, y, hw, hh, lift, side, u0, t1),
  ].join(" ")
}

/** Caja isométrica. Lo que va en children se dibuja sobre las caras y debajo del techo. */
function Volume({ x, y, height, scale, color, children }: VolumeProps) {
  const lift = height * UNIT
  const hw = (TW / 2) * scale
  const hh = (TH / 2) * scale
  const top = mixHex(color, "#ffffff", 0.22)
  const left = mixHex(color, "#000000", 0.22)
  const right = mixHex(color, "#000000", 0.42)

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
      {children}
      <polygon fill={top} points={rhombus(x, y - lift, scale)} />
    </g>
  )
}

function isLit(floor: number, seed: number, lit: number) {
  return (floor * 17 + seed * 13) % 100 < lit * 100
}

export function Building({
  x,
  y,
  floors,
  color,
  glow,
  lit = 0.65,
  seed = 0,
}: {
  x: number
  y: number
  floors: number
  color: string
  /** Color de las ventanas encendidas. */
  glow: string
  /** Fracción de ventanas encendidas (0 a 1). */
  lit?: number
  seed?: number
}) {
  const scale = 0.92
  const lift = floors * UNIT
  const hw = (TW / 2) * scale
  const hh = (TH / 2) * scale
  const dark = mixHex(color, "#000000", 0.55)
  const windows: React.ReactNode[] = []

  for (let floor = 0; floor < floors; floor += 1) {
    const t0 = (floor + 0.3) / floors
    const t1 = (floor + 0.72) / floors
    const fill = isLit(floor, seed, lit) ? glow : dark
    windows.push(
      <polygon
        key={`l-${floor}`}
        points={faceQuad(x, y, hw, hh, lift, "left", 0.32, 0.68, t0, t1)}
        fill={fill}
      />,
    )
    if (floor > 0) {
      windows.push(
        <polygon
          key={`r-${floor}`}
          points={faceQuad(x, y, hw, hh, lift, "right", 0.32, 0.68, t0, t1)}
          fill={fill}
        />,
      )
    }
  }

  return (
    <g>
      <Volume x={x} y={y} height={floors} scale={scale} color={color}>
        {windows}
        <polygon
          points={faceQuad(x, y, hw, hh, lift, "right", 0.38, 0.62, 0, Math.min(0.62, 0.7 / floors))}
          fill={mixHex(color, "#000000", 0.62)}
        />
      </Volume>
      {floors >= 5 && (
        <g shapeRendering="crispEdges">
          <rect x={x - 1} y={y - lift - 12} width={2} height={12} fill={dark} />
          <rect x={x - 4} y={y - lift - 14} width={8} height={2} fill={glow} />
        </g>
      )}
    </g>
  )
}

export function Hut({ x, y, color }: { x: number; y: number; color: string }) {
  const wall = 0.5
  const lift = wall * UNIT
  const hw = (TW / 2) * 0.62
  const hh = (TH / 2) * 0.62
  const thatch = mixHex(color, "#e6c56e", 0.4)
  const thatchShade = mixHex(color, "#000000", 0.28)
  const peak = `${x},${Math.round(y - lift - 0.95 * UNIT)}`
  const sw = `${Math.round(x - hw)},${Math.round(y - lift)}`
  const se = `${x},${Math.round(y - lift + hh)}`
  const ne = `${Math.round(x + hw)},${Math.round(y - lift)}`
  const nw = `${x},${Math.round(y - lift - hh)}`

  return (
    <g>
      <Volume x={x} y={y} height={wall} scale={0.46} color={mixHex(color, "#3a2414", 0.2)} />
      <g shapeRendering="crispEdges">
        <polygon points={`${nw} ${ne} ${peak}`} fill={thatchShade} />
        <polygon points={`${sw} ${nw} ${peak}`} fill={thatch} />
        <polygon points={`${sw} ${se} ${peak}`} fill={thatchShade} />
        <polygon points={`${se} ${ne} ${peak}`} fill={thatch} />
      </g>
    </g>
  )
}

export function Rubble({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <g>
      <Volume x={x - 7} y={y + 2} height={0.4} scale={0.4} color={color} />
      <Volume x={x + 8} y={y - 1} height={0.65} scale={0.32} color={mixHex(color, "#000000", 0.18)} />
    </g>
  )
}

export function Fire({ x, y, color }: { x: number; y: number; color: string }) {
  const hot = mixHex(color, "#fff6c2", 0.55)
  const low = mixHex(color, "#6b140c", 0.45)
  // Cada entrada es [dx, dy, ancho, alto, color]. dy es hacia arriba.
  const pixels: Array<[number, number, number, number, string]> = [
    [-8, 8, 4, 6, low],
    [-4, 16, 4, 14, color],
    [0, 26, 4, 24, hot],
    [4, 18, 4, 14, color],
    [8, 10, 4, 8, low],
    [-2, 30, 4, 8, hot],
    [2, 22, 4, 6, color],
  ]
  return (
    <g className="fire-flicker" shapeRendering="crispEdges">
      {pixels.map(([dx, dy, w, h, fill], index) => (
        <rect key={index} x={x + dx} y={y - dy} width={w} height={h} fill={fill} />
      ))}
    </g>
  )
}

export function LupineSprite({ x, y, color }: { x: number; y: number; color: string }) {
  const dark = mixHex(color, "#000000", 0.38)
  const light = mixHex(color, "#ffffff", 0.16)
  const leg = 3.3
  const torso = 4
  const shoulder = 1.3
  const head = 2.2
  const torsoBase = y - leg * UNIT
  const shoulderBase = torsoBase - torso * UNIT
  const headBase = shoulderBase - shoulder * UNIT

  const headHw = (TW / 2) * 0.3
  const headHh = (TH / 2) * 0.3
  const headLift = head * UNIT

  return (
    <g>
      <Volume x={x - 9} y={y} height={leg} scale={0.2} color={dark} />
      <Volume x={x + 9} y={y} height={leg} scale={0.2} color={color} />
      <Volume x={x} y={torsoBase} height={torso} scale={0.4} color={color}>
        <polygon
          points={faceQuad(x, torsoBase, (TW / 2) * 0.4, (TH / 2) * 0.4, torso * UNIT, "right", 0.3, 0.7, 0.55, 0.82)}
          fill={VISOR}
        />
      </Volume>
      <Volume x={x} y={shoulderBase} height={shoulder} scale={0.72} color={light} />
      <Volume x={x - 22} y={shoulderBase + 2.2 * UNIT} height={2.5} scale={0.16} color={dark} />
      <Volume x={x + 22} y={shoulderBase + 2.2 * UNIT} height={2.5} scale={0.16} color={dark} />
      <g shapeRendering="crispEdges">
        <rect x={x + 30} y={shoulderBase + 2.2 * UNIT - 10} width={22} height={4} fill="#14161f" />
        <rect x={x + 50} y={shoulderBase + 2.2 * UNIT - 12} width={4} height={8} fill="#3a3e52" />
      </g>
      <Volume x={x} y={headBase} height={head} scale={0.3} color={light}>
        <polygon
          points={faceQuad(x, headBase, headHw, headHh, headLift, "left", 0.2, 0.8, 0.38, 0.58)}
          fill={VISOR}
        />
        <polygon
          points={faceQuad(x, headBase, headHw, headHh, headLift, "right", 0.2, 0.8, 0.38, 0.58)}
          fill={VISOR}
        />
      </Volume>
    </g>
  )
}

export function Tuft({
  x,
  y,
  color,
  kind,
}: {
  x: number
  y: number
  color: string
  kind: "grass" | "pebble"
}) {
  if (kind === "pebble") {
    return (
      <g shapeRendering="crispEdges">
        <rect x={x - 4} y={y - 3} width={5} height={3} fill={mixHex(color, "#000000", 0.25)} />
        <rect x={x + 2} y={y - 2} width={3} height={2} fill={mixHex(color, "#ffffff", 0.15)} />
      </g>
    )
  }
  const blade = mixHex(color, "#d6f07a", 0.65)
  const tip = mixHex(color, "#f4f0b0", 0.8)
  return (
    <g shapeRendering="crispEdges">
      <rect x={x - 7} y={y - 7} width={4} height={6} fill={blade} />
      <rect x={x - 2} y={y - 12} width={4} height={11} fill={tip} />
      <rect x={x + 3} y={y - 8} width={4} height={7} fill={blade} />
    </g>
  )
}

export function RoadMark({ x, y }: { x: number; y: number }) {
  return (
    <polygon
      points={rhombus(x, y, 0.16)}
      fill="#e8e2d4"
      fillOpacity={0.55}
      shapeRendering="crispEdges"
    />
  )
}
