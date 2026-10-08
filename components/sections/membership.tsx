'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import { PLANS } from '@/lib/data'
import { SectionHeading } from '@/components/section-heading'
import { Reveal } from '@/components/reveal'
import { cn } from '@/lib/utils'
import { whatsappLinkProps } from '@/lib/whatsapp'

export function Membership() {
  const [yearly, setYearly] = useState(false)

  return (
    <section id="membership" className="relative py-24 lg:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col items-center gap-8 text-center">
          <SectionHeading
            align="center"
            eyebrow="Membership"
            title={
              <>
                Choose Your
                <br />
                Level of Commitment
              </>
            }
          />

          {/* Billing toggle */}
          <Reveal
            delay={100}
            className="inline-flex items-center gap-1 rounded-full border border-border bg-card/60 p-1"
          >
            <button
              type="button"
              onClick={() => setYearly(false)}
              className={cn(
                'rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition-colors',
                !yearly ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground',
              )}
              aria-pressed={!yearly}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setYearly(true)}
              className={cn(
                'flex items-center gap-2 rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition-colors',
                yearly ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground',
              )}
              aria-pressed={yearly}
            >
              Yearly
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 text-[10px]',
                  yearly ? 'bg-accent-foreground/15 text-accent-foreground' : 'bg-accent/15 text-accent',
                )}
              >
                -15%
              </span>
            </button>
          </Reveal>
        </div>

        {/* Plans */}
        <div className="mt-16 grid gap-6 lg:grid-cols-3 lg:items-center">
          {PLANS.map((plan, i) => {
            const price = yearly ? plan.yearly : plan.monthly
            return (
              <Reveal
                key={plan.id}
                delay={i * 90}
                className={cn(
                  'relative flex flex-col rounded-xl border p-8 transition-all duration-300',
                  plan.featured
                    ? 'border-accent/60 bg-card shadow-[0_0_60px_-20px_var(--accent)] lg:scale-[1.04] lg:py-11'
                    : 'border-border bg-card/40 hover:border-foreground/25',
                )}
              >
                {plan.featured && (
                  <span className="absolute -top-3 left-8 rounded-full bg-accent px-4 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-accent-foreground">
                    Most Popular
                  </span>
                )}

                <div className="flex items-baseline justify-between">
                  <h3 className="font-display text-xl font-extrabold uppercase tracking-tight text-foreground">
                    {plan.name}
                  </h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {plan.blurb}
                </p>

                <div className="mt-8 flex items-end gap-1.5">
                  <span className="text-sm font-semibold text-muted-foreground">PKR</span>
                  <span className="font-display text-5xl font-extrabold tracking-tight text-foreground tabular-nums">
                    {price.toLocaleString()}
                  </span>
                  <span className="mb-1.5 text-sm text-muted-foreground">/ mo</span>
                </div>
                {yearly && (
                  <p className="mt-1 text-xs text-accent">Billed annually</p>
                )}

                <ul className="mt-8 flex flex-col gap-3.5 border-t border-border pt-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-foreground/90">
                      <span
                        className={cn(
                          'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full',
                          plan.featured ? 'bg-accent text-accent-foreground' : 'bg-foreground/10 text-accent',
                        )}
                      >
                        <Check className="h-3 w-3" aria-hidden="true" />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <a
                  {...whatsappLinkProps({
                    intent: 'plan',
                    source: 'membership',
                    plan: plan.name,
                    price,
                    billing: yearly ? 'yearly' : 'monthly',
                  })}
                  className={cn(
                    'mt-9 inline-flex w-full items-center justify-center rounded-full px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] transition-all duration-300',
                    plan.featured
                      ? 'bg-accent text-accent-foreground hover:brightness-110 hover:shadow-[0_0_30px_-6px_var(--accent)]'
                      : 'border border-border text-foreground hover:border-foreground/40 hover:bg-foreground/5',
                  )}
                >
                  {plan.cta}
                </a>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
