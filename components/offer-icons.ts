import {
  CalendarCheck,
  Flower2,
  GraduationCap,
  Sunrise,
  Ticket,
  Users,
  type LucideIcon,
} from 'lucide-react'
import type { OfferIcon } from '@/lib/offers'

export const OFFER_ICONS: Record<OfferIcon, LucideIcon> = {
  users: Users,
  flower: Flower2,
  sunrise: Sunrise,
  graduation: GraduationCap,
  calendar: CalendarCheck,
  ticket: Ticket,
}
