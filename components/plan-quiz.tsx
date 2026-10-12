'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Check, RotateCcw, Sparkles, X } from 'lucide-react'
import { PLANS, type Plan } from '@/lib/data'
import { whatsappLinkProps } from '@/lib/whatsapp'
import { setScrollLock } from '@/lib/scroll-lock'
import { cn } from '@/lib/utils'

type PlanId = Plan['id']
type Weights = Partial<Record<PlanId, number>>

type Option = { id: string; label: string; hint?: string; weights: Weights; reason: string }
type Question = {
  id: string
  title: string
  subtitle?: string
  multi?: boolean
  options: Option[]
}

const QUESTIONS: Question[] = [
  {
    id: 'budget',
    title: 'What is your monthly budget?',
    options: [
      { id: 'low', label: 'Under PKR 10,000', weights: { essential: 4 }, reason: 'it fits your budget' },
      { id: 'mid', label: 'PKR 10,000 – 15,000', weights: { performance: 4 }, reason: 'it sits right in your budget' },
      { id: 'high', label: 'PKR 15,000+', weights: { elite: 4 }, reason: 'your budget covers the full experience' },
    ],
  },
  {
    id: 'frequency',
    title: 'How often will you train?',
    options: [
      { id: 'few', label: '1–2 days a week', weights: { essential: 2 }, reason: 'it suits a lighter weekly routine' },
      { id: 'some', label: '3–4 days a week', weights: { performance: 2 }, reason: 'it supports a regular 3–4 day routine' },
      { id: 'lots', label: '5+ days a week', weights: { elite: 2, performance: 1 }, reason: 'it is built for training almost daily' },
    ],
  },
  {
    id: 'goal',
    title: 'What is your main goal?',
    options: [
      { id: 'routine', label: 'Build a consistent routine', weights: { essential: 3 }, reason: 'it helps you build a steady habit' },
      { id: 'strength', label: 'Get stronger or leaner with structure', weights: { performance: 3 }, reason: 'it gives you structure and a clear training plan' },
      { id: 'transform', label: 'Full transformation with coaching', weights: { elite: 3 }, reason: 'it adds hands-on coaching for a full transformation' },
    ],
  },
  {
    id: 'facilities',
    title: 'What do you want access to?',
    subtitle: 'Pick all that apply.',
    multi: true,
    options: [
      { id: 'floor', label: 'Gym floor & lockers', weights: { essential: 2 }, reason: 'you get the gym floor and lockers' },
      { id: 'classes', label: 'Group classes', weights: { performance: 2, elite: 1 }, reason: 'it includes all group classes' },
      { id: 'pt', label: 'Personal training sessions', weights: { elite: 3 }, reason: 'it includes personal training sessions' },
      { id: 'nutrition', label: 'Nutrition guidance', weights: { elite: 3 }, reason: 'it includes nutrition guidance' },
    ],
  },
]

type Answers = Record<string, string[]>

function recommend(answers: Answers) {
  const scores: Record<string, number> = Object.fromEntries(PLANS.map((p) => [p.id, 0]))
  const reasons: Record<string, string[]> = Object.fromEntries(PLANS.map((p) => [p.id, []]))

  for (const q of QUESTIONS) {
    for (const optId of answers[q.id] ?? []) {
      const opt = q.options.find((o) => o.id === optId)
      if (!opt) continue
      for (const [planId, w] of Object.entries(opt.weights)) {
        scores[planId] += w ?? 0
        reasons[planId].push(opt.reason)
      }
    }
  }

  // Ties resolve toward the lower-priced plan (PLANS is ordered cheapest first)
  const best = PLANS.reduce((a, b) => (scores[b.id] > scores[a.id] ? b : a), PLANS[0])
  return { plan: best, reasons: reasons[best.id] }
}

function joinReasons(list: string[]) {
  const unique = Array.from(new Set(list)).slice(0, 4)
  if (unique.length <= 1) return unique[0] ?? 'it balances value and features'
  return `${unique.slice(0, -1).join(', ')} and ${unique[unique.length - 1]}`
}

export function PlanQuiz({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const dialogRef = useRef<HTMLDivElement>(null)

  const total = QUESTIONS.length
  const done = step >= total
  const question = QUESTIONS[step]
  const selected = question ? (answers[question.id] ?? []) : []

  const restart = useCallback(() => {
    setStep(0)
    setAnswers({})
  }, [])

  useEffect(() => {
    if (!open) return
    restart()
    setScrollLock('quiz', true)
    dialogRef.current?.focus()
    return () => setScrollLock('quiz', false)
  }, [open, restart])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const toggle = (optId: string) => {
    if (!question) return
    setAnswers((prev) => {
      const cur = prev[question.id] ?? []
      const next = question.multi
        ? cur.includes(optId)
          ? cur.filter((id) => id !== optId)
          : [...cur, optId]
        : [optId]
      return { ...prev, [question.id]: next }
    })
  }

  const result = done ? recommend(answers) : null

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-background/80 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
      data-lenis-prevent
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Find your membership plan"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[92svh] w-full max-w-xl flex-col overflow-y-auto overscroll-contain rounded-t-2xl border border-border bg-card p-6 shadow-2xl outline-none sm:rounded-2xl sm:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close quiz"
          className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-foreground/40"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>

        {/* Progress */}
        <div className="pr-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            {done ? 'Your match' : `Question ${step + 1} of ${total}`}
          </p>
          <div
            className="mt-3 flex gap-1.5"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={total}
            aria-valuenow={Math.min(step, total)}
            aria-label="Quiz progress"
          >
            {QUESTIONS.map((q, i) => (
              <span
                key={q.id}
                className={cn(
                  'h-1 flex-1 rounded-full transition-colors duration-300',
                  i < step || done ? 'bg-accent' : i === step ? 'bg-accent/60' : 'bg-foreground/10',
                )}
              />
            ))}
          </div>
        </div>

        {!done && question && (
          <div className="mt-7">
            <h3 className="font-display text-2xl font-extrabold uppercase leading-tight tracking-tight text-foreground sm:text-3xl">
              {question.title}
            </h3>
            {question.subtitle && (
              <p className="mt-2 text-sm text-muted-foreground">{question.subtitle}</p>
            )}

            <div
              className="mt-6 flex flex-col gap-3"
              role={question.multi ? 'group' : 'radiogroup'}
              aria-label={question.title}
            >
              {question.options.map((opt) => {
                const isOn = selected.includes(opt.id)
                return (
                  <button
                    key={opt.id}
                    type="button"
                    role={question.multi ? 'checkbox' : 'radio'}
                    aria-checked={isOn}
                    onClick={() => toggle(opt.id)}
                    className={cn(
                      'flex items-center justify-between gap-3 rounded-xl border px-4 py-3.5 text-left text-sm font-medium transition-all duration-200',
                      isOn
                        ? 'border-accent bg-accent/10 text-foreground'
                        : 'border-border bg-card/40 text-foreground/80 hover:border-foreground/30',
                    )}
                  >
                    {opt.label}
                    <span
                      className={cn(
                        'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border',
                        isOn ? 'border-accent bg-accent text-accent-foreground' : 'border-border',
                      )}
                      aria-hidden="true"
                    >
                      {isOn && <Check className="h-3 w-3" />}
                    </span>
                  </button>
                )
              })}
            </div>

            <div className="mt-8 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
                className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-foreground transition-colors hover:border-foreground/40 disabled:pointer-events-none disabled:opacity-40"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Back
              </button>
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                disabled={selected.length === 0}
                className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-accent-foreground transition-all hover:brightness-110 disabled:pointer-events-none disabled:opacity-40"
              >
                {step === total - 1 ? 'See my plan' : 'Next'}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {result && (
          <div className="mt-7">
            <div className="flex items-center gap-2 text-accent">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em]">Recommended for you</span>
            </div>
            <h3 className="mt-3 font-display text-4xl font-extrabold uppercase tracking-tight text-foreground sm:text-5xl">
              {result.plan.name}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              PKR {result.plan.monthly.toLocaleString('en-US')} / month &middot; PKR{' '}
              {result.plan.yearly.toLocaleString('en-US')} / month billed yearly
            </p>

            <p className="mt-5 text-sm leading-relaxed text-foreground/90">
              We picked {result.plan.name} because {joinReasons(result.reasons)}.
            </p>

            <ul className="mt-5 flex flex-col gap-2.5 border-t border-border pt-5">
              {result.plan.features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-foreground/90">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                    <Check className="h-3 w-3" aria-hidden="true" />
                  </span>
                  {f}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                {...whatsappLinkProps({
                  intent: 'plan',
                  source: 'plan-quiz',
                  plan: result.plan.name,
                  price: result.plan.monthly,
                  billing: 'monthly',
                })}
                onClick={onClose}
                className="inline-flex flex-1 items-center justify-center rounded-full bg-accent px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-accent-foreground transition-all hover:brightness-110"
              >
                Enquire on WhatsApp
              </a>
              <button
                type="button"
                onClick={restart}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-foreground transition-colors hover:border-foreground/40"
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Restart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
