import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Archivo } from 'next/font/google'
import './globals.css'
import { BRAND } from '@/lib/brand'
import { LeadTracker } from '@/components/lead-tracker'
import { LoadingScreen } from '@/components/loading-screen'
import { WhatsAppButton } from '@/components/whatsapp-button'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-archivo',
  weight: ['500', '600', '700', '800', '900'],
  display: 'swap',
})

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://gymlaunch.com'

const TITLE = `${BRAND.name} \u2014 ${BRAND.tagline} in ${BRAND.city}`
const OG_DESCRIPTION =
  'Train hard. Become more. A premium training environment built for people who don\u2019t settle.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: `%s \u2014 ${BRAND.name}`,
  },
  description: `${BRAND.name} is a premium modern fitness club in ${BRAND.city} built for people who train with intent. Expert coaching, elite equipment, 24/7 access.`,
  keywords: ['gym', 'fitness', BRAND.city, 'personal training', 'strength', BRAND.name],
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: TITLE,
    description: OG_DESCRIPTION,
    url: SITE_URL,
    siteName: BRAND.name,
    type: 'website',
    images: ['/images/hero.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: OG_DESCRIPTION,
    images: ['/images/hero.png'],
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0a0a0b',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${archivo.variable} bg-background`}
      style={BRAND.themeVars as React.CSSProperties}
    >
      <body className="antialiased">
        <LoadingScreen />
        <LeadTracker />
        {children}
        <WhatsAppButton />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
