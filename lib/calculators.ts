export type Sex = 'male' | 'female'
export type Activity = 'sedentary' | 'light' | 'moderate' | 'active' | 'athlete'
export type Goal = 'lose' | 'maintain' | 'gain'
export type BmiCategoryId = 'under' | 'healthy' | 'over' | 'obese'

export const ACTIVITY_LEVELS: { id: Activity; label: string; detail: string; factor: number }[] = [
  { id: 'sedentary', label: 'Mostly sitting', detail: 'Desk job, little exercise', factor: 1.2 },
  { id: 'light', label: 'Lightly active', detail: '1–3 workouts a week', factor: 1.375 },
  { id: 'moderate', label: 'Moderately active', detail: '3–5 workouts a week', factor: 1.55 },
  { id: 'active', label: 'Very active', detail: '6–7 workouts a week', factor: 1.725 },
  { id: 'athlete', label: 'Athlete', detail: 'Hard training twice a day', factor: 1.9 },
]

export const GOALS: { id: Goal; label: string }[] = [
  { id: 'lose', label: 'Lose fat' },
  { id: 'maintain', label: 'Stay the same' },
  { id: 'gain', label: 'Build muscle' },
]

export const LIMITS = {
  age: { min: 18, max: 80 },
  weightKg: { min: 35, max: 250 },
  heightCm: { min: 120, max: 230 },
}

const KG_PER_LB = 0.45359237
const CM_PER_INCH = 2.54

export const lbToKg = (lb: number) => lb * KG_PER_LB
export const feetInchesToCm = (feet: number, inches: number) => (feet * 12 + inches) * CM_PER_INCH

const round = (value: number, step = 1) => Math.round(value / step) * step

export function calculateBmi(weightKg: number, heightCm: number) {
  const meters = heightCm / 100
  return weightKg / (meters * meters)
}

export function bmiCategory(value: number): { id: BmiCategoryId; label: string } {
  if (value < 18.5) return { id: 'under', label: 'Underweight' }
  if (value < 25) return { id: 'healthy', label: 'Healthy range' }
  if (value < 30) return { id: 'over', label: 'Overweight' }
  return { id: 'obese', label: 'Obese range' }
}

export function healthyWeightRange(heightCm: number): [number, number] {
  const squared = (heightCm / 100) ** 2
  return [Math.round(18.5 * squared), Math.round(24.9 * squared)]
}

type CalorieInput = { sex: Sex; age: number; weightKg: number; heightCm: number; activity: Activity }

export function calculateCalories({ sex, age, weightKg, heightCm, activity }: CalorieInput) {
  const bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + (sex === 'male' ? 5 : -161)
  const factor = ACTIVITY_LEVELS.find((level) => level.id === activity)?.factor ?? 1.2
  const maintain = bmr * factor
  const floor = sex === 'male' ? 1500 : 1200
  const rawLose = maintain * 0.8
  return {
    bmr: round(bmr, 10),
    maintain: round(maintain, 10),
    lose: round(Math.max(rawLose, floor), 10),
    gain: round(maintain * 1.1, 10),
    loseRaisedToFloor: rawLose < floor,
  }
}

type ProteinInput = { weightKg: number; heightCm: number; activity: Activity; goal: Goal }

export function calculateProtein({ weightKg, heightCm, activity, goal }: ProteinInput) {
  const referenceKg = Math.min(weightKg, 25 * (heightCm / 100) ** 2)
  const lowActivity = activity === 'sedentary' || activity === 'light'
  const perKg: Record<Goal, [number, number]> = {
    lose: [1.8, 2.2],
    gain: [1.6, 2.0],
    maintain: lowActivity ? [1.0, 1.3] : [1.2, 1.6],
  }
  const [lowPerKg, highPerKg] = perKg[goal]
  const low = round(referenceKg * lowPerKg, 5)
  const high = round(referenceKg * highPerKg, 5)
  const middle = (low + high) / 2
  return {
    low,
    high,
    perMeal: round(middle / 4, 1),
    basedOnReference: referenceKg < weightKg,
  }
}

export type Recommendation = { planId: string; programName: string; reason: string }

export function recommendFromBmi(category: BmiCategoryId): Recommendation {
  switch (category) {
    case 'under':
      return {
        planId: 'performance',
        programName: 'Hypertrophy',
        reason: 'A structured muscle-building program helps you gain healthy weight steadily.',
      }
    case 'healthy':
      return {
        planId: 'essential',
        programName: 'Strength & Conditioning',
        reason: 'You are in a healthy range, so build strength and stamina with a consistent routine.',
      }
    default:
      return {
        planId: 'performance',
        programName: 'Functional Fitness',
        reason: 'A guided plan with a personalised program keeps fat loss steady and sustainable.',
      }
  }
}

export function recommendFromGoal(goal: Goal): Recommendation {
  switch (goal) {
    case 'lose':
      return {
        planId: 'elite',
        programName: 'Functional Fitness',
        reason: 'Elite includes nutrition guidance, which matters most when you are cutting calories.',
      }
    case 'gain':
      return {
        planId: 'elite',
        programName: 'Hypertrophy',
        reason: 'Elite includes nutrition guidance to help you hit your calories and protein.',
      }
    default:
      return {
        planId: 'essential',
        programName: 'Strength & Conditioning',
        reason: 'Essential covers everything you need to stay consistent and keep your current shape.',
      }
  }
}

export const hasNumber = (value: string) => value.trim() !== '' && Number.isFinite(Number(value))
