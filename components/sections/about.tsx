import Image from 'next/image'
import { Reveal } from '@/components/reveal'
import { Eyebrow } from '@/components/section-heading'
import { BRAND } from '@/lib/brand'

const DETAILS = [
  { value: '2015', label: 'Established' },
  { value: '18k sqft', label: 'Training Floor' },
  { value: '100%', label: 'Coach-Led' },
]

export function About() {
  return (
    <section id="about" className="relative py-24 lg:py-36">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          {/* Image composition */}
          <Reveal className="relative">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg sm:aspect-[5/5]">
              <Image
                src="/images/about-main.png"
                alt={`Interior of the ${BRAND.name} training floor at dusk`}
                fill
                sizes="(min-width: 1024px) 45vw, 90vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-10 -right-4 hidden w-2/5 overflow-hidden rounded-lg border-4 border-background sm:block">
              <div className="relative aspect-square w-full">
                <Image
                  src="/images/about-secondary.png"
                  alt="Close-up of an athlete chalking their hands before a lift"
                  fill
                  sizes="20vw"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="absolute -left-3 top-8 rounded-full bg-accent px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-accent-foreground">
              Our Philosophy
            </div>
          </Reveal>

          {/* Copy */}
          <div className="flex flex-col gap-8">
            <Reveal className="flex flex-col gap-5">
              <Eyebrow>The Standard</Eyebrow>
              <h2 className="font-display text-4xl font-extrabold uppercase leading-[0.95] tracking-tight text-balance sm:text-5xl lg:text-6xl">
                More Than a Gym.
                <br />
                <span className="text-accent">A Standard.</span>
              </h2>
            </Reveal>

            <Reveal delay={100} className="flex flex-col gap-5 text-lg leading-relaxed text-muted-foreground text-pretty">
              <p>
                {BRAND.name} was built on a simple idea: performance is a
                product of environment. Every rack, every square foot and every
                coach here exists to make showing up the easy part.
              </p>
              <p>
                We are a home for people chasing something real &mdash; whether
                that is your first pull-up or your next personal best. Consistency,
                community and craft. That is the standard we hold.
              </p>
            </Reveal>

            <Reveal delay={200} className="mt-2 grid grid-cols-3 gap-4 border-t border-border pt-8">
              {DETAILS.map((d) => (
                <div key={d.label} className="flex flex-col gap-1">
                  <span className="font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                    {d.value}
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {d.label}
                  </span>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
