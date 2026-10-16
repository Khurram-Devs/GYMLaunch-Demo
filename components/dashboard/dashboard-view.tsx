'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowUpRight, LockKeyhole, MousePointerClick, Trash2 } from 'lucide-react'
import { BrandMark } from '@/components/brand-mark'
import { BarList } from '@/components/dashboard/bar-list'
import { Columns, FillList, Heatmap, StackedBar } from '@/components/dashboard/insights'
import { LeadsChart, LeadsTable } from '@/components/dashboard/leads-chart'
import { PinGate, useDashboardLock } from '@/components/dashboard/pin-gate'
import {
  ACTIVE_BY_PLAN,
  AVERAGE_PLAN_PRICE,
  CLASS_FILL,
  DAILY_CHECKINS,
  DAILY_LEADS,
  EXPIRING_MEMBERS,
  FUNNEL,
  KPI_DELTAS,
  LEAD_SOURCES,
  HEATMAP,
  HEATMAP_BANDS,
  HEATMAP_DAYS,
  LEAD_STATUSES,
  MEMBER_MIX,
  MEMBERSHIP_STATUS,
  MOCK_LEADS,
  MONTHLY_REVENUE,
  PLAN_INTEREST,
  RANGES,
  RETENTION,
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

function DashboardContent({ onLock }: { onLock: () => void }) {
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

  const avgCheckins = useMemo(() => {
    const slice = DAILY_CHECKINS.slice(-days)
    return Math.round(slice.reduce((sum, v) => sum + v, 0) / slice.length)
  }, [days])

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
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <BrandMark textClassName="text-base" />
            <span className="hidden h-5 w-px bg-border sm:block" aria-hidden="true" />
            <span className="text-sm font-medium text-foreground/80">Owner dashboard</span>
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

          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
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

        <Card className="flex flex-col gap-3 p-5 sm:p-8">
          <CardTitle>Estimated new monthly revenue from website leads</CardTitle>
          <p className="font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl">
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

        <section aria-label="Membership" className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              { label: 'Active members', value: MEMBERSHIP_STATUS.active, note: `${MEMBER_MIX.newThisMonth} joined, ${MEMBER_MIX.leavingThisMonth} left this month` },
              { label: 'Expiring in 7 days', value: MEMBERSHIP_STATUS.expiringSoon, note: 'Follow up before they lapse' },
              { label: 'Renewal rate', value: `${RETENTION.renewalRate}%`, note: `${RETENTION.churnRate}% monthly churn` },
              { label: 'Avg. check-ins / day', value: avgCheckins, note: `${RETENTION.avgTenureMonths} month avg. membership` },
            ].map((tile) => (
              <Card key={tile.label} className="flex flex-col gap-2">
                <CardTitle>{tile.label}</CardTitle>
                <p className="font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                  {tile.value}
                </p>
                <p className="text-xs text-muted-foreground">{tile.note}</p>
              </Card>
            ))}
          </div>

          <div className="grid items-start gap-6 lg:grid-cols-2">
            <Card className="flex flex-col gap-5">
              <CardTitle>Peak hours: average check-ins</CardTitle>
              <Heatmap days={HEATMAP_DAYS} bands={HEATMAP_BANDS} values={HEATMAP} />
              <p className="text-xs text-muted-foreground">
                Busiest slot: weekday evenings, 6 to 8 pm. Quietest: weekday afternoons. Use it to staff
                trainers and schedule classes.
              </p>
            </Card>
            <Card className="flex flex-col gap-5">
              <CardTitle>Revenue collected, last 6 months</CardTitle>
              <Columns items={MONTHLY_REVENUE} format={(v) => `${(v / 1_000_000).toFixed(1)}M`} />
              <p className="text-xs text-muted-foreground">Total paid across all memberships (PKR).</p>
            </Card>
          </div>

          <div className="grid items-start gap-6 lg:grid-cols-3">
            <Card className="flex flex-col gap-5">
              <CardTitle>Membership health</CardTitle>
              <StackedBar
                segments={[
                  { label: 'Active', value: MEMBERSHIP_STATUS.active, tone: 'solid' },
                  { label: 'Expiring soon', value: MEMBERSHIP_STATUS.expiringSoon, tone: 'mid' },
                  { label: 'Frozen', value: MEMBERSHIP_STATUS.frozen, tone: 'soft' },
                  { label: 'Lapsed (30 days)', value: MEMBERSHIP_STATUS.lapsed, tone: 'outline' },
                ]}
              />
            </Card>
            <Card className="flex flex-col gap-5">
              <CardTitle>Members by plan</CardTitle>
              <BarList items={ACTIVE_BY_PLAN} unit="" />
            </Card>
            <Card className="flex flex-col gap-5">
              <CardTitle>Class fill rate</CardTitle>
              <FillList items={CLASS_FILL} />
            </Card>
          </div>

          <Card className="flex flex-col gap-5">
            <CardTitle>Renewals due this week</CardTitle>
            <ul className="divide-y divide-border">
              {EXPIRING_MEMBERS.map((m) => (
                <li key={m.id} className="flex items-center justify-between gap-3 py-3">
                  <span className="min-w-0">
                    <span className="block truncate font-medium text-foreground">{m.name}</span>
                    <span className="text-xs text-muted-foreground">{m.plan} plan</span>
                  </span>
                  <span
                    className={cn(
                      'shrink-0 rounded-full px-3 py-1 text-xs font-semibold',
                      m.daysLeft <= 2 ? 'bg-accent text-accent-foreground' : 'border border-border text-foreground/80',
                    )}
                  >
                    {m.daysLeft === 1 ? 'Ends tomorrow' : `${m.daysLeft} days left`}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </section>

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
          Sample figures for demonstration. In production these come from check-ins, memberships, payments and bookings. Clicks made on this demo site are stored only in this browser.
        </p>
      </main>
    </div>
  )
}
