export const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Programs', href: '#programs' },
  { label: 'Membership', href: '#membership' },
  { label: 'Trainers', href: '#trainers' },
] as const

export const METRICS = [
  { value: 2500, suffix: '+', label: 'Active Members' },
  { value: 40, suffix: '+', label: 'Expert Trainers' },
  { value: 12, suffix: '', label: 'Specialized Programs' },
  { value: 24, suffix: '/7', label: 'Facility Access' },
] as const

export type TrainingPanel = {
  id: string
  title: string
  description: string
  image: string
}

export const TRAINING_PANELS: TrainingPanel[] = [
  {
    id: 'strength',
    title: 'Strength',
    description:
      'Barbell fundamentals and progressive overload in a fully equipped platform zone.',
    image: '/images/facility-strength.png',
  },
  {
    id: 'conditioning',
    title: 'Conditioning',
    description:
      'High-output circuits engineered to build engine, resilience and pace.',
    image: '/images/train-conditioning.png',
  },
  {
    id: 'functional',
    title: 'Functional Training',
    description:
      'Movement-first sessions that translate directly into everyday strength.',
    image: '/images/facility-functional.png',
  },
  {
    id: 'personal',
    title: 'Personal Training',
    description:
      'One-to-one coaching tailored to your body, your goals and your schedule.',
    image: '/images/train-personal.png',
  },
  {
    id: 'recovery',
    title: 'Recovery',
    description:
      'Sauna, cold immersion and mobility work to keep you training longer.',
    image: '/images/facility-recovery.png',
  },
  {
    id: 'group',
    title: 'Group Classes',
    description:
      'Coach-led sessions with the energy of a team pushing in the same direction.',
    image: '/images/train-group.png',
  },
]

export type Program = {
  number: string
  name: string
  description: string
  difficulty: string
  duration: string
}

export const PROGRAMS: Program[] = [
  {
    number: '01',
    name: 'Strength & Conditioning',
    description:
      'A foundational block combining heavy compound lifting with metabolic conditioning.',
    difficulty: 'All levels',
    duration: '8 weeks',
  },
  {
    number: '02',
    name: 'Hypertrophy',
    description:
      'Volume-focused training designed to build lean, controlled muscle mass.',
    difficulty: 'Intermediate',
    duration: '12 weeks',
  },
  {
    number: '03',
    name: 'Functional Fitness',
    description:
      'Full-body movement patterns that build usable, athletic strength.',
    difficulty: 'All levels',
    duration: '6 weeks',
  },
  {
    number: '04',
    name: 'Athletic Performance',
    description:
      'Speed, power and explosiveness programming for competitive athletes.',
    difficulty: 'Advanced',
    duration: '10 weeks',
  },
  {
    number: '05',
    name: 'Personal Training',
    description:
      'Fully bespoke coaching built around your assessment and objectives.',
    difficulty: 'Tailored',
    duration: 'Ongoing',
  },
]

export type Plan = {
  id: string
  name: string
  monthly: number
  yearly: number
  blurb: string
  features: string[]
  cta: string
  featured?: boolean
}

export const PLANS: Plan[] = [
  {
    id: 'essential',
    name: 'Essential',
    monthly: 8000,
    yearly: 6800,
    blurb: 'Everything you need to build a consistent routine.',
    features: [
      'Full gym access',
      'Standard equipment',
      'Locker access',
      'Basic fitness assessment',
    ],
    cta: 'Choose Essential',
  },
  {
    id: 'performance',
    name: 'Performance',
    monthly: 12000,
    yearly: 10200,
    blurb: 'For members who want structure, guidance and results.',
    features: [
      'Full gym access',
      'All group classes',
      'Detailed fitness assessment',
      'Personalized training program',
      'Premium locker access',
    ],
    cta: 'Choose Performance',
    featured: true,
  },
  {
    id: 'elite',
    name: 'Elite',
    monthly: 18000,
    yearly: 15300,
    blurb: 'The complete GYM LAUNCH experience, with dedicated support.',
    features: [
      'Unlimited gym access',
      'All group classes',
      'Personal training sessions',
      'Nutrition guidance',
      'Priority support',
      'Premium locker',
    ],
    cta: 'Go Elite',
  },
]

export type Trainer = {
  name: string
  role: string
  experience: string
  image: string
}

export const TRAINERS: Trainer[] = [
  {
    name: 'Alex Khan',
    role: 'Head Strength Coach',
    experience: '14 yrs',
    image: '/images/trainer-alex.png',
  },
  {
    name: 'Hamza Rahman',
    role: 'Performance Coach',
    experience: '9 yrs',
    image: '/images/trainer-hamza.png',
  },
  {
    name: 'Maya Ahmed',
    role: 'Functional Training Coach',
    experience: '7 yrs',
    image: '/images/trainer-maya.png',
  },
  {
    name: 'Danish Ali',
    role: 'Personal Trainer',
    experience: '6 yrs',
    image: '/images/trainer-danish.png',
  },
]

export type ClassSlot = {
  time: string
  title: string
  type: string
  coach: string
}

export const SCHEDULE: Record<string, ClassSlot[]> = {
  Mon: [
    { time: '06:00', title: 'Strength', type: 'Strength', coach: 'Alex Khan' },
    { time: '08:00', title: 'HIIT Burn', type: 'HIIT', coach: 'Danish Ali' },
    { time: '18:00', title: 'Functional Flow', type: 'Functional', coach: 'Maya Ahmed' },
    { time: '20:00', title: 'Boxing', type: 'Boxing', coach: 'Hamza Rahman' },
  ],
  Tue: [
    { time: '07:00', title: 'Conditioning', type: 'Conditioning', coach: 'Hamza Rahman' },
    { time: '18:00', title: 'Strength', type: 'Strength', coach: 'Alex Khan' },
    { time: '19:30', title: 'Mobility Reset', type: 'Mobility', coach: 'Maya Ahmed' },
  ],
  Wed: [
    { time: '06:00', title: 'Power Hour', type: 'Strength', coach: 'Alex Khan' },
    { time: '08:00', title: 'HIIT Burn', type: 'HIIT', coach: 'Danish Ali' },
    { time: '18:00', title: 'Boxing', type: 'Boxing', coach: 'Hamza Rahman' },
  ],
  Thu: [
    { time: '07:00', title: 'Functional Flow', type: 'Functional', coach: 'Maya Ahmed' },
    { time: '18:00', title: 'Conditioning', type: 'Conditioning', coach: 'Hamza Rahman' },
    { time: '20:00', title: 'Mobility Reset', type: 'Mobility', coach: 'Maya Ahmed' },
  ],
  Fri: [
    { time: '06:00', title: 'Strength', type: 'Strength', coach: 'Alex Khan' },
    { time: '17:30', title: 'HIIT Burn', type: 'HIIT', coach: 'Danish Ali' },
    { time: '19:00', title: 'Boxing', type: 'Boxing', coach: 'Hamza Rahman' },
  ],
  Sat: [
    { time: '08:00', title: 'Weekend Grind', type: 'Conditioning', coach: 'Danish Ali' },
    { time: '10:00', title: 'Functional Flow', type: 'Functional', coach: 'Maya Ahmed' },
  ],
  Sun: [
    { time: '09:00', title: 'Mobility Reset', type: 'Mobility', coach: 'Maya Ahmed' },
    { time: '11:00', title: 'Open Training', type: 'Strength', coach: 'Alex Khan' },
  ],
}

export const SCHEDULE_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const

export type Facility = {
  name: string
  caption: string
  image: string
}

export const FACILITIES: Facility[] = [
  {
    name: 'Strength Zone',
    caption: 'Competition racks, platforms and calibrated plates.',
    image: '/images/facility-strength.png',
  },
  {
    name: 'Cardio Area',
    caption: 'Premium machines facing floor-to-ceiling glass.',
    image: '/images/facility-cardio.png',
  },
  {
    name: 'Functional Zone',
    caption: 'Turf track, rigs, ropes and open training space.',
    image: '/images/facility-functional.png',
  },
  {
    name: 'Recovery Area',
    caption: 'Sauna, cold immersion and dedicated mobility space.',
    image: '/images/facility-recovery.png',
  },
  {
    name: 'Locker Rooms',
    caption: 'Spacious, spa-grade changing facilities.',
    image: '/images/facility-locker.png',
  },
]

export type Testimonial = {
  quote: string
  name: string
  meta: string
  stat: string
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'GYM LAUNCH completely changed how I approach training. The environment makes consistency feel effortless, and the coaching is genuinely world class.',
    name: 'Hamza',
    meta: 'Member since 2024',
    stat: 'Trains 5x / week',
  },
  {
    quote:
      'I have trained at plenty of gyms in Karachi. Nothing comes close to this. The space, the people, the standard \u2014 it pushes you.',
    name: 'Sana',
    meta: 'Member since 2023',
    stat: '+12kg strength gain',
  },
  {
    quote:
      'The trainers actually care about your progress. My program was built around my goals and adjusted every few weeks. Real results.',
    name: 'Bilal',
    meta: 'Member since 2025',
    stat: 'First marathon done',
  },
]

export const CONTACT = {
  location: 'Karachi, Pakistan',
  phone: '+92 300 1234567',
  email: 'hello@gymlaunch.pk',
}
