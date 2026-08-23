'use client'

import { useState } from 'react'
import { SCHEDULE, SCHEDULE_DAYS } from '@/lib/data'
import { SectionHeading } from '@/components/section-heading'
import { Reveal } from '@/components/reveal'
import { cn } from '@/lib/utils'

const TYPE_TAGS = ['Strength', 'HIIT', 'Functional', 'Mobility', 'Boxing', 'Conditioning']

export function Schedule() {
  const [day, setDay] = useState<(typeof SCHEDULE_DAYS)[number]>('Mon')
  const slots = SCHEDULE[day]

  return (
    <section className="border-t border-border bg-card/30 py-24 lg:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Classes & Schedule"
            title={
              <>
                Show Up.
                <br />
                We Handle the Plan.
              </>
            }
          />
          <Reveal delay={100}>
            <div className="flex flex-wrap gap-2">
              {TYPE_TAGS.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Day selector */}
        <Reveal delay={120} className="mt-14 flex gap-2 overflow-x-auto pb-2">
          {SCHEDULE_DAYS.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDay(d)}
              className={cn(
                'flex min-w-[4.5rem] shrink-0 flex-col items-center gap-1 rounded-lg border px-4 py-3 transition-all duration-300',
                day === d
                  ? 'border-accent bg-accent text-accent-foreground'
                  : 'border-border bg-card/40 text-muted-foreground hover:border-foreground/30 hover:text-foreground',
              )}
              aria-pressed={day === d}
            >
              <span className="font-display text-lg font-extrabold uppercase tracking-tight">
                {d}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] opacity-80">
                {SCHEDULE[d].length} classes
              </span>
            </button>
          ))}
        </Reveal>

        {/* Slots */}
        <div className="mt-8 flex flex-col divide-y divide-border border-y border-border">
          {slots.map((slot) => (
            <div
              key={`${day}-${slot.time}-${slot.title}`}
              className="group grid grid-cols-1 items-center gap-3 py-6 transition-colors duration-300 hover:bg-foreground/[0.03] sm:grid-cols-12 sm:gap-6 sm:px-4"
            >
              <div className="flex items-center gap-4 sm:col-span-2">
                <span className="font-display text-2xl font-extrabold tracking-tight text-foreground tabular-nums">
                  {slot.time}
                </span>
              </div>

              <div className="sm:col-span-4">
                <h3 className="font-display text-xl font-extrabold uppercase tracking-tight text-foreground">
                  {slot.title}
                </h3>
              </div>

              <div className="sm:col-span-2">
                <span className="inline-block rounded-full bg-accent/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">
                  {slot.type}
                </span>
              </div>

              <div className="sm:col-span-2">
                <span className="text-sm text-muted-foreground">{slot.coach}</span>
              </div>

              <div className="sm:col-span-2 sm:flex sm:justify-end">
                <button
                  type="button"
                  className="w-full rounded-full border border-border px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground transition-all duration-300 hover:border-accent hover:bg-accent hover:text-accent-foreground sm:w-auto"
                >
                  Book Class
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
