import { cn } from '@/lib/utils'

/* ---------- Peak-hours heatmap (day x time band) ---------- */

type HeatmapProps = {
  days: string[]
  bands: string[]
  values: number[][]
}

export function Heatmap({ days, bands, values }: HeatmapProps) {
  const max = Math.max(...values.flat(), 1)
  return (
    <div className="overflow-x-auto" data-lenis-prevent-horizontal>
      <div className="min-w-[420px]">
        <div
          className="grid gap-1.5"
          style={{ gridTemplateColumns: `2.5rem repeat(${bands.length}, minmax(0, 1fr))` }}
          role="table"
          aria-label="Check-ins by day and time of day"
        >
          <span aria-hidden="true" />
          {bands.map((band) => (
            <span key={band} className="text-center text-[10px] text-muted-foreground">
              {band}
            </span>
          ))}
          {days.map((day, d) => (
            <div key={day} className="contents" role="row">
              <span className="flex items-center text-[11px] text-muted-foreground">{day}</span>
              {values[d].map((value, b) => (
                <span
                  key={b}
                  title={`${day} ${bands[b]}: ${value} check-ins avg`}
                  aria-label={`${day} ${bands[b]}: ${value} check-ins`}
                  className="flex aspect-[4/3] items-center justify-center rounded-md border border-border/60 text-[10px] font-medium tabular-nums text-foreground/80"
                  style={{
                    backgroundColor: `color-mix(in oklab, var(--accent) ${Math.round((value / max) * 90)}%, transparent)`,
                    color: value / max > 0.6 ? 'var(--accent-foreground)' : undefined,
                  }}
                >
                  {value}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ---------- Stacked status bar (membership health) ---------- */

type Segment = { label: string; value: number; tone: 'solid' | 'mid' | 'soft' | 'outline' }

const TONES: Record<Segment['tone'], string> = {
  solid: 'bg-accent',
  mid: 'bg-accent/60',
  soft: 'bg-accent/30',
  outline: 'bg-foreground/20',
}

export function StackedBar({ segments }: { segments: Segment[] }) {
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1
  return (
    <div className="flex flex-col gap-4">
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-foreground/10" aria-hidden="true">
        {segments.map((s) => (
          <div key={s.label} className={TONES[s.tone]} style={{ width: `${(s.value / total) * 100}%` }} />
        ))}
      </div>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-3">
        {segments.map((s) => (
          <li key={s.label} className="flex items-start gap-2.5">
            <span className={cn('mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full', TONES[s.tone])} aria-hidden="true" />
            <span className="flex flex-col">
              <span className="text-xs text-muted-foreground">{s.label}</span>
              <span className="text-lg font-bold tabular-nums text-foreground">
                {s.value}
                <span className="ml-1 text-xs font-normal text-muted-foreground">
                  {Math.round((s.value / total) * 100)}%
                </span>
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ---------- Small column chart (monthly revenue, check-ins) ---------- */

type ColumnsProps = {
  items: { label: string; value: number }[]
  format?: (value: number) => string
}

export function Columns({ items, format = (v) => String(v) }: ColumnsProps) {
  const max = Math.max(...items.map((i) => i.value), 1)
  return (
    <div className="flex h-44 items-end gap-2 sm:gap-3" role="img" aria-label="Column chart">
      {items.map((item, i) => {
        const isLast = i === items.length - 1
        return (
          <div key={item.label} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2">
            <span className="text-[10px] font-semibold tabular-nums text-foreground/80 sm:text-xs">
              {format(item.value)}
            </span>
            <div
              className={cn('w-full max-w-10 rounded-t-md', isLast ? 'bg-accent' : 'bg-accent/45')}
              style={{ height: `${Math.max((item.value / max) * 100, 4)}%` }}
            />
            <span className="text-[10px] text-muted-foreground sm:text-xs">{item.label}</span>
          </div>
        )
      })}
    </div>
  )
}

/* ---------- Capacity meter list (class fill rate) ---------- */

export function FillList({
  items,
}: {
  items: { label: string; detail: string; value: number }[]
}) {
  return (
    <ul className="flex flex-col gap-4">
      {items.map((item) => (
        <li key={item.label} className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="min-w-0 truncate text-foreground/90">
              {item.label} <span className="text-xs text-muted-foreground">· {item.detail}</span>
            </span>
            <span className="font-semibold tabular-nums text-foreground">{item.value}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-foreground/10" aria-hidden="true">
            <div
              className={cn('h-full rounded-full', item.value >= 85 ? 'bg-accent' : 'bg-accent/55')}
              style={{ width: `${item.value}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  )
}
