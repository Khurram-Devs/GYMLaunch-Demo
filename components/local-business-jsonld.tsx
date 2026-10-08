import { BRAND } from '@/lib/brand'

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export function LocalBusinessJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'ExerciseGym',
    name: BRAND.name,
    address: BRAND.address,
    telephone: BRAND.phone,
    email: BRAND.email,
    openingHoursSpecification: BRAND.hours.map((group) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: group.days.map((d) => DAY_NAMES[d]),
      opens: group.open,
      closes: group.close,
    })),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: BRAND.rating.score,
      reviewCount: BRAND.rating.reviews,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}
