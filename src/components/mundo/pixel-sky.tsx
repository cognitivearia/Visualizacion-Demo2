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

function Cloud({ shape }: { shape: number }) {
  return (
    <span className="pixel-cloud">
      {puffs[shape].map(([x, y, color], index) => (
        <i
          key={`${shape}-${x}-${y}-${index}`}
          className={color === BLUE || color === PURPLE ? "pixel-window" : undefined}
          style={{ left: x, top: y, background: color }}
        />
      ))}
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

export function PixelSky() {
  return (
    <div className="pixel-sky" aria-hidden>
      {motes.map((mote) => (
        <span
          key={`${mote.left}-${mote.top}`}
          className="pixel-mote"
          style={{
            left: mote.left,
            top: mote.top,
            width: mote.size,
            height: mote.size,
            background: mote.color,
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
                <Cloud key={`${copy}-${index}`} shape={shape} />
              ))}
            </div>
          ))}
        </div>
      ))}
      <div className="pixel-skyline">
        {buildings.map((building, index) => (
          <span key={index} className="pixel-build">
            {building.antenna ? (
              <span className="pixel-antenna">
                <i style={{ background: building.antenna, animationDelay: `${index * 0.2}s` }} />
              </span>
            ) : null}
            {building.cap ? (
              <span
                className="pixel-slab"
                style={{ width: building.cap[0], height: building.cap[1], background: NIGHT_LIT }}
              >
                {building.roof ? <i className="pixel-roof" style={{ background: building.roof }} /> : null}
                <Windows spots={building.capLights} />
              </span>
            ) : null}
            <span className="pixel-slab" style={{ width: building.body[0], height: building.body[1], background: NIGHT }}>
              {!building.cap && building.roof ? (
                <i className="pixel-roof" style={{ background: building.roof }} />
              ) : null}
              <Windows spots={building.bodyLights} />
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}
