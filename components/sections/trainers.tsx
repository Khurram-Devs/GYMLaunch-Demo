import { ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import { InstagramIcon } from '@/components/social-icons'
import { TRAINERS } from '@/lib/data'
import { SectionHeading } from '@/components/section-heading'
import { Reveal } from '@/components/reveal'

export function Trainers() {
  return (
    <section id="trainers" className="py-24 lg:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="The Coaches"
            title={
              <>
                Trained By
                <br />
                The Best in the City
              </>
            }
          />
          <Reveal delay={100}>
            <p className="max-w-sm text-base leading-relaxed text-muted-foreground text-pretty">
              Certified, experienced and genuinely invested in your progress.
              Our coaches are the heart of GYM LAUNCH.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TRAINERS.map((trainer, i) => (
            <Reveal
              key={trainer.name}
              delay={i * 80}
              className="group relative overflow-hidden rounded-lg border border-border"
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src={trainer.image || '/placeholder.svg'}
                  alt={`${trainer.name}, ${trainer.role}`}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

                <span className="absolute right-4 top-4 rounded-full bg-background/70 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-accent backdrop-blur">
                  {trainer.experience}
                </span>

                <a
                  href="#"
                  aria-label={`${trainer.name} on Instagram`}
                  className="absolute bottom-4 right-4 flex h-10 w-10 translate-y-3 items-center justify-center rounded-full bg-accent text-accent-foreground opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 focus-visible:translate-y-0 focus-visible:opacity-100"
                >
                  <InstagramIcon className="h-4 w-4" />
                </a>
              </div>

              <div className="flex items-center justify-between gap-3 p-5">
                <div className="flex flex-col gap-1">
                  <h3 className="font-display text-lg font-extrabold uppercase tracking-tight text-foreground">
                    {trainer.name}
                  </h3>
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    {trainer.role}
                  </span>
                </div>
                <ArrowUpRight
                  className="h-5 w-5 shrink-0 text-muted-foreground transition-all duration-300 group-hover:text-accent"
                  aria-hidden="true"
                />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
