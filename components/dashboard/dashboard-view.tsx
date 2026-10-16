'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowUpRight, LockKeyhole, MousePointerClick, Trash2 } from 'lucide-react'
import { BrandMark } from '@/components/brand-mark'
import { BarList } from '@/components/dashboard/bar-list'
import { LeadsChart, LeadsTable } from '@/components/dashboard/leads-chart'
import { PinGate, useDashboardLock } from '@/components/dashboard/pin-gate'
import {
  BUTTON_CLICKS,
  DAILY_CLICKS,
  DAILY_VISITORS,
  INTENT_SPLIT,
  KPI_DELTAS,
  MOCK_ENQUIRIES,
  PLAN_CLICKS,
  RANGES,
  type MockEnquiry,
} from '@/lib/dashboard-data'
import {
  clearLeads,
  INTENT_LABELS,
  readLeads,
  readVisits,
  SOURCE_LABELS,
  type DemoLead,
} from '@/lib/leads'
import { cn } from '@/lib/utils'

type RangeId = (typeof RANGES)[number]['id']

function relativeTime(at: number) {
  const minutes = Math.floor((Date.now() - at) / 60_000)
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes} min ago`
  return `${Math.floor(minutes / 60)} h ago`
}

function Delta({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent">
      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />+{value}%
      <span className="font-normal text-muted-foreground">vs previous period</span>
    </span>
  )
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('rounded-xl border border-border bg-card/50 p-5 sm:p-6', className)}>{children}</div>
  )
}

function CardTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
      {children}
    </h2>
  )
}

export function DashboardView() {
  const { unlocked, unlock, lock } = useDashboardLock()
  if (unlocked === null) return <div className="min-h-svh bg-background" />
  if (!unlocked) return <PinGate onUnlock={unlock} />
  return <DashboardContent onLock={lock} />
}

function mergeCounts(
  base: { label: string; value: number }[],
  extra: Map<string, number>,
) {
  const merged = base.map((item) => ({
    label: item.label,
    value: item.value + (extra.get(item.label.toLowerCase()) ?? 0),
  }))
  const known = new Set(base.map((item) => item.label.toLowerCase()))
  for (const [key, value] of extra) {
    if (!known.has(key)) merged.push({ label: key.charAt(0).toUpperCase() + key.slice(1), value })
  }
  return merged
}

function DashboardContent({ onLock }: { onLock: () => void }) {
  const [range, setRange] = useState<RangeId>('30')
  const [chartView, setChartView] = useState<'chart' | 'table'>('chart')
  const [live, setLive] = useState<DemoLead[]>([])
  const [liveVisits, setLiveVisits] = useState(0)

  useEffect(() => {
    const refresh = () => {
      setLive(readLeads())
      setLiveVisits(readVisits())
    }
    refresh()
    window.addEventListener('storage', refresh)
    window.addEventListener('focus', refresh)
    return () => {
      window.removeEventListener('storage', refresh)
      window.removeEventListener('focus', refresh)
    }
  }, [])

  const days = RANGES.find((r) => r.id === range)?.days ?? 30

  const clickSeries = useMemo(() => {
    const base = DAILY_CLICKS.slice(-days)
    return base.map((value, i) => (i === base.length - 1 ? value + live.length : value))
  }, [days, live.length])

  const totals = useMemo(() => {
    const visitors =
      DAILY_VISITORS.slice(-days).reduce((sum, v) => sum + v, 0) + liveVisits
    const clicks = clickSeries.reduce((sum, v) => sum + v, 0)
    const liveJoin = live.filter((l) => l.intent === 'join').length
    const liveVisit = live.filter((l) => l.intent === 'visit').length
    return {
      visitors,
      clicks,
      join: Math.round(clicks * INTENT_SPLIT.join) + liveJoin,
      visit: Math.round(clicks * INTENT_SPLIT.visit) + liveVisit,
      rate: visitors ? ((clicks / visitors) * 100).toFixed(1) : '0.0',
    }
  }, [days, clickSeries, live, liveVisits])

  const planClicks = useMemo(() => {
    const extra = new Map<string, number>()
    for (const lead of live) {
      if (lead.intent !== 'plan' || !lead.interest) continue
      const key = lead.interest.toLowerCase()
      extra.set(key, (extra.get(key) ?? 0) + 1)
    }
    return mergeCounts(PLAN_CLICKS, extra)
  }, [live])

  const buttonClicks = useMemo(() => {
    const extra = new Map<string, number>()
    for (const lead of live) {
      const key = (SOURCE_LABELS[lead.source] ?? lead.source).toLowerCase()
      extra.set(key, (extra.get(key) ?? 0) + 1)
    }
    return mergeCounts(BUTTON_CLICKS, extra)
  }, [live])

  const rows: MockEnquiry[] = useMemo(() => {
    const liveRows: MockEnquiry[] = live.map((lead) => ({
      id: lead.id,
      name: lead.contact?.name || 'Anonymous visitor',
      contact: lead.contact?.phone || 'Not shared',
      interest: lead.interest ?? INTENT_LABELS[lead.intent] ?? 'General enquiry',
      source: SOURCE_LABELS[lead.source] ?? lead.source,
      intent: INTENT_LABELS[lead.intent] ?? 'General',
      ago: relativeTime(lead.at),
    }))
    return [...liveRows, ...MOCK_ENQUIRIES]
  }, [live])

  const tiles = [
    { label: 'Website visitors', value: totals.visitors, delta: KPI_DELTAS.visitors, note: null },
    { label: 'Enquiry clicks', value: totals.clicks, delta: KPI_DELTAS.clicks, note: `${totals.rate}% of visitors clicked` },
    { label: 'Join clicks', value: totals.join, delta: KPI_DELTAS.join, note: null },
    { label: 'Free visit clicks', value: totals.visit, delta: KPI_DELTAS.visit, note: null },
  ]

  return (
    <div className="min-h-svh bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <BrandMark textClassName="text-base" />
            <span className="hidden h-5 w-px bg-border sm:block" aria-hidden="true" />
            <span className="text-sm font-medium text-foreground/80">Website analytics</span>
            <span className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
              Demo data
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onLock}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <LockKeyhole className="h-4 w-4" aria-hidden="true" />
              Lock
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Back to website</span>
              <span className="sm:hidden">Website</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-8 sm:px-8 sm:py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div
            className="inline-flex items-center gap-1 rounded-full border border-border bg-card/60 p-1"
            role="group"
            aria-label="Date range"
          >
            {RANGES.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRange(r.id)}
                aria-pressed={range === r.id}
                className={cn(
                  'rounded-full px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition-colors sm:px-5',
                  range === r.id
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {r.label}
              </button>
            ))}
          </div>

          <div className="flex min-h-9 flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <MousePointerClick className="h-4 w-4 text-accent" aria-hidden="true" />
            <span>
              {live.length > 0
                ? `${live.length} live demo click${live.length === 1 ? '' : 's'} from this browser`
                : 'Click any WhatsApp or enquiry button on the site: it appears here.'}
            </span>
            {(live.length > 0 || liveVisits > 0) && (
              <button
                type="button"
                onClick={() => {
                  clearLeads()
                  setLive([])
                  setLiveVisits(0)
                }}
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-foreground/80 transition-colors hover:border-foreground/40"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                Reset demo
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {tiles.map((tile) => (
            <Card key={tile.label} className="flex min-h-[9.5rem] flex-col gap-2">
              <CardTitle>{tile.label}</CardTitle>
              <p className="font-display text-3xl font-extrabold tabular-nums tracking-tight text-foreground sm:text-4xl">
                {tile.value.toLocaleString('en-US')}
              </p>
              <Delta value={tile.delta} />
              {tile.note && <p className="text-xs text-muted-foreground">{tile.note}</p>}
            </Card>
          ))}
        </div>

        <Card className="flex flex-col gap-5">
          <div className="flex items-center justify-between gap-3">
            <CardTitle>Enquiry clicks per day</CardTitle>
            <button
              type="button"
              onClick={() => setChartView((v) => (v === 'chart' ? 'table' : 'chart'))}
              className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-foreground/80 transition-colors hover:border-foreground/40"
            >
              {chartView === 'chart' ? 'View as table' : 'View as chart'}
            </button>
          </div>
          {chartView === 'chart' ? (
            <LeadsChart values={clickSeries} />
          ) : (
            <LeadsTable values={clickSeries} />
          )}
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="flex flex-col gap-5">
            <CardTitle>Clicks by membership plan</CardTitle>
            <BarList items={planClicks} unit="" />
          </Card>
          <Card className="flex flex-col gap-5">
            <CardTitle>Clicks by button</CardTitle>
            <BarList items={buttonClicks} unit="" />
          </Card>
        </div>

        <Card className="flex flex-col gap-5">
          <CardTitle>Latest enquiries</CardTitle>
          <div className="overflow-x-auto" data-lenis-prevent-horizontal>
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                <tr className="border-b border-border">
                  <th className="py-3 pr-4 font-semibold">Visitor</th>
                  <th className="py-3 pr-4 font-semibold">Clicked on</th>
                  <th className="py-3 pr-4 font-semibold">Button</th>
                  <th className="py-3 text-right font-semibold">When</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td className="py-3.5 pr-4">
                      <p className="font-medium text-foreground">{row.name}</p>
                      <p className="text-xs text-muted-foreground">{row.contact}</p>
                    </td>
                    <td className="py-3.5 pr-4 text-foreground/90">{row.interest}</td>
                    <td className="py-3.5 pr-4 text-muted-foreground">{row.source}</td>
                    <td className="py-3.5 text-right text-muted-foreground">{row.ago}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <p className="text-xs text-muted-foreground">
          Sample figures for demonstration. Clicks and visits made on this demo site are stored only in this browser.
        </p>
      </main>
    </div>
  )
}
