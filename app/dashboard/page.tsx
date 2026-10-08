import type { Metadata } from 'next'
import { DashboardView } from '@/components/dashboard/dashboard-view'

export const metadata: Metadata = {
  title: 'Owner dashboard (demo)',
  robots: { index: false, follow: false },
}

export default function DashboardPage() {
  return <DashboardView />
}
