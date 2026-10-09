import { InstagramIcon, FacebookIcon, TikTokIcon } from '@/components/social-icons'
import { CONTACT } from '@/lib/data'
import { BRAND } from '@/lib/brand'
import { BrandMark } from '@/components/brand-mark'
import { formatRange } from '@/lib/hours'

const FOOTER_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Programs', href: '#programs' },
  { label: 'Trainers', href: '#trainers' },
  { label: 'Membership', href: '#membership' },
  { label: 'Classes', href: '#programs' },
  { label: 'Visit', href: '#visit' },
  { label: 'Contact', href: '#final-cta' },
]


const SOCIALS = [
  { label: 'Instagram', icon: InstagramIcon, href: '#' },
  { label: 'Facebook', icon: FacebookIcon, href: '#' },
  { label: 'TikTok', icon: TikTokIcon, href: '#' },
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div className="flex flex-col gap-6">
            <BrandMark textClassName="text-2xl tracking-[0.14em]" logoClassName="h-8" />
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              A premium fitness club built for people who train with intent.{' '}
              {BRAND.city}&apos;s home for serious progress.
            </p>
            <div className="flex gap-3">
              {SOCIALS.map(({ label, icon: Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-all duration-300 hover:border-accent hover:bg-accent hover:text-accent-foreground"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <nav aria-label="Footer" className="flex flex-col gap-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Explore
            </h3>
            <ul className="flex flex-col gap-3">
              {FOOTER_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-foreground/80 transition-colors hover:text-accent"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Hours */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Opening Hours
            </h3>
            <ul className="flex flex-col gap-3">
              {BRAND.hours.map((h) => (
                <li key={h.label} className="flex flex-col text-sm">
                  <span className="text-foreground/80">{h.label}</span>
                  <span className="text-muted-foreground">{formatRange(h)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Contact
            </h3>
            <ul className="flex flex-col gap-3 text-sm">
              <li className="text-muted-foreground">{CONTACT.location}</li>
              <li>
                <a
                  href={`tel:${CONTACT.phone.replace(/\s/g, '')}`}
                  className="text-foreground/80 transition-colors hover:text-accent"
                >
                  {CONTACT.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="text-foreground/80 transition-colors hover:text-accent"
                >
                  {CONTACT.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} {BRAND.name}. All rights reserved.
          </p>
          <p className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>Demo concept &middot; {BRAND.location}</span>
            <a href="/dashboard" className="text-foreground/70 transition-colors hover:text-accent">
              Owner dashboard preview &rarr;
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
