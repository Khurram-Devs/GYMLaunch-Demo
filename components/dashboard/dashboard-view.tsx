'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowUpRight, MousePointerClick, Trash2 } from 'lucide-react'
import { BrandMark } from '@/components/brand-mark'
import { BarList } from '@/components/dashboard/bar-list'
import { LeadsChart, LeadsTable } from '@/components/dashboard/leads-chart'
import {
  AVERAGE_PLAN_PRICE,
  DAILY_LEADS,
  FUNNEL,
  KPI_DELTAS,
  LEAD_SOURCES,
  LEAD_STATUSES,
  MOCK_LEADS,
  PLAN_INTEREST,
  RANGES,
  type LeadStatus,
  type MockLead,
} from '@/lib/dashboard-data'
import { clearLeads, readLeads, SOURCE_LABELS, type DemoLead } from '@/lib/leads'
import { cn } from '@/lib/utils'

type RangeId = (typeof RANGES)[number]['id']

const pkr = (value: number) => `PKR ${value.toLocaleString('en-US')}`

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
    <div className={cn('rounded-xl border border-border bg-card/50 p-6', className)}>{children}</div>
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
  const [range, setRange] = useState<RangeId>('30')
  const [chartView, setChartView] = useState<'chart' | 'table'>('chart')
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'All'>('All')
  const [live, setLive] = useState<DemoLead[]>([])

  useEffect(() => {
    const refresh = () => setLive(readLeads())
    refresh()
    window.addEventListener('storage', refresh)
    window.addEventListener('focus', refresh)
    return () => {
      window.removeEventListener('storage', refresh)
      window.removeEventListener('focus', refresh)
    }
  }, [])

  const days = RANGES.find((r) => r.id === range)?.days ?? 30

  const series = useMemo(() => {
    const base = DAILY_LEADS.slice(-days)
    return base.map((value, i) => (i === base.length - 1 ? value + live.length : value))
  }, [days, live.length])

  const totals = useMemo(() => {
    const leads = series.reduce((sum, v) => sum + v, 0)
    const visits = Math.round(leads * FUNNEL.visitRate)
    const members = Math.round(visits * FUNNEL.joinRate)
    return { leads, visits, members, revenue: members * AVERAGE_PLAN_PRICE }
  }, [series])

  const rows: MockLead[] = useMemo(() => {
    const liveRows: MockLead[] = live.map((lead) => ({
      id: lead.id,
      name: 'Website visitor',
      contact: 'WhatsApp chat',
      interest: lead.interest ?? 'General enquiry',
      source: SOURCE_LABELS[lead.source] ?? lead.source,
      status: 'New',
      ago: relativeTime(lead.at),
    }))
    return [...liveRows, ...MOCK_LEADS]
  }, [live])

  const counts = useMemo(() => {
    const result: Record<string, number> = { All: rows.length }
    for (const status of LEAD_STATUSES) result[status] = rows.filter((r) => r.status === status).length
    return result
  }, [rows])

  const visibleRows = statusFilter === 'All' ? rows : rows.filter((r) => r.status === statusFilter)

  const tiles = [
    { label: 'New leads', value: totals.leads.toLocaleString('en-US'), delta: KPI_DELTAS.leads },
    { label: 'Visits booked', value: totals.visits.toLocaleString('en-US'), delta: KPI_DELTAS.visits },
    { label: 'New members', value: totals.members.toLocaleString('en-US'), delta: KPI_DELTAS.members },
  ]

  return (
    <div className="min-h-svh bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <div className="flex items-center gap-4">
            <BrandMark textClassName="text-base" />
            <span className="hidden h-5 w-px bg-border sm:block" aria-hidden="true" />
            <span className="text-sm font-medium text-foreground/80">Owner dashboard</span>
            <span className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
              Demo data
            </span>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to website
          </Link>
        </div>
      </header>

      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-10 sm:px-8">
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
                  'rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition-colors',
                  range === r.id
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {r.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <MousePointerClick className="h-4 w-4 text-accent" aria-hidden="true" />
            <span>
              {live.length > 0
                ? `${live.length} live demo click${live.length === 1 ? '' : 's'} from this browser`
                : 'Click any WhatsApp button on the site: it appears here as a new lead.'}
            </span>
            {live.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  clearLeads()
                  setLive([])
                }}
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-foreground/80 transition-colors hover:border-foreground/40"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                Clear
              </button>
            )}
          </div>
        </div>

        <Card className="flex flex-col gap-3 sm:p-8">
          <CardTitle>Estimated new monthly revenue from website leads</CardTitle>
          <p className="font-display text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl">
            {pkr(totals.revenue)}
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <Delta value={KPI_DELTAS.revenue} />
            <span className="text-xs text-muted-foreground">
              {totals.members} new members &times; {pkr(AVERAGE_PLAN_PRICE)} average plan
            </span>
          </div>
        </Card>

        <div className="grid gap-4 sm:grid-cols-3">
          {tiles.map((tile) => (
            <Card key={tile.label} className="flex flex-col gap-2">
              <CardTitle>{tile.label}</CardTitle>
              <p className="font-display text-4xl font-extrabold tracking-tight text-foreground">
                {tile.value}
              </p>
              <Delta value={tile.delta} />
            </Card>
          ))}
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[1.6fr_1fr]">
          <Card className="flex flex-col gap-5">
            <div className="flex items-center justify-between gap-3">
              <CardTitle>New leads per day</CardTitle>
              <button
                type="button"
                onClick={() => setChartView((v) => (v === 'chart' ? 'table' : 'chart'))}
                className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-foreground/80 transition-colors hover:border-foreground/40"
              >
                {chartView === 'chart' ? 'View as table' : 'View as chart'}
              </button>
            </div>
            {chartView === 'chart' ? <LeadsChart values={series} /> : <LeadsTable values={series} />}
          </Card>

          <div className="flex flex-col gap-6">
            <Card className="flex flex-col gap-5">
              <CardTitle>Plan interest</CardTitle>
              <BarList items={PLAN_INTEREST} />
            </Card>
            <Card className="flex flex-col gap-5">
              <CardTitle>Where leads come from</CardTitle>
              <BarList items={LEAD_SOURCES} />
            </Card>
          </div>
        </div>

        <Card className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle>Latest leads</CardTitle>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by status">
              {(['All', ...LEAD_STATUSES] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  aria-pressed={statusFilter === status}
                  className={cn(
                    'rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors',
                    statusFilter === status
                      ? 'border-accent bg-accent text-accent-foreground'
                      : 'border-border text-muted-foreground hover:text-foreground',
                  )}
                >
                  {status} <span className="tabular-nums opacity-70">{counts[status]}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto" data-lenis-prevent-horizontal>
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                <tr className="border-b border-border">
                  <th className="py-3 pr-4 font-semibold">Lead</th>
                  <th className="py-3 pr-4 font-semibold">Interested in</th>
                  <th className="py-3 pr-4 font-semibold">Source</th>
                  <th className="py-3 pr-4 font-semibold">Status</th>
                  <th className="py-3 text-right font-semibold">When</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {visibleRows.map((lead) => (
                  <tr key={lead.id}>
                    <td className="py-3.5 pr-4">
                      <p className="font-medium text-foreground">{lead.name}</p>
                      <p className="text-xs text-muted-foreground">{lead.contact}</p>
                    </td>
                    <td className="py-3.5 pr-4 text-foreground/90">{lead.interest}</td>
                    <td className="py-3.5 pr-4 text-muted-foreground">{lead.source}</td>
                    <td className="py-3.5 pr-4">
                      <span
                        className={cn(
                          'inline-flex rounded-full px-3 py-1 text-xs font-semibold',
                          lead.status === 'Joined'
                            ? 'bg-accent text-accent-foreground'
                            : lead.status === 'New'
                              ? 'border border-accent/50 text-accent'
                              : 'border border-border text-foreground/80',
                        )}
                      >
                        {lead.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right text-muted-foreground">{lead.ago}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <p className="text-xs text-muted-foreground">
          Sample figures for demonstration. Clicks made on this demo site are stored only in this browser.
        </p>
      </main>
    </div>
  )
}
