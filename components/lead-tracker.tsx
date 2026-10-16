'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { ContactPrompt } from '@/components/contact-prompt'
import { hasContactDecision, recordLead, recordVisit } from '@/lib/leads'

export function LeadTracker() {
  const pathname = usePathname()
  const [prompt, setPrompt] = useState<{ leadId: string | null; href: string } | null>(null)

  useEffect(() => {
    if (!pathname?.startsWith('/dashboard')) recordVisit()
  }, [pathname])

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target : null
      const link = target?.closest<HTMLElement>('[data-lead-source]')
      if (!link) return
      const leadId = recordLead(
        link.dataset.leadSource ?? 'website',
        link.dataset.leadIntent ?? 'general',
        link.dataset.leadInterest,
      )
      if (!hasContactDecision()) {
        const href = link instanceof HTMLAnchorElement ? link.href : ''
        if (!href) return
        event.preventDefault()
        setPrompt({ leadId, href })
      }
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  if (!prompt) return null
  return <ContactPrompt leadId={prompt.leadId} href={prompt.href} onClose={() => setPrompt(null)} />
}
