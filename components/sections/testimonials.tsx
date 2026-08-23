import { Quote } from 'lucide-react'
import { TESTIMONIALS } from '@/lib/data'
import { SectionHeading } from '@/components/section-heading'
import { Reveal } from '@/components/reveal'

export function Testimonials() {
  return (
    <section className="border-t border-border bg-card/30 py-24 lg:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Member Stories"
          title={
            <>
              The Results
              <br />
              Speak for Themselves
            </>
          }
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal
              key={t.name}
              delay={i * 90}
              className="flex flex-col justify-between gap-8 rounded-xl border border-border bg-card/50 p-8 transition-colors duration-300 hover:border-foreground/20"
            >
              <div className="flex flex-col gap-6">
                <Quote className="h-8 w-8 text-accent" aria-hidden="true" />
                <p className="text-lg leading-relaxed text-foreground/90 text-pretty">
                  {t.quote}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-border pt-6">
                <div className="flex flex-col">
                  <span className="font-display text-sm font-extrabold uppercase tracking-wide text-foreground">
                    {t.name}
                  </span>
                  <span className="text-xs text-muted-foreground">{t.meta}</span>
                </div>
                <span className="rounded-full bg-accent/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-accent">
                  {t.stat}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
