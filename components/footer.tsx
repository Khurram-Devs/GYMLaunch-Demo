import { InstagramIcon, FacebookIcon, TikTokIcon } from '@/components/social-icons'
import { CONTACT } from '@/lib/data'

const FOOTER_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Programs', href: '#programs' },
  { label: 'Trainers', href: '#trainers' },
  { label: 'Membership', href: '#membership' },
  { label: 'Classes', href: '#programs' },
  { label: 'Contact', href: '#final-cta' },
]

const HOURS = [
  { day: 'Mon \u2013 Fri', time: '05:00 \u2013 23:00' },
  { day: 'Saturday', time: '07:00 \u2013 21:00' },
  { day: 'Sunday', time: '08:00 \u2013 18:00' },
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
            <span className="font-display text-2xl font-extrabold uppercase tracking-[0.14em] text-foreground">
              GYM<span className="text-accent">.</span>LAUNCH
            </span>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              A premium fitness club built for people who train with intent.
              Karachi&apos;s home for serious progress.
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
              {HOURS.map((h) => (
                <li key={h.day} className="flex flex-col text-sm">
                  <span className="text-foreground/80">{h.day}</span>
                  <span className="text-muted-foreground">{h.time}</span>
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
            &copy; {new Date().getFullYear()} GYM Launch. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Demo concept &middot; Karachi, Pakistan
          </p>
        </div>
      </div>
    </footer>
  )
}
