'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { TRAINING_PANELS } from '@/lib/data'
import { SectionHeading } from '@/components/section-heading'
import { Reveal } from '@/components/reveal'
import { TrainingPathModal } from '@/components/training-path-modal'
import { cn } from '@/lib/utils'

export function TrainingExperience() {
  const [active, setActive] = useState(0)
  const [selected, setSelected] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)

  const openPath = (index: number) => {
    setActive(index)
    setSelected(index)
    setModalOpen(true)
  }

  return (
    <section className="py-20 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="The Experience"
          title={
            <>
              Built Around
              <br />
              How You Train
            </>
          }
        />

        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Six distinct disciplines under one roof. Move between them freely,
          or let a coach build the path for you.
        </p>

        <Reveal
          delay={150}
          className="mt-14 hidden gap-3 lg:flex lg:h-[30rem]"
        >
          {TRAINING_PANELS.map((panel, i) => {
            const isActive = active === i

            return (
              <button
                key={panel.id}
                type="button"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => openPath(i)}
                aria-label={`Explore ${panel.title}`}
                aria-haspopup="dialog"
                className={cn(
                  'group relative overflow-hidden rounded-lg text-left transition-[flex] delay-150 duration-500 ease-out motion-reduce:delay-0',
                  isActive ? 'flex-[4]' : 'flex-[1]',
                )}
              >
                <Image
                  src={panel.image || '/placeholder.svg'}
                  alt={panel.title}
                  fill
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  className={cn(
                    'object-cover transition-all delay-150 duration-700 motion-reduce:delay-0',
                    isActive
                      ? 'scale-100 brightness-100'
                      : 'scale-110 brightness-75',
                  )}
                />

                <div
                  className={cn(
                    'absolute inset-0 transition-all delay-150 duration-500 motion-reduce:delay-0',
                    isActive
                      ? 'bg-gradient-to-t from-background via-background/40 to-transparent'
                      : 'bg-background/20',
                  )}
                />

                <span
                  className={cn(
                    'absolute left-5 top-5 font-display text-sm font-bold tracking-widest transition-colors duration-300',
                    isActive ? 'text-accent' : 'text-foreground/60',
                  )}
                >
                  0{i + 1}
                </span>

                <div
                  className={cn(
                    'absolute inset-x-0 bottom-0 flex flex-col gap-3 p-7 transition-all',
                    isActive
                      ? 'translate-y-0 opacity-100 delay-[650ms] duration-300 motion-reduce:delay-0'
                      : 'pointer-events-none translate-y-4 opacity-0 delay-0 duration-150',
                  )}
                >
                  <span
                    className="h-px w-12 bg-accent"
                    aria-hidden="true"
                  />

                  <h3 className="font-display text-3xl font-extrabold uppercase tracking-tight text-foreground">
                    {panel.title}
                  </h3>

                  <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
                    {panel.description}
                  </p>

                  <span className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                    Explore
                    <ArrowUpRight
                      className="h-3.5 w-3.5"
                      aria-hidden="true"
                    />
                  </span>
                </div>
              </button>
            )
          })}
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:hidden">
          {TRAINING_PANELS.map((panel, i) => (
            <Reveal
              key={panel.id}
              delay={i * 60}
              className="group relative aspect-[16/10] overflow-hidden rounded-lg"
            >
              <button
                type="button"
                onClick={() => openPath(i)}
                aria-label={`Explore ${panel.title}`}
                aria-haspopup="dialog"
                className="absolute inset-0 block text-left"
              >
                <Image
                  src={panel.image || '/placeholder.svg'}
                  alt={panel.title}
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-5">
                  <span className="font-display text-xs font-bold tracking-widest text-accent">
                    0{i + 1}
                  </span>

                  <h3 className="font-display text-2xl font-extrabold uppercase tracking-tight text-foreground">
                    {panel.title}
                  </h3>

                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {panel.description}
                  </p>

                  <span className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                    Explore
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      <TrainingPathModal
        panel={TRAINING_PANELS[selected]}
        number={selected + 1}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </section>
  )
}