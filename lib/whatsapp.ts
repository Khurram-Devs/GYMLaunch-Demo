import { BRAND } from '@/lib/brand'

type Intent = 'general' | 'join' | 'visit' | 'program' | 'plan' | 'offer' | 'path'

type LinkOptions = {
  intent?: Intent
  source: string
  plan?: string
  price?: number
  billing?: 'monthly' | 'yearly'
  program?: string
  offer?: string
  offerDetail?: string
  path?: string
  message?: string
}

function buildMessage({
  intent = 'general',
  plan,
  price,
  billing,
  program,
  offer,
  offerDetail,
  path,
  message,
}: LinkOptions) {
  const name = BRAND.name
  switch (intent) {
    case 'join':
      return `Hi ${name}, I’d like to join. Can you tell me how to get started?`
    case 'visit':
      return `Hi ${name}, I’d like to book a free visit. What times are available?`
    case 'program':
      return `Hi ${name}, ${message ?? `I’d like to know more about the ${program} program.`}`
    case 'plan':
      return `Hi ${name}, I’m interested in the ${plan} plan (PKR ${price?.toLocaleString('en-US')}/month, billed ${billing}). What are the next steps?`
    case 'offer':
      return `Hi ${name}, I’d like to avail the ${offer} (${offerDetail}). What are the next steps?`
    case 'path':
      return `Hi ${name}, ${message ?? `I’d like to know more about ${path}.`}`
    default:
      return `Hi ${name}, I’d like to know more about memberships.`
  }
}

export function whatsappHref(options: LinkOptions) {
  return `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(buildMessage(options))}`
}

export function whatsappLinkProps(options: LinkOptions) {
  const interest = options.plan ?? options.program ?? options.offer ?? options.path
  return {
    href: whatsappHref(options),
    target: '_blank',
    rel: 'noopener noreferrer',
    'data-lead-source': options.source,
    ...(interest ? { 'data-lead-interest': interest } : {}),
  }
}
