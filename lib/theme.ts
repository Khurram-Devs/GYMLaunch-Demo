type Oklch = { l: number; c: number; h: number }

const DEFAULT_HUE = 260
const MIN_ACCENT_LIGHTNESS = 0.62

const toLinear = (v: number) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)
const toSrgb = (v: number) => {
  const c = Math.min(1, Math.max(0, v))
  return c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055
}

export function parseHex(hex: string): [number, number, number] {
  const value = hex.trim().replace(/^#/, '')
  const full = value.length === 3 ? value.replace(/./g, '$&$&') : value
  if (!/^[0-9a-fA-F]{6}$/.test(full)) throw new Error(`Invalid primaryColor "${hex}"`)
  const n = parseInt(full, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function srgbToOklch([r8, g8, b8]: [number, number, number]): Oklch {
  const r = toLinear(r8 / 255)
  const g = toLinear(g8 / 255)
  const b = toLinear(b8 / 255)
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
  const h = (Math.atan2(B, A) * 180) / Math.PI
  return { l: L, c: Math.hypot(A, B), h: h < 0 ? h + 360 : h }
}

function oklchToSrgb({ l: L, c, h }: Oklch): [number, number, number] {
  const a = c * Math.cos((h * Math.PI) / 180)
  const b = c * Math.sin((h * Math.PI) / 180)
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3
  return [
    toSrgb(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    toSrgb(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    toSrgb(-0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s),
  ]
}

function luminance([r, g, b]: [number, number, number]) {
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)
}

const contrast = (a: number, b: number) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)

const fmt = (n: number) => Number(n.toFixed(4))

export function buildThemeVars(primaryColor: string): Record<string, string> {
  const rgb = parseHex(primaryColor)
  const base = srgbToOklch(rgb)
  const hue = base.c < 0.02 ? DEFAULT_HUE : base.h

  const accent: Oklch = { l: Math.max(base.l, MIN_ACCENT_LIGHTNESS), c: Math.min(base.c, 0.32), h: base.h }
  const accentCss =
    base.l >= MIN_ACCENT_LIGHTNESS
      ? `#${rgb.map((v) => v.toString(16).padStart(2, '0')).join('')}`
      : `oklch(${fmt(accent.l)} ${fmt(accent.c)} ${fmt(accent.h)})`

  const accentLum =
    base.l >= MIN_ACCENT_LIGHTNESS
      ? luminance([rgb[0] / 255, rgb[1] / 255, rgb[2] / 255])
      : luminance(oklchToSrgb(accent))
  const darkInk = oklch(0.17, 0.02, hue)
  const onAccent = contrast(accentLum, 0) >= contrast(accentLum, 1) ? darkInk : 'oklch(0.99 0 0)'

  return {
    '--accent': accentCss,
    '--accent-foreground': onAccent,
    '--background': oklch(0.16, 0.008, hue),
    '--foreground': oklch(0.96, 0.004, hue),
    '--card': oklch(0.2, 0.008, hue),
    '--card-foreground': oklch(0.96, 0.004, hue),
    '--muted': oklch(0.24, 0.008, hue),
    '--muted-foreground': oklch(0.66, 0.01, hue),
    '--primary': oklch(0.96, 0.004, hue),
    '--primary-foreground': oklch(0.16, 0.008, hue),
  }
}

function oklch(l: number, c: number, h: number) {
  return `oklch(${l} ${c} ${fmt(h)})`
}
