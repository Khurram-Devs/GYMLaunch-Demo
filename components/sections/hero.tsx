import Image from 'next/image'
import { VoltButton } from '@/components/volt-button'
import { BRAND } from '@/lib/brand'
import { whatsappLinkProps } from '@/lib/whatsapp'
import { HeroSlogan } from '@/components/hero-slogan'
import { HeroAthleteParallax } from '@/components/hero-athlete-parallax'

const HIGHLIGHTS = ['24/7 Access', 'Premium Equipment', 'Expert Coaching']

export function Hero() {
  return (
    <section id="home" className="relative isolate min-h-svh w-full overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-bg.jpg"
          alt="Dark premium gym floor with barbell racks and weight plates"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-background/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/60" />
      </div>

      {/* Athlete: in front of the background, between the solid and outlined headline */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex h-[84%] justify-center lg:h-[90%]"
      >
        <div className="hero-athlete-reveal relative h-full aspect-[433/577]">
          <HeroAthleteParallax>
            <div className="hero-athlete-float relative h-full w-full">
              <Image
                src="/images/hero-athlete.png"
                alt=""
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 90vw"
                className="select-none object-contain object-bottom"
              />
            </div>
          </HeroAthleteParallax>
        </div>
      </div>

      {/* Content */}
      <div className="relative mx-auto flex min-h-svh max-w-7xl flex-col justify-end px-5 pb-16 pt-28 sm:px-8 lg:pb-24">
        <div>
          <HeroSlogan lines={BRAND.slogan} />

          <div className="relative z-40 mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <VoltButton {...whatsappLinkProps({ intent: 'join', source: 'hero' })}>
              Start Your Journey
            </VoltButton>
            <VoltButton href="#membership" variant="secondary" withArrow={false}>
              Explore Memberships
            </VoltButton>
          </div>

          <ul className="relative z-40 mt-14 flex flex-wrap justify-center gap-x-8 gap-y-3">
            {HIGHLIGHTS.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/80"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 right-5 z-40 hidden items-center gap-3 sm:right-24 lg:flex">
        <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          Scroll
        </span>
        <span className="relative flex h-12 w-px overflow-hidden bg-border" aria-hidden="true">
          <span className="absolute inset-x-0 top-0 h-4 animate-scroll-line bg-accent" />
        </span>
      </div>
    </section>
  )
}
