"use client"

import type { TooltipContentProps } from "recharts"

export function ChartTooltip({
  active,
  payload,
  label,
}: TooltipContentProps) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-lg bg-foreground px-3 py-2 text-xs text-background shadow-lg">
      {label ? <p className="mb-1 font-medium">{String(label)}</p> : null}
      <ul className="space-y-1">
        {payload.map((item) => (
          <li
            key={String(item.dataKey ?? item.name)}
            className="flex items-center gap-2"
          >
            <span
              className="size-2 rounded-full"
              style={{ background: item.color ?? item.fill }}
            />
            <span>{item.name}</span>
            <span className="ml-auto font-mono">
              {Array.isArray(item.value) ? item.value.join(", ") : item.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
