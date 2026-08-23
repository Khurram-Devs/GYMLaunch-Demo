import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'secondary' | 'ghost'

type VoltButtonProps = {
  children: React.ReactNode
  href?: string
  variant?: Variant
  className?: string
  withArrow?: boolean
  ariaLabel?: string
}

const base =
  'group inline-flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] px-7 py-4 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background'

const variants: Record<Variant, string> = {
  primary:
    'bg-accent text-accent-foreground hover:brightness-110 hover:shadow-[0_0_40px_-8px_var(--accent)]',
  secondary:
    'border border-border bg-transparent text-foreground hover:border-foreground/40 hover:bg-foreground/5',
  ghost: 'text-foreground/70 hover:text-foreground px-2 py-1',
}

export function VoltButton({
  children,
  href = '#',
  variant = 'primary',
  className,
  withArrow = true,
  ariaLabel,
}: VoltButtonProps) {
  return (
    <a href={href} aria-label={ariaLabel} className={cn(base, variants[variant], className)}>
      <span>{children}</span>
      {withArrow && (
        <ArrowRight
          className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
          aria-hidden="true"
        />
      )}
    </a>
  )
}
