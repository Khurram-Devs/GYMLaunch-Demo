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
    <div className="flex flex-col gap-3 px-6 py-10 lg:px-10">
      <span
        ref={ref}
        className="font-display text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl lg:text-7xl"
      >
        {count.toLocaleString()}
        <span className="text-accent">{suffix}</span>
      </span>
      <span className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
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
