'use client'

import { METRICS } from '@/lib/data'
import { useCountUp } from '@/hooks/use-count-up'

function Metric({
  value,
  suffix,
  label,
}: {
  value: number
  suffix: string
  label: string
}) {
  const { value: count, ref } = useCountUp(value)
  return (
    <div className="flex min-w-0 flex-col gap-3 px-4 py-8 sm:px-6 sm:py-10 lg:px-10">
      <span
        ref={ref}
        className="font-display text-3xl font-extrabold tracking-tight text-foreground min-[400px]:text-4xl sm:text-6xl lg:text-7xl"
      >
        {count.toLocaleString()}
        <span className="text-accent">{suffix}</span>
      </span>
      <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground sm:text-xs sm:tracking-[0.22em]">
        {label}
      </span>
    </div>
  )
}

export function Metrics() {
  return (
    <section className="border-y border-border bg-card/40">
      <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-border lg:grid-cols-4 lg:divide-y-0">
        {METRICS.map((m) => (
          <Metric key={m.label} value={m.value} suffix={m.suffix} label={m.label} />
        ))}
      </div>
    </section>
  )
}
