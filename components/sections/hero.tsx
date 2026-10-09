import Image from 'next/image'
import { VoltButton } from '@/components/volt-button'
import { BRAND } from '@/lib/brand'
import { whatsappLinkProps } from '@/lib/whatsapp'
import { HeroSlogan } from '@/components/hero-slogan'

const HIGHLIGHTS = ['24/7 Access', 'Premium Equipment', 'Expert Coaching']

export function Hero() {
  return (
    <section id="home" className="relative min-h-svh w-full overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero.png"
          alt="Athlete performing a heavy barbell deadlift in a dark premium gym"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/60" />
      </div>

      {/* Content */}
      <div className="relative mx-auto flex min-h-svh max-w-7xl flex-col justify-end px-5 pb-16 pt-28 sm:px-8 lg:pb-24">
        <div>
          <p className="mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-accent animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="h-px w-8 bg-accent" aria-hidden="true" />
            {BRAND.name} / {BRAND.city}
          </p>

          <HeroSlogan lines={BRAND.slogan} />

          <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty animate-in fade-in slide-in-from-bottom-8 duration-1000">
            A premium training environment engineered for people who take their
            progress seriously. Elite equipment, expert coaches and a community
            that refuses to settle.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <VoltButton {...whatsappLinkProps({ intent: 'join', source: 'hero' })}>
              Start Your Journey
            </VoltButton>
            <VoltButton href="#membership" variant="secondary" withArrow={false}>
              Explore Memberships
            </VoltButton>
          </div>

          <ul className="mt-14 flex flex-wrap gap-x-8 gap-y-3">
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
      <div className="absolute bottom-8 right-5 hidden items-center gap-3 sm:right-24 lg:flex">
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
