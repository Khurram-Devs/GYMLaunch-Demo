export type DemoLead = {
  id: string
  source: string
  interest: string | null
  at: number
}

const STORAGE_KEY = 'gym-demo-leads'
const MAX_ENTRIES = 50

export function readLeads(): DemoLead[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    return Array.isArray(parsed) ? (parsed as DemoLead[]) : []
  } catch {
    return []
  }
}

export function recordLead(source: string, interest?: string) {
  try {
    const entry: DemoLead = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      source,
      interest: interest ?? null,
      at: Date.now(),
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify([entry, ...readLeads()].slice(0, MAX_ENTRIES)))
  } catch {
    /* storage unavailable (private mode) */
  }
}

export function clearLeads() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* storage unavailable */
  }
}

export const SOURCE_LABELS: Record<string, string> = {
  nav: 'Header button',
  'nav-mobile': 'Header button',
  hero: 'Homepage hero',
  'free-visit': 'Free visit banner',
  'final-cta': 'Closing section',
  membership: 'Membership plans',
  programs: 'Programs list',
  floating: 'Floating WhatsApp',
  location: 'Location section',
}
