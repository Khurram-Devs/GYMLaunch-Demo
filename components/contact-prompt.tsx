'use client'

import { useEffect, useRef, useState } from 'react'
import { setScrollLock } from '@/lib/scroll-lock'
import { saveContact, skipContact } from '@/lib/leads'

const PHONE_PATTERN = /^\+?[0-9\s-]{10,16}$/

function openInNewTab(href: string) {
  const anchor = document.createElement('a')
  anchor.href = href
  anchor.target = '_blank'
  anchor.rel = 'noopener noreferrer'
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
}

export function ContactPrompt({
  leadId,
  href,
  onClose,
}: {
  leadId: string | null
  href: string
  onClose: () => void
}) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState<string | null>(null)

  const nameRef = useRef<HTMLInputElement>(null)

  const finish = () => {
    onClose()
    openInNewTab(href)
  }

  const skip = () => {
    skipContact()
    finish()
  }

  useEffect(() => {
    setScrollLock('contact-prompt', true)
    nameRef.current?.focus()
    return () => setScrollLock('contact-prompt', false)
  }, [])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      skipContact()
      onClose()
      openInNewTab(href)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [href, onClose])

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    const cleanName = name.trim().slice(0, 60)
    const cleanPhone = phone.trim()
    if (cleanPhone && !PHONE_PATTERN.test(cleanPhone)) {
      setError('Enter a valid phone number or leave it empty.')
      return
    }
    if (!cleanName && !cleanPhone) {
      skip()
      return
    }
    saveContact({ name: cleanName, phone: cleanPhone }, leadId)
    finish()
  }

  const inputClass =
    'w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-black/60 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-prompt-title"
    >
      <form
        onSubmit={submit}
        className="flex w-full max-w-md flex-col gap-4 rounded-xl border border-border bg-card p-6"
      >
        <div className="flex flex-col gap-1.5">
          <h2 id="contact-prompt-title" className="font-display text-xl font-bold text-foreground">
            Want us to follow up?
          </h2>
          <p className="text-sm text-muted-foreground">
            Optional. Share your name and number so the team can reach you, or skip. WhatsApp opens either way.
          </p>
        </div>
        <input
          ref={nameRef}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          autoComplete="name"
          maxLength={60}
          className={inputClass}
          aria-label="Your name"
        />
        <input
          type="tel"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value)
            setError(null)
          }}
          placeholder="Phone number"
          autoComplete="tel"
          inputMode="tel"
          maxLength={16}
          className={inputClass}
          aria-label="Phone number"
          aria-invalid={error !== null}
        />
        {error && (
          <p role="alert" className="text-xs text-accent">
            {error}
          </p>
        )}
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={skip}
            className="rounded-full px-4 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            Skip & continue
          </button>
          <button
            type="submit"
            className="rounded-full bg-accent px-6 py-2.5 text-sm font-bold text-accent-foreground transition-opacity hover:opacity-90"
          >
            Share & continue
          </button>
        </div>
      </form>
    </div>
  )
}
