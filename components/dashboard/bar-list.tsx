type BarListProps = {
  items: { label: string; value: number }[]
  unit?: string
}

export function BarList({ items, unit = '%' }: BarListProps) {
  const max = Math.max(...items.map((item) => item.value), 1)
  return (
    <ul className="flex flex-col gap-4">
      {items.map((item) => (
        <li key={item.label} className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between text-sm">
            <span className="text-foreground/90">{item.label}</span>
            <span className="font-semibold tabular-nums text-foreground">
              {item.value}
              {unit}
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-foreground/10" aria-hidden="true">
            <div
              className="h-full rounded-full bg-accent"
              style={{ width: `${(item.value / max) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  )
}
