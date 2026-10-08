'use client'

import { useEffect } from 'react'
import { recordLead } from '@/lib/leads'

export function LeadTracker() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target : null
      const link = target?.closest<HTMLElement>('[data-lead-source]')
      if (!link) return
      recordLead(link.dataset.leadSource ?? 'website', link.dataset.leadInterest)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return null
}
