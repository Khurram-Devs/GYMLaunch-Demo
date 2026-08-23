import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Archivo } from 'next/font/google'
import './globals.css'

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

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'GYM LAUNCH — Premium Fitness Club in Karachi',
    template: '%s — GYM LAUNCH',
  },
  description:
    'GYM LAUNCH is a premium modern fitness club in Karachi built for people who train with intent. Expert coaching, elite equipment, 24/7 access.',
  keywords: [
    'gym',
    'fitness',
    'Karachi',
    'personal training',
    'strength',
    'GYM LAUNCH',
  ],
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
    title: 'GYM LAUNCH — Premium Fitness Club in Karachi',
    description:
      'Train hard. Become more. A premium training environment built for people who don\u2019t settle.',
    url: SITE_URL,
    siteName: 'GYM LAUNCH',
    type: 'website',
    images: ['/images/hero.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GYM LAUNCH — Premium Fitness Club in Karachi',
    description:
      'Train hard. Become more. A premium training environment built for people who don\u2019t settle.',
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
    <html lang="en" className={`${inter.variable} ${archivo.variable} bg-background`}>
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
