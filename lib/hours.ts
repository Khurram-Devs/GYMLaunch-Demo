import { BRAND, type HoursGroup } from '@/lib/brand'

export type OpenStatus = {
  open: boolean
  todayLabel: string
  detail: string
  todayDay: number
}

const WEEKDAYS: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }

const toMinutes = (time: string) => {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

function format12h(time: string) {
  const [h, m] = time.split(':').map(Number)
  const suffix = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 === 0 ? 12 : h % 12
  return `${hour}:${String(m).padStart(2, '0')} ${suffix}`
}

export const formatRange = (group: HoursGroup) => `${format12h(group.open)} – ${format12h(group.close)}`

function zonedNow(now: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now)
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? ''
  return {
    day: WEEKDAYS[get('weekday')] ?? 0,
    minutes: Number(get('hour')) * 60 + Number(get('minute')),
  }
}

function groupFor(day: number) {
  return BRAND.hours.find((g) => g.days.includes(day))
}

export function getOpenStatus(now: Date = new Date()): OpenStatus {
  const { day, minutes } = zonedNow(now, BRAND.timezone)
  const today = groupFor(day)
  const yesterday = groupFor((day + 6) % 7)

  let open = false
  let closesAt: string | null = null

  if (today) {
    const start = toMinutes(today.open)
    const end = toMinutes(today.close)
    if (end > start ? minutes >= start && minutes < end : minutes >= start) {
      open = true
      closesAt = today.close
    }
  }
  if (!open && yesterday && toMinutes(yesterday.close) <= toMinutes(yesterday.open)) {
    if (minutes < toMinutes(yesterday.close)) {
      open = true
      closesAt = yesterday.close
    }
  }

  const todayLabel = today ? formatRange(today) : 'Closed'
  let detail = todayLabel
  if (open && closesAt) detail = `Closes ${format12h(closesAt)}`
  else if (today && minutes < toMinutes(today.open)) detail = `Opens ${format12h(today.open)}`
  else {
    for (let i = 1; i <= 7; i++) {
      const next = groupFor((day + i) % 7)
      if (next) {
        detail = `Opens ${i === 1 ? 'tomorrow' : 'again'} ${format12h(next.open)}`
        break
      }
    }
  }

  return { open, todayLabel, detail, todayDay: day }
}
