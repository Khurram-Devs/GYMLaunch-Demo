'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { ContactPrompt } from '@/components/contact-prompt'
import { hasContactDecision, recordLead, recordVisit } from '@/lib/leads'

export function LeadTracker() {
  const pathname = usePathname()
  const [promptLeadId, setPromptLeadId] = useState<string | null | undefined>(undefined)

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
      if (!hasContactDecision()) setPromptLeadId(leadId)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  if (promptLeadId === undefined) return null
  return <ContactPrompt leadId={promptLeadId} onClose={() => setPromptLeadId(undefined)} />
}
