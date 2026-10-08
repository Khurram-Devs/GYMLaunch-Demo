# Rebranding the demo for a gym

Edit `gym.config.json`, then restart `npm run dev` (or rebuild). Everything else follows.

| Key | What it does |
| --- | --- |
| `name` | Gym name everywhere: nav, headings, WhatsApp messages, page title |
| `logo` | File name inside `public/brand/` (e.g. `logo.png`). Empty shows a text wordmark |
| `logoIncludesName` | `true` if the logo image already contains the gym name |
| `primaryColor` | Hex color. Accent, button text color and dark surface tints are derived from it |
| `city`, `country`, `address` | Hero label, location section, directions link |
| `phone`, `whatsapp`, `email` | Call, WhatsApp (`wa.me`, digits only) and email links |
| `timezone`, `hours` | Drives the "Open now" badge and the hours table |
| `rating` | Stars, score and review count in the location section |
| `mapImage` | File name inside `public/brand/` (screenshot of the gym on a map). Empty shows an offline placeholder |
| `directionsUrl` | Optional. Defaults to a Google Maps search for the address |

Notes:
- Very dark primary colors are lightened slightly so text stays readable on the dark theme.
- `npm run dev` and `npm run build` validate the config and fail with a clear message if something is wrong.
- Owner dashboard preview: `/dashboard`. Clicks on any WhatsApp button show up there as live demo leads.
- For offline pitching, run `npm run build && npm start` once while online so fonts are bundled.
