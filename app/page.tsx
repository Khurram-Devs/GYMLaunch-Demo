import { Navigation } from '@/components/navigation'
import { Hero } from '@/components/sections/hero'
import { Metrics } from '@/components/sections/metrics'
import { About } from '@/components/sections/about'
import { TrainingExperience } from '@/components/sections/training-experience'
import { Programs } from '@/components/sections/programs'
import { Membership } from '@/components/sections/membership'
import { ConversionCta } from '@/components/sections/conversion-cta'
import { Trainers } from '@/components/sections/trainers'
import { Schedule } from '@/components/sections/schedule'
import { Facilities } from '@/components/sections/facilities'
import { Testimonials } from '@/components/sections/testimonials'
import { FinalCta } from '@/components/sections/final-cta'
import { Footer } from '@/components/footer'

export default function Page() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <Metrics />
        <About />
        <TrainingExperience />
        <Programs />
        <Membership />
        <ConversionCta />
        <Trainers />
        <Schedule />
        <Facilities />
        <Testimonials />
        <FinalCta />
      </main>
      <Footer />
    </>
  )
}
