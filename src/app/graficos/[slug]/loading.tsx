import { ChartSkeleton } from "@/components/chart-frame"

export default function LoadingGrafico() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-6 h-4 w-24 rounded bg-muted" />
      <div className="mb-3 h-10 w-2/3 rounded bg-muted" />
      <div className="mb-8 h-16 w-full max-w-2xl rounded bg-muted" />
      <ChartSkeleton />
    </div>
  )
}
