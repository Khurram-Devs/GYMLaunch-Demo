import { BRAND, wordmarkParts } from '@/lib/brand'
import { cn } from '@/lib/utils'

type BrandMarkProps = {
  className?: string
  textClassName?: string
  logoClassName?: string
}

export function BrandMark({ className, textClassName, logoClassName }: BrandMarkProps) {
  const parts = wordmarkParts(BRAND.name)
  const showText = !BRAND.logoSrc || !BRAND.logoIncludesName

  return (
    <span className={cn('inline-flex items-center gap-3', className)}>
      {BRAND.logoSrc && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={BRAND.logoSrc}
          alt={showText ? '' : BRAND.name}
          className={cn('h-8 w-auto object-contain', logoClassName)}
        />
      )}
      {showText && (
        <span
          className={cn(
            'font-display font-extrabold uppercase tracking-[0.18em] text-foreground',
            textClassName,
          )}
        >
          {parts ? (
            <>
              {parts[0]}
              <span className="text-accent">.</span>
              {parts[1]}
            </>
          ) : (
            BRAND.name
          )}
        </span>
      )}
    </span>
  )
}
