export type OfferIcon = 'users' | 'flower' | 'sunrise' | 'graduation' | 'calendar' | 'ticket'

export type OfferPricing = {
  pct: number
  plans?: string[]
  note: string
}

export type Offer = {
  id: string
  tag: string
  headline: string
  title: string
  summary: string
  stat: { value: string; label: string }
  icon: OfferIcon
  image: string
  imagePosition?: string
  perks: string[]
  steps: string[]
  terms: string[]
  validity: string
  claim: string
  pricing?: OfferPricing
}

export const OFFERS: Offer[] = [
  {
    id: 'buddy',
    tag: 'Buddy Offer',
    headline: 'Bring a friend — you both save 20%',
    title: 'Buddy Offer',
    summary:
      'Training is easier with someone who holds you accountable. Join together and both memberships drop by 20%.',
    stat: { value: '20%', label: 'off for you and your buddy' },
    icon: 'users',
    image: '/images/train-group.png',
    imagePosition: 'center 35%',
    perks: [
      '20% off any plan for both of you',
      'Free buddy guest pass for your first week',
      'Partner workouts planned by a coach',
      'Same start date, same billing day',
    ],
    steps: [
      'Tap Avail Offer and message us on WhatsApp',
      'Tell us who is joining with you',
      'Come in together to activate both memberships',
    ],
    terms: [
      'Both members must sign up on the same day.',
      'New memberships only. Cannot be combined with other offers.',
    ],
    validity: 'Limited-time offer',
    claim: '20% off for me and a friend joining together',
    pricing: { pct: 20, note: 'Per person, per month' },
  },
  {
    id: 'women',
    tag: 'Women’s Membership',
    headline: 'Women’s Membership — 15% off + dedicated women’s hours',
    title: 'Women’s Membership',
    summary:
      'A comfortable, supportive way to start. Train in reserved women’s hours with a coach-led introduction to the floor.',
    stat: { value: '15%', label: 'off any membership plan' },
    icon: 'flower',
    image: '/images/facility-functional.png',
    imagePosition: 'center 40%',
    perks: [
      '15% off any membership plan',
      'Dedicated women’s training hours',
      'Complimentary coach-led floor introduction',
      'Free fitness assessment on joining',
    ],
    steps: [
      'Tap Avail Offer and message us on WhatsApp',
      'Pick your preferred women’s hours',
      'Book your introduction session and get started',
    ],
    terms: [
      'Open to new female members.',
      'Women’s hours are subject to the posted schedule.',
    ],
    validity: 'Ongoing — new members',
    claim: '15% off, with training in the dedicated women’s hours',
    pricing: { pct: 15, note: 'Per month' },
  },
  {
    id: 'early-bird',
    tag: 'Early Bird',
    headline: 'Train 5–8 AM on weekdays and save 10%',
    title: 'Early-Bird Discount',
    summary:
      'Beat the traffic and the crowd. Commit to early-morning sessions and get the quietest floor of the day for less.',
    stat: { value: '10%', label: 'off for 5–8 AM members' },
    icon: 'sunrise',
    image: '/images/facility-cardio.png',
    imagePosition: 'center 55%',
    perks: [
      '10% off any plan while you train 5–8 AM',
      'Quietest hours: more space, shorter waits',
      'Priority booking for early group classes',
      'Free shaker with your first month',
    ],
    steps: [
      'Tap Avail Offer and message us on WhatsApp',
      'Choose your early-morning plan',
      'Show up before 8 AM and the discount applies',
    ],
    terms: [
      'Discount applies to Monday–Friday sessions starting 5:00–8:00 AM.',
      'Plan reverts to standard pricing if you switch to peak hours.',
    ],
    validity: 'Limited-time offer',
    claim: '10% off for training between 5 and 8 AM on weekdays',
    pricing: { pct: 10, note: 'Per month, for 5–8 AM sessions' },
  },
  {
    id: 'student',
    tag: 'Student Discount',
    headline: 'Students save 25% — bring your ID',
    title: 'Student Discount',
    summary:
      'Serious training on a student budget. Show a valid student ID and unlock our biggest discount on Essential and Performance.',
    stat: { value: '25%', label: 'off with a valid student ID' },
    icon: 'graduation',
    image: '/images/about-secondary.png',
    imagePosition: 'center 40%',
    perks: [
      '25% off Essential and Performance plans',
      'Free fitness assessment and starter program',
      'Flexible exam-season freeze option',
      'Bring a classmate for a free guest day',
    ],
    steps: [
      'Tap Avail Offer and message us on WhatsApp',
      'Share your university or college name',
      'Bring your student ID when you join',
    ],
    terms: [
      'A valid student ID is required at sign-up and at renewal.',
      'Applies to Essential and Performance plans only.',
    ],
    validity: 'Ongoing — verified students',
    claim: '25% off with my valid student ID',
    pricing: { pct: 25, plans: ['essential', 'performance'], note: 'Per month, Essential and Performance' },
  },
  {
    id: 'annual',
    tag: 'Annual Saver',
    headline: 'Pay yearly, save 15% + 2 free PT sessions',
    title: 'Annual Saver',
    summary:
      'Lock in your commitment for the year. Yearly billing already saves 15%, and we add two personal training sessions on top.',
    stat: { value: '15%', label: 'off + 2 free PT sessions' },
    icon: 'calendar',
    image: '/images/train-personal.png',
    imagePosition: 'center 30%',
    perks: [
      '15% off with yearly billing',
      '2 complimentary personal training sessions',
      'Price locked for 12 months',
      'Priority support from the front desk',
    ],
    steps: [
      'Tap Avail Offer and message us on WhatsApp',
      'Choose your plan on yearly billing',
      'Book your two free PT sessions with a coach',
    ],
    terms: [
      'Price shown is the per-month equivalent, billed annually.',
      'Free PT sessions must be used within the first 60 days.',
    ],
    validity: 'Limited-time offer',
    claim: '15% off on yearly billing plus 2 free personal training sessions',
    pricing: { pct: 15, note: 'Per month, billed yearly' },
  },
  {
    id: 'free-pass',
    tag: 'Free Pass',
    headline: 'Try us free — claim your 3-day guest pass',
    title: '3-Day Free Pass',
    summary:
      'Not sure yet? Train for three days on us. Use the full floor, join classes and meet the coaches before you commit.',
    stat: { value: '3', label: 'days of full access, free' },
    icon: 'ticket',
    image: '/images/facility-recovery.png',
    imagePosition: 'center 45%',
    perks: [
      'Full gym floor and class access for 3 days',
      'Recovery area included: sauna and cold immersion',
      'Quick facility tour with a coach',
      'No payment details needed',
    ],
    steps: [
      'Tap Avail Offer and message us on WhatsApp',
      'Pick your three training days',
      'Walk in with your ID and start training',
    ],
    terms: [
      'One free pass per person. New visitors only.',
      'Valid government-issued ID required at the front desk.',
    ],
    validity: 'Limited-time offer',
    claim: 'try the gym free for 3 days',
  },
]
