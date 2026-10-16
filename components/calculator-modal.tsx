'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { PLANS, PROGRAMS } from '@/lib/data'
import {
  ACTIVITY_LEVELS,
  GOALS,
  LIMITS,
  bmiCategory,
  calculateBmi,
  calculateCalories,
  calculateProtein,
  feetInchesToCm,
  hasNumber,
  healthyWeightRange,
  lbToKg,
  recommendFromBmi,
  recommendFromGoal,
  type Activity,
  type Goal,
  type Recommendation,
  type Sex,
} from '@/lib/calculators'
import { setScrollLock } from '@/lib/scroll-lock'
import { whatsappLinkProps } from '@/lib/whatsapp'
import { cn } from '@/lib/utils'

type ToolId = 'bmi' | 'calories' | 'protein'
type Units = 'metric' | 'imperial'

type Form = {
  units: Units
  sex: Sex
  age: string
  weight: string
  heightCm: string
  heightFt: string
  heightIn: string
  activity: Activity
  goal: Goal
}

const TOOLS: { id: ToolId; label: string; title: string; intro: string }[] = [
  { id: 'bmi', label: 'BMI', title: 'Body mass index', intro: 'A quick check of your weight against your height.' },
  { id: 'calories', label: 'Calories', title: 'Daily calories', intro: 'How much to eat each day for your goal.' },
  { id: 'protein', label: 'Protein', title: 'Daily protein', intro: 'How much protein supports your training.' },
]

const INITIAL: Form = {
  units: 'metric',
  sex: 'male',
  age: '',
  weight: '',
  heightCm: '',
  heightFt: '',
  heightIn: '',
  activity: 'moderate',
  goal: 'lose',
}

const inputClass =
  'w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

const labelClass = 'text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground'

type Measurements = { weightKg: number; heightCm: number; age: number }

function parseMeasurements(form: Form, tool: ToolId): { values: Measurements | null; error: string | null } {
  const weightInput = Number(form.weight)
  const weightKg = form.units === 'metric' ? weightInput : lbToKg(weightInput)
  const heightCm =
    form.units === 'metric'
      ? Number(form.heightCm)
      : feetInchesToCm(Number(form.heightFt), Number(form.heightIn || 0))
  const age = Number(form.age)

  if (!hasNumber(form.weight) || weightKg < LIMITS.weightKg.min || weightKg > LIMITS.weightKg.max) {
    return { values: null, error: 'Enter a weight between 35 and 250 kg (77 to 550 lb).' }
  }
  const heightFilled = form.units === 'metric' ? hasNumber(form.heightCm) : hasNumber(form.heightFt)
  if (!heightFilled || heightCm < LIMITS.heightCm.min || heightCm > LIMITS.heightCm.max) {
    return { values: null, error: 'Enter a height between 120 and 230 cm (about 3 ft 11 in to 7 ft 6 in).' }
  }
  if (tool === 'calories' && (!hasNumber(form.age) || age < LIMITS.age.min || age > LIMITS.age.max)) {
    return { values: null, error: 'This calculator is for ages 18 to 80.' }
  }
  return { values: { weightKg, heightCm, age }, error: null }
}

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: T
  options: { id: T; label: string }[]
  onChange: (id: T) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className={labelClass}>{label}</span>
      <div className="flex gap-1 rounded-full border border-border bg-background p-1" role="radiogroup" aria-label={label}>
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={value === option.id}
            onClick={() => onChange(option.id)}
            className={cn(
              'flex-1 rounded-full px-3 py-2 text-xs font-semibold transition-colors',
              value === option.id
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function NumberField({
  label,
  value,
  onChange,
  placeholder,
  unit,
  className,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder: string
  unit: string
  className?: string
}) {
  return (
    <label className={cn('flex flex-col gap-2', className)}>
      <span className={labelClass}>{label}</span>
      <span className="relative">
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(event) => onChange(event.target.value.replace(/[^0-9.]/g, '').slice(0, 6))}
          placeholder={placeholder}
          className={cn(inputClass, 'pr-12')}
        />
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
          {unit}
        </span>
      </span>
    </label>
  )
}

function Stat({ label, value, note, highlight }: { label: string; value: string; note?: string; highlight?: boolean }) {
  return (
    <div
      className={cn(
        'flex flex-col gap-1 rounded-xl border px-4 py-3.5',
        highlight ? 'border-accent bg-accent/10' : 'border-border bg-background/50',
      )}
    >
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="font-display text-2xl font-extrabold tabular-nums text-foreground">{value}</span>
      {note && <span className="text-xs text-muted-foreground">{note}</span>}
    </div>
  )
}

const BMI_SCALE = { min: 15, max: 40 }

function BmiGauge({ value }: { value: number }) {
  const clamped = Math.min(Math.max(value, BMI_SCALE.min), BMI_SCALE.max)
  const position = ((clamped - BMI_SCALE.min) / (BMI_SCALE.max - BMI_SCALE.min)) * 100
  const stops = [18.5, 25, 30].map((stop) => ((stop - BMI_SCALE.min) / (BMI_SCALE.max - BMI_SCALE.min)) * 100)
  return (
    <div className="flex flex-col gap-2" aria-hidden="true">
      <div className="relative h-2.5 w-full rounded-full bg-foreground/10">
        <div
          className="absolute inset-y-0 rounded-full bg-accent/35"
          style={{ left: `${stops[0]}%`, width: `${stops[1] - stops[0]}%` }}
        />
        <span
          className="absolute top-1/2 h-5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent"
          style={{ left: `${position}%` }}
        />
      </div>
      <div className="relative h-4 text-[10px] text-muted-foreground">
        {[18.5, 25, 30].map((stop, i) => (
          <span key={stop} className="absolute -translate-x-1/2 tabular-nums" style={{ left: `${stops[i]}%` }}>
            {stop}
          </span>
        ))}
      </div>
    </div>
  )
}

export function CalculatorModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [tool, setTool] = useState<ToolId>('bmi')
  const [form, setForm] = useState<Form>(INITIAL)
  const [submitted, setSubmitted] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    setScrollLock('calculator', true)
    dialogRef.current?.focus()
    return () => setScrollLock('calculator', false)
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const update = (patch: Partial<Form>) => {
    setForm((prev) => ({ ...prev, ...patch }))
    setSubmitted(false)
  }

  const selectTool = (id: ToolId) => {
    setTool(id)
    setSubmitted(false)
  }

  const parsed = useMemo(() => parseMeasurements(form, tool), [form, tool])
  const values = submitted ? parsed.values : null

  const outcome = useMemo(() => {
    if (!values) return null
    const { weightKg, heightCm, age } = values
    const goalLabel = GOALS.find((g) => g.id === form.goal)?.label.toLowerCase() ?? ''
    if (tool === 'bmi') {
      const bmi = calculateBmi(weightKg, heightCm)
      const category = bmiCategory(bmi)
      const rounded = Math.round(bmi * 10) / 10
      return {
        kind: 'bmi' as const,
        bmi: rounded,
        category,
        range: healthyWeightRange(heightCm),
        recommendation: recommendFromBmi(category.id),
        summary: `my BMI is ${rounded} (${category.label.toLowerCase()})`,
      }
    }
    if (tool === 'calories') {
      const calories = calculateCalories({ sex: form.sex, age, weightKg, heightCm, activity: form.activity })
      const target = calories[form.goal === 'lose' ? 'lose' : form.goal === 'gain' ? 'gain' : 'maintain']
      return {
        kind: 'calories' as const,
        calories,
        recommendation: recommendFromGoal(form.goal),
        summary: `my calculated target is about ${target.toLocaleString('en-US')} kcal a day (goal: ${goalLabel})`,
      }
    }
    const protein = calculateProtein({ weightKg, heightCm, activity: form.activity, goal: form.goal })
    return {
      kind: 'protein' as const,
      protein,
      recommendation: recommendFromGoal(form.goal),
      summary: `my protein target is ${protein.low} to ${protein.high} g a day (goal: ${goalLabel})`,
    }
  }, [values, tool, form.sex, form.activity, form.goal])

  if (!open) return null

  const active = TOOLS.find((t) => t.id === tool) ?? TOOLS[0]
  const needsAge = tool === 'calories'
  const needsActivity = tool !== 'bmi'
  const needsGoal = tool !== 'bmi'
  const showError = submitted && parsed.error

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-background/80 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
      data-lenis-prevent
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Fitness calculators"
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        className="relative flex max-h-[92svh] w-full max-w-xl flex-col overflow-y-auto overscroll-contain rounded-t-2xl border border-border bg-card p-6 shadow-2xl outline-none sm:rounded-2xl sm:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close calculators"
          className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-foreground/40"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>

        <p className="pr-12 text-xs font-semibold uppercase tracking-[0.2em] text-accent">Fitness calculators</p>

        <div
          className="mt-4 grid grid-cols-3 gap-1 rounded-full border border-border bg-background p-1"
          role="tablist"
          aria-label="Calculator type"
        >
          {TOOLS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={`calc-tab-${item.id}`}
              aria-selected={tool === item.id}
              aria-controls="calc-panel"
              onClick={() => selectTool(item.id)}
              className={cn(
                'rounded-full px-3 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] transition-colors',
                tool === item.id
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div id="calc-panel" role="tabpanel" aria-labelledby={`calc-tab-${tool}`} className="mt-6 flex flex-col gap-6">
          <div>
            <h3 className="font-display text-2xl font-extrabold uppercase leading-tight tracking-tight text-foreground sm:text-3xl">
              {active.title}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">{active.intro}</p>
          </div>

          <form onSubmit={submit} className="flex flex-col gap-5" noValidate>
            <Segmented
              label="Units"
              value={form.units}
              options={[
                { id: 'metric', label: 'kg / cm' },
                { id: 'imperial', label: 'lb / ft' },
              ]}
              onChange={(units) => update({ units })}
            />

            {needsAge && (
              <Segmented
                label="Sex"
                value={form.sex}
                options={[
                  { id: 'male', label: 'Male' },
                  { id: 'female', label: 'Female' },
                ]}
                onChange={(sex) => update({ sex })}
              />
            )}

            <div className="grid grid-cols-2 gap-4">
              {needsAge && (
                <NumberField
                  label="Age"
                  value={form.age}
                  onChange={(age) => update({ age })}
                  placeholder="25"
                  unit="yrs"
                  className="col-span-2"
                />
              )}
              <NumberField
                label="Weight"
                value={form.weight}
                onChange={(weight) => update({ weight })}
                placeholder={form.units === 'metric' ? '70' : '154'}
                unit={form.units === 'metric' ? 'kg' : 'lb'}
                className={form.units === 'metric' ? '' : 'col-span-2'}
              />
              {form.units === 'metric' ? (
                <NumberField
                  label="Height"
                  value={form.heightCm}
                  onChange={(heightCm) => update({ heightCm })}
                  placeholder="172"
                  unit="cm"
                />
              ) : (
                <>
                  <NumberField
                    label="Height"
                    value={form.heightFt}
                    onChange={(heightFt) => update({ heightFt })}
                    placeholder="5"
                    unit="ft"
                  />
                  <NumberField
                    label="Inches"
                    value={form.heightIn}
                    onChange={(heightIn) => update({ heightIn })}
                    placeholder="8"
                    unit="in"
                  />
                </>
              )}
            </div>

            {needsActivity && (
              <label className="flex flex-col gap-2">
                <span className={labelClass}>Activity level</span>
                <select
                  value={form.activity}
                  onChange={(event) => update({ activity: event.target.value as Activity })}
                  className={inputClass}
                >
                  {ACTIVITY_LEVELS.map((level) => (
                    <option key={level.id} value={level.id}>
                      {level.label} · {level.detail}
                    </option>
                  ))}
                </select>
              </label>
            )}

            {needsGoal && (
              <Segmented
                label="Goal"
                value={form.goal}
                options={GOALS}
                onChange={(goal) => update({ goal })}
              />
            )}

            {showError && (
              <p role="alert" className="text-sm text-accent">
                {parsed.error}
              </p>
            )}

            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-accent-foreground transition-all hover:brightness-110"
            >
              Calculate
            </button>
          </form>

          {outcome && (
            <div className="flex flex-col gap-5 border-t border-border pt-6" aria-live="polite">
              {outcome.kind === 'bmi' && (
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Stat label="Your BMI" value={String(outcome.bmi)} highlight />
                    <Stat label="Category" value={outcome.category.label} />
                  </div>
                  <BmiGauge value={outcome.bmi} />
                  <p className="text-sm text-foreground/90">
                    A healthy weight for your height is about {outcome.range[0]} to {outcome.range[1]} kg.
                  </p>
                </div>
              )}

              {outcome.kind === 'calories' && (
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-3 gap-3">
                    <Stat label="Lose fat" value={outcome.calories.lose.toLocaleString('en-US')} note="kcal / day" highlight={form.goal === 'lose'} />
                    <Stat label="Maintain" value={outcome.calories.maintain.toLocaleString('en-US')} note="kcal / day" highlight={form.goal === 'maintain'} />
                    <Stat label="Build muscle" value={outcome.calories.gain.toLocaleString('en-US')} note="kcal / day" highlight={form.goal === 'gain'} />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    At rest your body burns about {outcome.calories.bmr.toLocaleString('en-US')} kcal a day.
                    {outcome.calories.loseRaisedToFloor &&
                      ' The fat-loss target was raised to a safe minimum; do not eat below it without medical advice.'}
                  </p>
                </div>
              )}

              {outcome.kind === 'protein' && (
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Stat label="Per day" value={`${outcome.protein.low}–${outcome.protein.high} g`} highlight />
                    <Stat label="Per meal (4 meals)" value={`~${outcome.protein.perMeal} g`} />
                  </div>
                  {outcome.protein.basedOnReference && (
                    <p className="text-sm text-muted-foreground">
                      Calculated from a healthy reference weight for your height.
                    </p>
                  )}
                </div>
              )}

              <RecommendationCard recommendation={outcome.recommendation} summary={outcome.summary} onNavigate={onClose} />

              <p className="text-xs text-muted-foreground">
                Estimates for general guidance only, not medical advice. If you have a medical condition, are pregnant,
                or take medication, check with your doctor first.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function RecommendationCard({
  recommendation,
  summary,
  onNavigate,
}: {
  recommendation: Recommendation
  summary: string
  onNavigate: () => void
}) {
  const plan = PLANS.find((p) => p.id === recommendation.planId) ?? PLANS[0]
  const program = PROGRAMS.find((p) => p.name === recommendation.programName)

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-accent/40 bg-accent/5 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Suggested for you</p>
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
        <div className="flex-1">
          <p className="text-xs text-muted-foreground">Membership</p>
          <p className="font-display text-xl font-extrabold text-foreground">{plan.name}</p>
          <p className="text-sm text-foreground/80">PKR {plan.monthly.toLocaleString('en-US')} / month</p>
        </div>
        {program && (
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Program</p>
            <p className="font-display text-xl font-extrabold text-foreground">{program.name}</p>
            <p className="text-sm text-foreground/80">
              {program.duration} · {program.sessions}
            </p>
          </div>
        )}
      </div>
      <p className="text-sm text-foreground/90">{recommendation.reason}</p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <a
          {...whatsappLinkProps({
            intent: 'plan',
            source: 'calculator',
            plan: plan.name,
            price: plan.monthly,
            billing: 'monthly',
            message: `I used the calculator on your website and ${summary}. I’m interested in the ${plan.name} plan${program ? ` and the ${program.name} program` : ''}. What are the next steps?`,
          })}
          onClick={onNavigate}
          className="inline-flex flex-1 items-center justify-center rounded-full bg-accent px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-accent-foreground transition-all hover:brightness-110"
        >
          Enquire on WhatsApp
        </a>
        {program && (
          <a
            {...whatsappLinkProps({
              intent: 'program',
              source: 'calculator',
              program: program.name,
              message: `I used the calculator on your website and ${summary}. I’d like to know more about the ${program.name} program.`,
            })}
            onClick={onNavigate}
            className="inline-flex items-center justify-center rounded-full border border-border px-6 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-foreground transition-colors hover:border-foreground/40"
          >
            Ask about program
          </a>
        )}
      </div>
    </div>
  )
}
