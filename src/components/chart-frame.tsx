import { cn } from "@/lib/utils"

export function ChartFrame({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl bg-card/80 ring-1 ring-foreground/10",
        className,
      )}
    >
      {children}
    </div>
  )
}

export function ChartCanvas({ children }: { children: React.ReactNode }) {
  return <div className="h-[320px] w-full md:h-[420px]">{children}</div>
}

export function ChartEmpty({ message }: { message: string }) {
  return (
    <div className="grid h-[320px] place-items-center px-6 text-center text-sm text-muted-foreground md:h-[420px]">
      {message}
    </div>
  )
}

export function ChartSkeleton() {
  return (
    <div className="flex h-[320px] items-end gap-2 px-6 pb-8 md:h-[420px]">
      {Array.from({ length: 12 }).map((_, index) => (
        <div
          key={index}
          className="flex-1 rounded-t-md bg-muted"
          style={{ height: `${30 + ((index * 17) % 60)}%` }}
        />
      ))}
    </div>
  )
}
