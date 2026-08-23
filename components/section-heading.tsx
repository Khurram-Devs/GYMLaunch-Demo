import { cn } from '@/lib/utils'
import { Reveal } from '@/components/reveal'

type SectionHeadingProps = {
  eyebrow: string
  title: React.ReactNode
  className?: string
  align?: 'left' | 'center'
}

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-accent',
        className,
      )}
    >
      <span className="h-px w-6 bg-accent" aria-hidden="true" />
      {children}
    </span>
  )
}

export function SectionHeading({ eyebrow, title, className, align = 'left' }: SectionHeadingProps) {
  return (
    <Reveal
      className={cn(
        'flex flex-col gap-5',
        align === 'center' && 'items-center text-center',
        className,
      )}
    >
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="font-display text-4xl font-extrabold uppercase leading-[0.95] tracking-tight text-balance sm:text-5xl lg:text-6xl">
        {title}
      </h2>
    </Reveal>
  )
}
