import config from '@/gym.config.json'
import { buildThemeVars } from '@/lib/theme'

export type HoursGroup = {
  label: string
  days: number[]
  open: string
  close: string
}

export type GymConfig = {
  name: string
  tagline: string
  slogan: string[]
  logo: string
  showNameWithLogo: boolean
  primaryColor: string
  city: string
  country: string
  address: string
  phone: string
  whatsapp: string
  email: string
  timezone: string
  hours: HoursGroup[]
  rating: { score: number; reviews: number; source: string }
  mapImage: string
  directionsUrl: string
}

const gym: GymConfig = config

const digits = (value: string) => value.replace(/\D/g, '')

export const BRAND = {
  ...gym,
  slogan: [gym.slogan[0] ?? '', gym.slogan[1] ?? ''] as const,
  whatsapp: digits(gym.whatsapp || gym.phone),
  location: `${gym.city}, ${gym.country}`,
  logoSrc: gym.logo ? `/brand/${gym.logo}` : null,
  mapSrc: gym.mapImage ? `/brand/${gym.mapImage}` : null,
  directionsHref:
    gym.directionsUrl ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${gym.name} ${gym.address}`)}`,
  themeVars: buildThemeVars(gym.primaryColor),
} as const

export function wordmarkParts(name: string): [string, string] | null {
  const words = name.trim().split(/\s+/)
  return words.length === 2 ? [words[0], words[1]] : null
}
