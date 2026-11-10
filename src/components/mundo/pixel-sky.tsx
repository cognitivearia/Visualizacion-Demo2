import type { CSSProperties } from "react"
import { mixHex, worldPalette } from "@/lib/palette"

const BLUE = "#4d8cff"
const PURPLE = "#c45cff"
const CLOUD = "#6b3cbc"
const NIGHT = "#120228"
const NIGHT_LIT = "#3a1468"

function unit(seed: number) {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453
  return value - Math.floor(value)
}

type Block = {
  body: [number, number]
  cap?: [number, number]
  roof?: string
  antenna?: string
}

const blocks: Block[] = [
  { body: [44, 52], cap: [28, 24], roof: BLUE },
  { body: [28, 96], antenna: BLUE },
  { body: [56, 40], cap: [36, 28] },
  { body: [24, 128], cap: [16, 32], antenna: PURPLE, roof: PURPLE },
  { body: [48, 68] },
  { body: [36, 88], cap: [22, 28], roof: BLUE },
  { body: [64, 44], cap: [40, 32] },
  { body: [20, 112], antenna: PURPLE },
  { body: [52, 60], cap: [32, 24], roof: PURPLE },
  { body: [32, 84] },
  { body: [40, 104], cap: [24, 36], antenna: BLUE, roof: BLUE },
  { body: [60, 48], cap: [44, 20] },
  { body: [28, 76], antenna: BLUE },
  { body: [46, 92], cap: [30, 24], roof: PURPLE },
]

function lights(width: number, height: number, seed: number) {
  const spots: { x: number; y: number; color: string; delay: number }[] = []
  const columns = Math.max(1, Math.floor((width - 8) / 10))
  for (let column = 0; column < columns; column += 1) {
    for (let y = 10; y < height - 8; y += 14) {
      if (unit(seed + column * 4 + y) < 0.38) continue
      spots.push({
        x: 6 + column * 10,
        y,
        color: unit(seed + y + column) > 0.5 ? BLUE : PURPLE,
        delay: Number((unit(seed * 3 + y) * 2.6).toFixed(2)),
      })
    }
  }
  return spots
}

const buildings = blocks.map((block, index) => ({
  ...block,
  bodyLights: lights(block.body[0], block.body[1], index + 2),
  capLights: block.cap ? lights(block.cap[0], block.cap[1], index + 50) : [],
}))

const puffs: [number, number, string][][] = [
  [
    [0, 16, CLOUD],
    [8, 16, CLOUD],
    [16, 16, "#7a48d0"],
    [24, 16, CLOUD],
    [32, 16, CLOUD],
    [40, 16, "#54289a"],
    [48, 16, CLOUD],
    [8, 8, CLOUD],
    [16, 8, BLUE],
    [24, 8, CLOUD],
    [32, 8, CLOUD],
    [40, 8, PURPLE],
    [24, 0, CLOUD],
  ],
  [
    [0, 16, "#54289a"],
    [8, 16, CLOUD],
    [16, 16, CLOUD],
    [24, 16, CLOUD],
    [32, 16, "#7a48d0"],
    [8, 8, PURPLE],
    [16, 8, CLOUD],
    [24, 8, BLUE],
    [16, 0, CLOUD],
  ],
  [
    [0, 8, CLOUD],
    [8, 8, CLOUD],
    [16, 8, CLOUD],
    [24, 8, "#7a48d0"],
    [32, 8, CLOUD],
    [40, 8, CLOUD],
    [8, 0, CLOUD],
    [16, 0, BLUE],
    [24, 0, CLOUD],
    [32, 0, PURPLE],
    [16, 16, "#54289a"],
    [24, 16, CLOUD],
  ],
]

const lanes = [
  { top: "18%", duration: "48s", shapes: [0, 1, 2, 0, 1] },
  { top: "76%", duration: "40s", shapes: [2, 0, 1, 2, 0] },
]

type SkyMode = "desert" | "city" | "rise" | "ruin" | "mono"

function skyMode(year: number): SkyMode {
  if (year <= 2568) return "desert"
  if (year <= 2730) return "city"
  if (year <= 2945) return "rise"
  if (year <= 2999) return "ruin"
  return "mono"
}

function tone(color: string, mode: SkyMode, colors: readonly string[] | null) {
  if (colors && (mode === "desert" || mode === "city" || mode === "rise")) {
    if (color === BLUE) return colors[1]
    if (color === PURPLE) return colors[3]
    if (color === CLOUD || color === "#7a48d0") return colors[0]
    if (color === "#54289a") return colors[4]
    return colors[2]
  }
  if (mode === "mono") {
    if (color === BLUE || color === PURPLE) return "#d4d0d8"
    return "#6e6a76"
  }
  if (mode === "desert") {
    if (color === BLUE) return "#8fbf45"
    if (color === PURPLE) return "#d2b56a"
    return "#4e7a30"
  }
  if (mode === "ruin") return "#3a2430"
  return color
}

function skyBackground(year: number, colors: readonly string[]) {
  if (year <= 2568) return colors[2]
  if (year <= 2730) return mixHex("#000000", colors[0], 0.34)
  return mixHex("#000000", colors[4], 0.46)
}

const rise = Array.from({ length: 26 }, (_, index) => {
  const roll = unit(index + 7)
  const width = [14, 22, 36, 18, 58, 28, 12, 44, 20, 70, 16, 32][index % 12]
  return {
    width,
    height: Math.round(40 + roll * 440),
    cap: roll > 0.42 ? Math.max(10, Math.round(width * 0.66)) : 0,
    capH: 18 + Math.round(unit(index + 19) * 54),
    antenna: roll > 0.74,
    roof: roll > 0.58 ? (roll > 0.8 ? PURPLE : BLUE) : "",
  }
})

const plants = Array.from({ length: 18 }, (_, index) => {
  const roll = unit(index + 5)
  const kind = roll > 0.62 ? "cactus" : roll > 0.28 ? "bush" : "tuft"
  return {
    kind,
    height: kind === "cactus" ? 36 + Math.round(unit(index + 13) * 70) : 14 + Math.round(roll * 28),
    arm: unit(index + 2) > 0.45,
  }
})

const motes = Array.from({ length: 22 }, (_, index) => {
  const roll = unit(index + 40)
  return {
    left: `${(roll * 100).toFixed(2)}%`,
    top: `${(18 + unit(index + 80) * 58).toFixed(2)}%`,
    size: roll > 0.75 ? 4 : 2,
    color: roll > 0.62 ? BLUE : roll > 0.3 ? PURPLE : "#d7c4ff",
    delay: `${(unit(index + 120) * 3).toFixed(2)}s`,
    duration: `${(2.4 + unit(index + 160) * 2.2).toFixed(2)}s`,
  }
})

function Cloud({ shape, mode, colors }: { shape: number; mode: SkyMode; colors: readonly string[] | null }) {
  return (
    <span className="pixel-cloud">
      {puffs[shape].map(([x, y, color], index) => {
        const paint = tone(color, mode, colors)
        return (
          <i
            key={`${shape}-${x}-${y}-${index}`}
            className={color === BLUE || color === PURPLE ? "pixel-window" : undefined}
            style={{ left: x, top: y, background: paint }}
          />
        )
      })}
    </span>
  )
}

function Windows({ spots }: { spots: { x: number; y: number; color: string; delay: number }[] }) {
  return spots.map((spot) => (
    <i
      key={`${spot.x}-${spot.y}`}
      className="pixel-window"
      style={{
        left: spot.x,
        top: spot.y,
        background: spot.color,
        animationDelay: `${spot.delay}s`,
      }}
    />
  ))
}

function DesertScrub() {
  return (
    <div className="pixel-skyline">
      {plants.map((plant, index) =>
        plant.kind === "cactus" ? (
          <span key={index} className="pixel-cactus" style={{ height: plant.height }}>
            {plant.arm ? <i className="pixel-cactus-arm" /> : null}
          </span>
        ) : (
          <span
            key={index}
            className={plant.kind === "bush" ? "pixel-bush" : "pixel-tuft"}
            style={{ height: plant.height, width: plant.kind === "bush" ? 28 : 10 }}
          />
        ),
      )}
    </div>
  )
}

function SkyBuildings({ mode, colors }: { mode: Exclude<SkyMode, "desert">; colors: readonly string[] | null }) {
  const mono = mode === "mono"
  const ruined = mode === "ruin"
  const risen = mode === "rise" || ruined
  const themed = Boolean(colors) && (mode === "city" || mode === "rise")
  const bodyColor = themed && colors ? mixHex("#000000", colors[0], 0.62) : mono ? "#3a3a42" : ruined ? "#241016" : NIGHT
  const capColor = themed && colors ? colors[2] : mono ? "#5a5862" : ruined ? "#3a201c" : NIGHT_LIT
  const columns = risen
    ? rise.map((block, index) => {
        const left = ruined ? Math.max(18, Math.round(block.height * (0.2 + unit(index + 3) * 0.48))) : block.height
        return {
          width: block.width,
          height: left,
          cap: block.cap,
          capH: block.capH,
          antenna: block.antenna && !ruined,
          antennaColor: themed && colors ? colors[1] : BLUE,
          roof: ruined || mono ? "" : themed && colors ? (block.roof ? colors[4] : "") : block.roof,
        }
      })
    : buildings.map((building) => ({
        width: building.body[0],
        height: building.body[1],
        cap: building.cap ? building.cap[0] : 0,
        capH: building.cap ? building.cap[1] : 0,
        antenna: Boolean(building.antenna) && !mono,
        antennaColor: themed && colors ? colors[1] : (building.antenna ?? BLUE),
        roof: mono ? "" : themed && colors ? (building.roof ? colors[4] : "") : (building.roof ?? ""),
      }))

  return (
    <div className="pixel-skyline">
      {columns.map((block, index) => {
        const paintLight = (color: string) =>
          themed && colors ? (color === BLUE ? colors[1] : colors[3]) : ruined ? "#6a3040" : mono ? "#d4d0d8" : color
        const bodyLights = lights(block.width, block.height, index + 2).map((spot) => ({
          ...spot,
          color: paintLight(spot.color),
        }))
        const capLights = block.cap
          ? lights(block.cap, block.capH, index + 50).map((spot) => ({
              ...spot,
              color: paintLight(spot.color),
            }))
          : []
        const antennaColor = block.antennaColor
        return (
          <span key={index} className="pixel-build">
            {block.antenna && !ruined ? (
              <span className="pixel-antenna">
                <i style={{ background: mono ? "#d4d0d8" : antennaColor, animationDelay: `${index * 0.2}s` }} />
              </span>
            ) : null}
            {block.cap ? (
              <span
                className="pixel-slab"
                style={{
                  width: block.cap,
                  height: ruined ? Math.max(8, Math.round(block.capH * 0.45)) : block.capH,
                  marginLeft: ruined ? 8 : 0,
                  background: capColor,
                }}
              >
                {block.roof ? (
                  <i className="pixel-roof" style={{ background: mono ? "#8e8a96" : block.roof }} />
                ) : null}
                <Windows spots={capLights} />
              </span>
            ) : null}
            <span className="pixel-slab" style={{ width: block.width, height: block.height, background: bodyColor }}>
              {!block.cap && block.roof ? (
                <i className="pixel-roof" style={{ background: mono ? "#8e8a96" : block.roof }} />
              ) : null}
              <Windows spots={bodyLights} />
              {ruined ? <i className="pixel-rubble" /> : null}
            </span>
          </span>
        )
      })}
    </div>
  )
}

export function PixelSky({ year }: { year: number }) {
  const mode = skyMode(year)
  const colors = worldPalette(year)
  const paletteStyle = colors
    ? ({
        background: skyBackground(year, colors),
        "--plant": colors[4],
        "--plant-dark": colors[2],
        "--plant-sand": colors[0],
        "--plant-mist": colors[1],
        "--plant-ink": colors[3],
      } as CSSProperties)
    : undefined

  return (
    <div
      className={mode === "mono" ? "pixel-sky pixel-sky-mono" : "pixel-sky"}
      data-sky={mode}
      data-palette={colors ? String(year) : undefined}
      style={paletteStyle}
      aria-hidden
    >
      {motes.map((mote) => (
        <span
          key={`${mote.left}-${mote.top}`}
          className="pixel-mote"
          style={{
            left: mote.left,
            top: mote.top,
            width: mote.size,
            height: mote.size,
            background: tone(mote.color, mode, colors),
            animationDelay: mote.delay,
            animationDuration: mote.duration,
          }}
        />
      ))}
      {lanes.map((lane) => (
        <div key={lane.top} className="pixel-lane" style={{ top: lane.top, animationDuration: lane.duration }}>
          {[0, 1].map((copy) => (
            <div key={copy} className="pixel-lane-set">
              {lane.shapes.map((shape, index) => (
                <Cloud key={`${copy}-${index}`} shape={shape} mode={mode} colors={colors} />
              ))}
            </div>
          ))}
        </div>
      ))}
      {mode === "desert" ? <DesertScrub /> : <SkyBuildings mode={mode} colors={colors} />}
    </div>
  )
}
