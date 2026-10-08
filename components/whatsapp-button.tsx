'use client'

import { usePathname } from 'next/navigation'
import { WhatsAppIcon } from '@/components/social-icons'
import { BRAND } from '@/lib/brand'
import { whatsappLinkProps } from '@/lib/whatsapp'

export function WhatsAppButton() {
  const pathname = usePathname()
  if (pathname?.startsWith('/dashboard')) return null

  return (
    <a
      {...whatsappLinkProps({ source: 'floating' })}
      aria-label={`Chat with ${BRAND.name} on WhatsApp`}
      className="group fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/40 transition-transform duration-300 hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:bottom-7 sm:right-7"
    >
      <span
        aria-hidden="true"
        className="animate-wa-pulse pointer-events-none absolute inset-0 rounded-full bg-[#25D366]"
      />
      <WhatsAppIcon className="relative h-7 w-7" />
      <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-full bg-foreground px-3 py-1.5 text-xs font-semibold text-background opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 md:block">
        Chat on WhatsApp
      </span>
    </a>
  )
}
