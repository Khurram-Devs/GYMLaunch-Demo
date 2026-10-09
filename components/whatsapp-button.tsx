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
      className="group fixed bottom-4 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/40 transition-transform duration-300 hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:bottom-6 sm:right-6"
    >
      <span
        aria-hidden="true"
        className="animate-wa-pulse pointer-events-none absolute inset-0 rounded-full bg-[#25D366]"
      />
      <WhatsAppIcon className="relative h-6 w-6" />
      <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-full bg-foreground px-3 py-1.5 text-xs font-semibold text-background opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 md:block">
        Chat on WhatsApp
      </span>
    </a>
  )
}
