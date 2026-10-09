import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const config = JSON.parse(readFileSync(join(root, 'gym.config.json'), 'utf8'))
const errors = []

const requiredStrings = [
  'name', 'tagline', 'primaryColor', 'city', 'country', 'address', 'phone', 'email', 'timezone',
]
for (const key of requiredStrings) {
  if (typeof config[key] !== 'string' || !config[key].trim()) errors.push(`"${key}" is required`)
}

if (typeof config.showNameWithLogo !== 'boolean') {
  errors.push('"showNameWithLogo" must be true or false')
}

const SLOGAN_MAX_LENGTH = 24
if (
  !Array.isArray(config.slogan) ||
  config.slogan.length !== 2 ||
  config.slogan.some((line) => typeof line !== 'string' || !line.trim() || line.length > SLOGAN_MAX_LENGTH)
) {
  errors.push(`"slogan" must be two non-empty strings of at most ${SLOGAN_MAX_LENGTH} characters, e.g. ["Train Hard.", "Become More."]`)
}

if (!/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(config.primaryColor ?? '')) {
  errors.push('"primaryColor" must be a hex color like #F8B516')
}

if (!/^\+?[\d\s-]{8,}$/.test(config.whatsapp || config.phone || '')) {
  errors.push('"whatsapp" (or "phone") must be a valid number')
}

try {
  new Intl.DateTimeFormat('en-US', { timeZone: config.timezone })
} catch {
  errors.push(`"timezone" is not a valid IANA timezone: ${config.timezone}`)
}

for (const key of ['logo', 'mapImage']) {
  if (config[key] && !existsSync(join(root, 'public', 'brand', config[key]))) {
    errors.push(`"${key}" file not found: public/brand/${config[key]}`)
  }
}

if (!Array.isArray(config.hours) || config.hours.length === 0) {
  errors.push('"hours" must be a non-empty array')
} else {
  for (const group of config.hours) {
    const valid =
      typeof group.label === 'string' &&
      Array.isArray(group.days) &&
      group.days.every((d) => Number.isInteger(d) && d >= 0 && d <= 6) &&
      /^\d{2}:\d{2}$/.test(group.open) &&
      /^\d{2}:\d{2}$/.test(group.close)
    if (!valid) errors.push(`invalid hours entry: ${JSON.stringify(group)}`)
  }
}

if (
  !config.rating ||
  typeof config.rating.score !== 'number' ||
  config.rating.score < 0 ||
  config.rating.score > 5 ||
  !Number.isInteger(config.rating.reviews)
) {
  errors.push('"rating" needs score (0-5), reviews (integer) and source')
}

if (errors.length) {
  console.error('\ngym.config.json problems:\n' + errors.map((e) => `  - ${e}`).join('\n') + '\n')
  process.exit(1)
}
