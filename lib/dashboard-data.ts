import { PLANS } from '@/lib/data'

export type MockEnquiry = {
  id: string
  name: string
  contact: string
  interest: string
  source: string
  intent: string
  ago: string
}

export const RANGES = [
  { id: '7', label: 'Last 7 days', days: 7 },
  { id: '30', label: 'Last 30 days', days: 30 },
] as const

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

export const DAILY_VISITORS: number[] = Array.from({ length: 30 }, (_, i) => {
  const trend = 70 + (i / 29) * 45
  return Math.max(20, Math.round(trend + (random() - 0.5) * 36))
})

export const DAILY_CLICKS: number[] = DAILY_VISITORS.map((visitors) =>
  Math.max(1, Math.round(visitors * (0.07 + random() * 0.04))),
)

export const KPI_DELTAS = { visitors: 22, clicks: 24, join: 19, visit: 16 }

export const INTENT_SPLIT = { join: 0.42, visit: 0.31 }

const PLAN_WEIGHTS: Record<string, number> = { essential: 30, performance: 50, elite: 20 }

export const PLAN_CLICKS = PLANS.map((plan) => ({
  label: plan.name,
  value: PLAN_WEIGHTS[plan.id] ?? 0,
})).sort((a, b) => b.value - a.value)

export const BUTTON_CLICKS = [
  { label: 'Floating WhatsApp', value: 38 },
  { label: 'Membership plans', value: 24 },
  { label: 'Homepage hero', value: 16 },
  { label: 'Header button', value: 12 },
  { label: 'Free visit banner', value: 10 },
]

export const MOCK_ENQUIRIES: MockEnquiry[] = [
  { id: 'm1', name: 'Ahmed R.', contact: '+92 3•• ••• 4821', interest: 'Performance plan', source: 'Membership plans', intent: 'Plan', ago: '12 min ago' },
  { id: 'm2', name: 'Sana K.', contact: '+92 3•• ••• 1097', interest: 'Free visit', source: 'Floating WhatsApp', intent: 'Free visit', ago: '48 min ago' },
  { id: 'm3', name: 'Bilal S.', contact: '+92 3•• ••• 7365', interest: 'Elite plan', source: 'Membership plans', intent: 'Plan', ago: '2 h ago' },
  { id: 'm4', name: 'Anonymous visitor', contact: 'Not shared', interest: 'Join', source: 'Homepage hero', intent: 'Join', ago: '3 h ago' },
  { id: 'm5', name: 'Hamza T.', contact: '+92 3•• ••• 9034', interest: 'Essential plan', source: 'Membership plans', intent: 'Plan', ago: '5 h ago' },
  { id: 'm6', name: 'Fatima Z.', contact: '+92 3•• ••• 5518', interest: 'Free visit', source: 'Free visit banner', intent: 'Free visit', ago: '7 h ago' },
  { id: 'm7', name: 'Anonymous visitor', contact: 'Not shared', interest: 'Join', source: 'Header button', intent: 'Join', ago: 'Yesterday' },
  { id: 'm8', name: 'Hira N.', contact: '+92 3•• ••• 3376', interest: 'Free visit', source: 'Location section', intent: 'Free visit', ago: 'Yesterday' },
  { id: 'm9', name: 'Daniyal K.', contact: '+92 3•• ••• 8809', interest: 'Elite plan', source: 'Membership plans', intent: 'Plan', ago: 'Yesterday' },
  { id: 'm10', name: 'Anonymous visitor', contact: 'Not shared', interest: 'General enquiry', source: 'Floating WhatsApp', intent: 'General', ago: '2 days ago' },
]
