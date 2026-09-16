import { countries2730, occupation3030, populationTrend } from "@/data/world"
import { palette, regionColors } from "@/lib/palette"
import { toMillions } from "@/lib/format"
import type { VizSlug } from "@/data/catalog"

function sparkPoints(values: number[], width = 160, height = 48) {
  const max = Math.max(...values)
  const min = Math.min(...values)
  return values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * width
      const y = height - ((value - min) / (max - min || 1)) * (height - 6) - 3
      return `${x},${y}`
    })
    .join(" ")
}

export function MiniChart({ slug }: { slug: VizSlug }) {
  if (slug === "mapa") {
    return (
      <svg viewBox="0 0 160 48" className="h-14 w-full" aria-hidden>
        <path d="M 6 18 C 18 6 34 10 40 20 C 46 30 28 40 16 36 C 8 34 2 26 6 18 Z" fill={palette.blue} opacity="0.9" />
        <path d="M 48 8 C 70 2 92 8 98 22 C 104 36 86 42 70 38 C 54 34 42 22 48 8 Z" fill={palette.purple} opacity="0.9" />
        <path d="M 102 6 C 118 2 136 10 140 20 C 144 30 128 34 116 28 C 104 22 96 12 102 6 Z" fill={palette.green} opacity="0.85" />
        <path d="M 56 28 C 84 24 118 22 148 30 C 156 34 150 44 122 46 C 94 48 60 44 56 36 Z" fill="#d08cff" opacity="0.85" />
        <path d="M 70 4 C 90 0 110 4 118 10 C 108 8 88 8 74 12 Z" fill="#7aa2ff" opacity="0.9" />
      </svg>
    )
  }

  if (slug === "tendencia") {
    const values = populationTrend.map((row) => toMillions(row.total))
    return (
      <svg viewBox="0 0 160 48" className="h-14 w-full" aria-hidden>
        <polyline
          fill="none"
          stroke={palette.green}
          strokeWidth="2.2"
          strokeLinejoin="round"
          strokeLinecap="round"
          points={sparkPoints(values)}
          className="spark-line"
        />
      </svg>
    )
  }

  if (slug === "territorio") {
    const total = occupation3030.reduce((sum, row) => sum + row.ocupacion, 0)
    const radius = 18
    const circ = 2 * Math.PI * radius
    const slices = occupation3030.map((row, index) => {
      const length = (row.ocupacion / total) * circ
      const offset = occupation3030
        .slice(0, index)
        .reduce((sum, item) => sum + (item.ocupacion / total) * circ, 0)
      return { row, length, offset }
    })
    return (
      <svg viewBox="0 0 64 64" className="mx-auto h-14 w-14" aria-hidden>
        {slices.map(({ row, length, offset }) => (
          <circle
            key={row.nacion}
            cx="32"
            cy="32"
            r={radius}
            fill="none"
            stroke={
              row.nacion === "Oroszlan"
                ? palette.blue
                : row.nacion === "Polip"
                  ? palette.purple
                  : palette.green
            }
            strokeWidth="10"
            strokeDasharray={`${length} ${circ - length}`}
            strokeDashoffset={-offset}
            transform="rotate(-90 32 32)"
          />
        ))}
      </svg>
    )
  }

  if (slug === "censo2730") {
    return (
      <div className="flex h-14 flex-col justify-center gap-1" aria-hidden>
        {countries2730.slice(0, 6).map((row) => (
          <div key={row.pais} className="flex h-1.5 overflow-hidden rounded-full">
            <div className="h-full" style={{ width: `${row.pctOroszlan}%`, background: palette.blue }} />
            <div className="h-full" style={{ width: `${row.pctPolip}%`, background: palette.purple }} />
          </div>
        ))}
      </div>
    )
  }

  const before = populationTrend.find((row) => row.anio === 2730)
  const now = populationTrend.find((row) => row.anio === 3030)
  const max = Math.max(
    toMillions(before?.Dunántúl ?? 1),
    toMillions(now?.Dunántúl ?? 1),
  )
  const pairs = [
    ["Dunántúl", before?.Dunántúl ?? 0, now?.Dunántúl ?? 0],
    ["Nagy-Alföld", before?.["Nagy-Alföld"] ?? 0, now?.["Nagy-Alföld"] ?? 0],
    ["Karpatenland", before?.Karpatenland ?? 0, now?.Karpatenland ?? 0],
    ["Ostseeküste", before?.Ostseeküste ?? 0, now?.Ostseeküste ?? 0],
    ["Alpenvorland", before?.Alpenvorland ?? 0, now?.Alpenvorland ?? 0],
  ] as const

  return (
    <div className="flex h-14 items-end gap-2" aria-hidden>
      {pairs.map(([name, before, after], index) => (
        <div key={name} className="flex h-full flex-1 items-end gap-0.5">
          <div
            className="bar-rise w-full rounded-t-sm bg-primary/40"
            style={{
              height: `${Math.max(12, (toMillions(before) / max) * 100)}%`,
              animationDelay: `${index * 40}ms`,
            }}
          />
          <div
            className="bar-rise w-full rounded-t-sm"
            style={{
              height: `${Math.max(12, (toMillions(after) / max) * 100)}%`,
              background: regionColors[name],
              animationDelay: `${index * 40 + 80}ms`,
            }}
          />
        </div>
      ))}
    </div>
  )
}
