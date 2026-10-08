import { PLANS } from '@/lib/data'

export type LeadStatus = 'New' | 'Contacted' | 'Visit booked' | 'Joined'

export type MockLead = {
  id: string
  name: string
  contact: string
  interest: string
  source: string
  status: LeadStatus
  ago: string
}

export const LEAD_STATUSES: LeadStatus[] = ['New', 'Contacted', 'Visit booked', 'Joined']

function mulberry32(seed: number) {
  let t = seed
  return () => {
    t += 0x6d2b79f5
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

const random = mulberry32(2026)

export const DAILY_LEADS: number[] = Array.from({ length: 30 }, (_, i) => {
  const trend = 3 + (i / 29) * 3.4
  const noise = (random() - 0.5) * 4.2
  return Math.max(1, Math.round(trend + noise))
})

export const RANGES = [
  { id: '7', label: 'Last 7 days', days: 7 },
  { id: '30', label: 'Last 30 days', days: 30 },
] as const

export const FUNNEL = {
  visitRate: 0.34,
  joinRate: 0.55,
}

export const KPI_DELTAS = {
  leads: 24,
  visits: 18,
  members: 21,
  revenue: 26,
}

const PLAN_WEIGHTS: Record<string, number> = { essential: 30, performance: 50, elite: 20 }

export const PLAN_INTEREST = PLANS.map((plan) => ({
  label: plan.name,
  value: PLAN_WEIGHTS[plan.id] ?? 0,
})).sort((a, b) => b.value - a.value)

export const AVERAGE_PLAN_PRICE = Math.round(
  PLANS.reduce((sum, plan) => sum + plan.monthly * (PLAN_WEIGHTS[plan.id] ?? 0), 0) /
    PLANS.reduce((sum, plan) => sum + (PLAN_WEIGHTS[plan.id] ?? 0), 0),
)

export const LEAD_SOURCES = [
  { label: 'WhatsApp button', value: 38 },
  { label: 'Membership plans', value: 24 },
  { label: 'Homepage hero', value: 16 },
  { label: 'Instagram bio link', value: 12 },
  { label: 'Google search & maps', value: 10 },
]

export const MOCK_LEADS: MockLead[] = [
  { id: 'm1', name: 'Ahmed R.', contact: '+92 3•• ••• 4821', interest: 'Performance plan', source: 'Membership plans', status: 'New', ago: '12 min ago' },
  { id: 'm2', name: 'Sana K.', contact: '+92 3•• ••• 1097', interest: 'Free visit', source: 'WhatsApp button', status: 'Visit booked', ago: '48 min ago' },
  { id: 'm3', name: 'Bilal S.', contact: '+92 3•• ••• 7365', interest: 'Elite plan', source: 'Membership plans', status: 'Contacted', ago: '2 h ago' },
  { id: 'm4', name: 'Ayesha M.', contact: '+92 3•• ••• 2250', interest: 'Personal training', source: 'Instagram bio link', status: 'New', ago: '3 h ago' },
  { id: 'm5', name: 'Hamza T.', contact: '+92 3•• ••• 9034', interest: 'Essential plan', source: 'Google search & maps', status: 'Joined', ago: '5 h ago' },
  { id: 'm6', name: 'Fatima Z.', contact: '+92 3•• ••• 5518', interest: 'Performance plan', source: 'Homepage hero', status: 'Visit booked', ago: '7 h ago' },
  { id: 'm7', name: 'Usman A.', contact: '+92 3•• ••• 6642', interest: 'Hypertrophy program', source: 'WhatsApp button', status: 'Contacted', ago: 'Yesterday' },
  { id: 'm8', name: 'Hira N.', contact: '+92 3•• ••• 3376', interest: 'Free visit', source: 'WhatsApp button', status: 'New', ago: 'Yesterday' },
  { id: 'm9', name: 'Daniyal K.', contact: '+92 3•• ••• 8809', interest: 'Elite plan', source: 'Membership plans', status: 'Joined', ago: 'Yesterday' },
  { id: 'm10', name: 'Maryam S.', contact: '+92 3•• ••• 1423', interest: 'Performance plan', source: 'Instagram bio link', status: 'Contacted', ago: '2 days ago' },
  { id: 'm11', name: 'Zain H.', contact: '+92 3•• ••• 7750', interest: 'Essential plan', source: 'Homepage hero', status: 'Visit booked', ago: '2 days ago' },
  { id: 'm12', name: 'Areeba F.', contact: '+92 3•• ••• 2967', interest: 'Functional fitness', source: 'Google search & maps', status: 'Joined', ago: '3 days ago' },
]
