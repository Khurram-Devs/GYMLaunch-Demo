'use client'

import Image from 'next/image'
import { Dialog } from '@base-ui/react/dialog'
import { Check, Clock, Gauge, X } from 'lucide-react'
import { WhatsAppIcon } from '@/components/social-icons'
import { TRAINERS, type Program } from '@/lib/data'
import { whatsappLinkProps } from '@/lib/whatsapp'

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
      {children}
    </h3>
  )
}

const stagger = (index: number) => ({ animationDelay: `${160 + index * 60}ms` })

export function ProgramModal({
  program,
  open,
  onOpenChange,
}: {
  program: Program
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const coach = TRAINERS.find((trainer) => trainer.name === program.coach)

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange} modal="trap-focus">
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-[70] bg-black/75 backdrop-blur-sm transition-opacity duration-300 data-starting-style:opacity-0 data-ending-style:opacity-0" />
        <Dialog.Viewport className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6">
          <Dialog.Popup className="relative flex max-h-[92svh] w-full max-w-[34rem] flex-col overflow-hidden rounded-t-3xl border border-border bg-card shadow-[0_40px_140px_-30px_rgba(0,0,0,0.95)] outline-none transition-[opacity,transform] duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] data-starting-style:translate-y-10 data-starting-style:opacity-0 data-ending-style:translate-y-10 data-ending-style:opacity-0 sm:max-h-[90svh] sm:rounded-2xl sm:data-starting-style:translate-y-4 sm:data-starting-style:scale-95 sm:data-ending-style:translate-y-4 sm:data-ending-style:scale-95">
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 z-20 h-px bg-gradient-to-r from-transparent via-accent to-transparent"
            />

            <Dialog.Close
              aria-label="Close"
              className="absolute right-3.5 top-3.5 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-background/60 text-foreground backdrop-blur-md transition-colors duration-200 hover:bg-background/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </Dialog.Close>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain" data-lenis-prevent>
              <div className="relative overflow-hidden border-b border-border px-5 pb-6 pt-7 sm:px-8">
                <div className="absolute inset-0 bg-[radial-gradient(80%_120%_at_0%_0%,color-mix(in_oklab,var(--accent)_22%,transparent),transparent_70%)]" />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-2 -top-4 font-display text-[9rem] font-black leading-none tracking-tighter text-foreground/[0.04]"
                >
                  {program.number}
                </span>

                <div className="relative">
                  <span className="inline-flex items-center rounded-full bg-accent px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-accent-foreground">
                    Program {program.number}
                  </span>
                  <Dialog.Title className="mt-5 max-w-[16ch] font-display text-3xl font-extrabold uppercase leading-[0.95] tracking-tight text-foreground text-balance sm:text-4xl">
                    {program.name}
                  </Dialog.Title>
                  <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">
                    {program.tagline}
                  </p>
                  <Dialog.Description className="mt-4 text-sm leading-relaxed text-muted-foreground text-pretty sm:text-[15px]">
                    {program.overview}
                  </Dialog.Description>
                </div>
              </div>

              <div className="flex flex-col gap-7 px-5 pb-7 pt-6 sm:px-8">
                <dl className="grid grid-cols-3 gap-2.5">
                  <div className="rounded-xl border border-border bg-background/50 px-3 py-3">
                    <dt className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      <Clock className="h-3 w-3" aria-hidden="true" />
                      Duration
                    </dt>
                    <dd className="mt-1.5 text-sm font-semibold leading-snug text-foreground">
                      {program.duration}
                    </dd>
                  </div>
                  <div className="rounded-xl border border-border bg-background/50 px-3 py-3">
                    <dt className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      <Gauge className="h-3 w-3" aria-hidden="true" />
                      Level
                    </dt>
                    <dd className="mt-1.5 text-sm font-semibold leading-snug text-foreground">
                      {program.difficulty}
                    </dd>
                  </div>
                  <div className="rounded-xl border border-border bg-background/50 px-3 py-3">
                    <dt className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Sessions
                    </dt>
                    <dd className="mt-1.5 text-sm font-semibold leading-snug text-foreground">
                      {program.sessions}
                    </dd>
                  </div>
                </dl>

                <section className="flex flex-col gap-3.5">
                  <SectionLabel>How it runs</SectionLabel>
                  <ol className="flex flex-col gap-3.5">
                    {program.phases.map((phase, i) => (
                      <li key={phase.title} className="flex items-start gap-3 text-sm">
                        <span
                          aria-hidden="true"
                          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-accent/40 text-xs font-bold tabular-nums text-accent"
                        >
                          {i + 1}
                        </span>
                        <span className="text-foreground/90">
                          <span className="font-semibold text-foreground">{phase.title}</span>
                          <span className="text-muted-foreground"> · {phase.detail}</span>
                        </span>
                      </li>
                    ))}
                  </ol>
                </section>

                <section className="flex flex-col gap-3.5">
                  <SectionLabel>What you’ll gain</SectionLabel>
                  <ul className="flex flex-col gap-3">
                    {program.outcomes.map((outcome, i) => (
                      <li
                        key={outcome}
                        className="animate-in fade-in slide-in-from-bottom-2 fill-mode-backwards flex items-start gap-3 text-sm text-foreground/90 duration-500"
                        style={stagger(i)}
                      >
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                          <Check className="h-3 w-3" aria-hidden="true" />
                        </span>
                        {outcome}
                      </li>
                    ))}
                  </ul>
                </section>

                {coach && (
                  <section className="flex flex-col gap-3.5 border-t border-border pt-6">
                    <SectionLabel>Your coach</SectionLabel>
                    <div className="flex items-center gap-4">
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-accent/60 bg-muted">
                        <Image
                          src={coach.image}
                          alt={coach.name}
                          fill
                          sizes="64px"
                          className="object-cover object-top"
                        />
                      </div>
                      <div>
                        <p className="font-display text-lg font-extrabold uppercase tracking-tight text-foreground">
                          {coach.name}
                        </p>
                        <p className="text-sm text-muted-foreground">{coach.role}</p>
                        <p className="mt-0.5 text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                          {coach.experience} experience
                        </p>
                      </div>
                    </div>
                  </section>
                )}
              </div>
            </div>

            <div className="shrink-0 border-t border-border bg-card/95 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4 backdrop-blur-md sm:px-8 sm:pb-6">
              <a
                {...whatsappLinkProps({
                  intent: 'program',
                  source: 'program-modal',
                  program: program.name,
                  message: program.enquiry,
                })}
                className="group relative inline-flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-full bg-accent px-7 py-4 text-sm font-bold uppercase tracking-[0.14em] text-accent-foreground transition-all duration-300 hover:brightness-110 hover:shadow-[0_0_40px_-8px_var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-card active:scale-[0.99]"
              >
                <WhatsAppIcon className="h-5 w-5" />
                Enquire on WhatsApp
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/4 -skew-x-12 bg-white/30 opacity-0 blur-md transition-all duration-700 group-hover:left-[120%] group-hover:opacity-100"
                />
              </a>
              <p className="mt-2.5 text-center text-[11px] text-muted-foreground">
                Opens WhatsApp with your message ready to send.
              </p>
            </div>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
