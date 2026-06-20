# Design System

Single source of truth for colors used across the site. All tokens are defined as CSS custom properties on `:root` in `src/styles/global.css` — use the variables, never raw hex codes.

## Color tokens

| Token | Hex | Family | Purpose |
|---|---|---|---|
| `--sage` | `#7a9e7e` | Primary brand | Date boxes, primary buttons (`Book a Visit`), focused accents |
| `--sage-light` | `#a8c5ac` | Primary brand | "Free" badges, secondary accents |
| `--sage-dark` | `#4e7153` | Primary brand | Hover states for sage elements |
| `--blush` | `#e8b4a0` | Soft accent | Decorative borders, secondary button border |
| `--blush-light` | `#f5d5c8` | Soft accent | Price badges, gentle pill backgrounds |
| `--plum` | `#8a5a7a` | CTA accent | High-intent action buttons (RSVP, etc.) — use sparingly |
| `--forest` | `#3f4a3a` | Grounding text | Deep forest. Headings (section titles, hero, card titles) and primary button hover state. |
| `--ink` | `#2a3429` | Primary buttons | Near-black forest. "Book a Visit", "Request Reservation", newsletter subscribe — anywhere we want a strong, dark action. |
| `--surface-deep` | `#e4ece1` | Tinted surface | Booking card and footer backgrounds. Soft sage-tinted neutral that distinguishes these zones from the page without dominating the screen with darkness. |
| `--text` | `#3a2e28` | Text | Default body text |
| `--text-muted` | `#4a3f38` | Text | Secondary text, captions, helper copy |
| `--cream` | `#fdf6ec` | Surface | Page sections that need warmth; nested card backgrounds |
| `--warm-white` | `#fffdf9` | Surface | Default page background, primary card surface |
| `--border` | `#e8ddd4` | Border | Hairline borders on cards and inputs |

## Usage rules

- **Sage = brand identity.** Date boxes, soft brand accents, section labels.
- **Ink = primary action.** Nav "Book a Visit", `.btn-primary`, `.btn-book`, newsletter subscribe. Dark, anchoring, high contrast against light surfaces.
- **Plum = secondary CTA.** Reserved for buttons where we want a *different kind* of urgency — RSVP to external events, future "Donate". Distinct from primary actions so it stands out as a different intent.
- **Blush = soft information.** Price pills, decorative tags. Never as a button.
- **Forest = grounding text.** Long-form headings, button hover state. Provides visual weight in type, not surfaces.
- **Surface-deep = footer + booking card.** Tinted-light neutral that says "this is a distinct region of the page" without being a heavy dark slab.

## Typography

- Display / headings: `'Playfair Display', serif`
- Body: `'Lato', sans-serif`

## Adding a new color

1. Add the token to `:root` in `src/styles/global.css`.
2. Add a row to the table above with its intended purpose.
3. Add a usage rule if it represents a new role (e.g. a warning state).

If a one-off hex shows up in a component without a token, that's a sign the system is missing a name — promote it to `:root` rather than leaving the literal in place.
