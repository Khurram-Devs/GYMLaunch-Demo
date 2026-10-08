const COLS = 9
const ROWS = 6
const BLOCK_W = 78
const BLOCK_H = 78
const GAP = 12
const ORIGIN_X = 6
const ORIGIN_Y = 6

const PARK = { col: 5, row: 1 }

export function MapPlaceholder() {
  const blocks = []
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const isPark = col === PARK.col && row === PARK.row
      blocks.push(
        <rect
          key={`${col}-${row}`}
          x={ORIGIN_X + col * (BLOCK_W + GAP)}
          y={ORIGIN_Y + row * (BLOCK_H + GAP)}
          width={BLOCK_W}
          height={BLOCK_H}
          rx={6}
          fill={isPark ? 'var(--accent)' : 'var(--card)'}
          fillOpacity={isPark ? 0.14 : 1}
        />,
      )
    }
  }

  return (
    <svg
      viewBox="0 0 800 560"
      className="absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <rect width="800" height="560" fill="var(--muted)" />
      {blocks}
      <path d="M0 330 L800 210" stroke="var(--muted-foreground)" strokeOpacity={0.35} strokeWidth={10} />
      <path d="M250 0 L430 560" stroke="var(--muted-foreground)" strokeOpacity={0.25} strokeWidth={8} />
      <g transform="translate(400 262)">
        <circle r="46" fill="var(--accent)" fillOpacity={0.16} />
        <circle r="26" fill="var(--accent)" fillOpacity={0.28} />
        <path
          d="M0 -34 C-15 -34 -26 -23 -26 -9 C-26 9 0 32 0 32 C0 32 26 9 26 -9 C26 -23 15 -34 0 -34 Z"
          fill="var(--accent)"
        />
        <circle cy="-10" r="9" fill="var(--accent-foreground)" />
      </g>
    </svg>
  )
}
