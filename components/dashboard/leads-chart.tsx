'use client'

import { useState } from 'react'

type LeadsChartProps = {
  values: number[]
}

const WIDTH = 720
const HEIGHT = 240
const PAD = { top: 12, right: 8, bottom: 28, left: 34 }
const MAX_BAR = 24
const GAP = 2
const RADIUS = 4

function niceMax(max: number) {
  const step = max <= 10 ? 2 : max <= 25 ? 5 : 10
  return Math.ceil(max / step) * step
}

export function dayLabel(index: number, total: number) {
  const ago = total - 1 - index
  if (ago === 0) return 'Today'
  if (ago === 1) return 'Yesterday'
  return `${ago} days ago`
}

function barPath(x: number, y: number, w: number, h: number) {
  const r = Math.min(RADIUS, w / 2, h)
  return `M${x} ${y + h} V${y + r} Q${x} ${y} ${x + r} ${y} H${x + w - r} Q${x + w} ${y} ${x + w} ${y + r} V${y + h} Z`
}

export function LeadsChart({ values }: LeadsChartProps) {
  const [active, setActive] = useState<number | null>(null)
  const max = niceMax(Math.max(...values, 1))
  const plotW = WIDTH - PAD.left - PAD.right
  const plotH = HEIGHT - PAD.top - PAD.bottom
  const slot = plotW / values.length
  const barW = Math.min(MAX_BAR, slot - GAP)
  const ticks = [0, max / 2, max]

  const activeX = active === null ? 0 : PAD.left + slot * active + slot / 2

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="h-auto w-full"
        role="img"
        aria-label="Bar chart of new leads per day"
        onPointerLeave={() => setActive(null)}
      >
        {ticks.map((tick) => {
          const y = PAD.top + plotH - (tick / max) * plotH
          return (
            <g key={tick}>
              <line x1={PAD.left} x2={WIDTH - PAD.right} y1={y} y2={y} stroke="var(--border)" strokeWidth={1} />
              <text x={PAD.left - 8} y={y + 4} textAnchor="end" fontSize={11} fill="var(--muted-foreground)">
                {tick}
              </text>
            </g>
          )
        })}

        {values.map((value, i) => {
          const h = (value / max) * plotH
          const x = PAD.left + slot * i + (slot - barW) / 2
          const y = PAD.top + plotH - h
          const isActive = active === i
          return (
            <g key={i}>
              <path
                d={barPath(x, y, barW, h)}
                fill="var(--accent)"
                fillOpacity={active === null || isActive ? 1 : 0.55}
              />
              <rect
                x={PAD.left + slot * i}
                y={PAD.top}
                width={slot}
                height={plotH}
                fill="transparent"
                tabIndex={0}
                aria-label={`${dayLabel(i, values.length)}: ${value} leads`}
                onPointerEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
              />
            </g>
          )
        })}

        <text x={PAD.left} y={HEIGHT - 8} fontSize={11} fill="var(--muted-foreground)">
          {values.length} days ago
        </text>
        <text x={WIDTH - PAD.right} y={HEIGHT - 8} textAnchor="end" fontSize={11} fill="var(--muted-foreground)">
          Today
        </text>
      </svg>

      {active !== null && (
        <div
          className="pointer-events-none absolute top-0 z-10 -translate-x-1/2 rounded-md border border-border bg-card px-3 py-2 shadow-lg"
          style={{ left: `${(activeX / WIDTH) * 100}%` }}
          role="status"
        >
          <p className="flex items-center gap-2 whitespace-nowrap text-sm font-semibold text-foreground">
            <span className="h-0.5 w-3 rounded-full bg-accent" aria-hidden="true" />
            {values[active]} leads
          </p>
          <p className="whitespace-nowrap text-xs text-muted-foreground">
            {dayLabel(active, values.length)}
          </p>
        </div>
      )}
    </div>
  )
}

export function LeadsTable({ values }: LeadsChartProps) {
  return (
    <div className="max-h-60 overflow-y-auto" data-lenis-prevent>
      <table className="w-full text-left text-sm">
        <thead className="sticky top-0 bg-card text-xs uppercase tracking-[0.14em] text-muted-foreground">
          <tr>
            <th className="py-2 font-semibold">Day</th>
            <th className="py-2 text-right font-semibold">Leads</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {values
            .map((value, i) => ({ value, label: dayLabel(i, values.length) }))
            .reverse()
            .map((row) => (
              <tr key={row.label}>
                <td className="py-2 text-muted-foreground">{row.label}</td>
                <td className="py-2 text-right tabular-nums text-foreground">{row.value}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}
