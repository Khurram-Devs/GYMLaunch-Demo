import { ArrowRight } from 'lucide-react'
import { PROGRAMS } from '@/lib/data'
import { SectionHeading } from '@/components/section-heading'
import { Reveal } from '@/components/reveal'

export function Programs() {
  return (
    <section id="programs" className="border-t border-border bg-card/30 py-24 lg:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Programs"
            title={
              <>
                Structured Paths
                <br />
                To Real Results
              </>
            }
          />
          <Reveal delay={100}>
            <p className="max-w-sm text-base leading-relaxed text-muted-foreground text-pretty">
              Every program is coach-designed and progress-tracked. Pick a focus
              and we will handle the roadmap.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 border-t border-border">
          {PROGRAMS.map((program, i) => (
            <Reveal key={program.number} delay={i * 60}>
              <a
                href="#membership"
                className="group grid grid-cols-1 items-center gap-4 border-b border-border py-8 transition-colors duration-300 hover:bg-foreground/[0.03] sm:grid-cols-12 sm:gap-6 sm:px-4"
              >
                <span className="font-display text-sm font-bold tracking-widest text-accent sm:col-span-1">
                  {program.number}
                </span>

                <div className="sm:col-span-4">
                  <h3 className="font-display text-2xl font-extrabold uppercase tracking-tight text-foreground transition-colors group-hover:text-accent sm:text-3xl">
                    {program.name}
                  </h3>
                </div>

                <p className="text-sm leading-relaxed text-muted-foreground sm:col-span-4">
                  {program.description}
                </p>

                <div className="flex flex-col gap-1 sm:col-span-2">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    {program.difficulty}
                  </span>
                  <span className="text-sm font-semibold text-foreground">
                    {program.duration}
                  </span>
                </div>

                <span className="hidden justify-end sm:col-span-1 sm:flex">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground transition-all duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-accent-foreground">
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
                  </span>
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
