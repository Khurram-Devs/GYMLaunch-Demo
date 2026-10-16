export type ContactInfo = { name: string; phone: string }

export type DemoLead = {
  id: string
  source: string
  intent: string
  interest: string | null
  at: number
  contact?: ContactInfo
}

type ContactState = ({ skipped: false } & ContactInfo) | { skipped: true }

const LEADS_KEY = 'gym-demo-leads'
const VISITS_KEY = 'gym-demo-visits'
const CONTACT_KEY = 'gym-demo-contact'
const MAX_ENTRIES = 50

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw === null ? fallback : (JSON.parse(raw) as T)
  } catch {
    return fallback
  }
}

function writeJson(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage unavailable (private mode) */
  }
}

export function readLeads(): DemoLead[] {
  const parsed = readJson<unknown>(LEADS_KEY, [])
  return Array.isArray(parsed) ? (parsed as DemoLead[]) : []
}

export function recordLead(source: string, intent: string, interest?: string): string | null {
  const contact = readContact()
  const entry: DemoLead = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    source,
    intent,
    interest: interest ?? null,
    at: Date.now(),
    ...(contact ? { contact } : {}),
  }
  writeJson(LEADS_KEY, [entry, ...readLeads()].slice(0, MAX_ENTRIES))
  return entry.id
}

export function readVisits(): number {
  const value = readJson<unknown>(VISITS_KEY, 0)
  return typeof value === 'number' ? value : 0
}

export function recordVisit() {
  try {
    if (sessionStorage.getItem('gym-demo-session')) return
    sessionStorage.setItem('gym-demo-session', '1')
  } catch {
    return
  }
  writeJson(VISITS_KEY, readVisits() + 1)
}

export function readContact(): ContactInfo | null {
  const state = readJson<ContactState | null>(CONTACT_KEY, null)
  return state && !state.skipped ? { name: state.name, phone: state.phone } : null
}

export function hasContactDecision() {
  return readJson<ContactState | null>(CONTACT_KEY, null) !== null
}

export function saveContact(contact: ContactInfo, leadId: string | null) {
  writeJson(CONTACT_KEY, { skipped: false, ...contact })
  if (!leadId) return
  writeJson(
    LEADS_KEY,
    readLeads().map((lead) => (lead.id === leadId ? { ...lead, contact } : lead)),
  )
}

export function skipContact() {
  writeJson(CONTACT_KEY, { skipped: true })
}

export function clearLeads() {
  try {
    localStorage.removeItem(LEADS_KEY)
    localStorage.removeItem(VISITS_KEY)
    localStorage.removeItem(CONTACT_KEY)
    sessionStorage.removeItem('gym-demo-session')
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
  'offer-modal': 'Offers strip',
  calculator: 'Calculators',
}

export const INTENT_LABELS: Record<string, string> = {
  join: 'Join',
  visit: 'Free visit',
  plan: 'Plan',
  program: 'Program',
  offer: 'Offer',
  path: 'Training path',
  general: 'General',
}
