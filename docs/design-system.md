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
| `--brown` | `#6b4226` | Grounding | Body text, booking card background, footer |
| `--text` | `#3a2e28` | Text | Default body text |
| `--text-muted` | `#4a3f38` | Text | Secondary text, captions, helper copy |
| `--cream` | `#fdf6ec` | Surface | Page sections that need warmth; nested card backgrounds |
| `--warm-white` | `#fffdf9` | Surface | Default page background, primary card surface |
| `--border` | `#e8ddd4` | Border | Hairline borders on cards and inputs |

## Usage rules

- **Sage = brand identity.** Date boxes, "Book a Visit" CTA in the nav, primary site buttons.
- **Plum = call to action.** Reserved for buttons where we want the user to *click now* — RSVP, future "Donate" or "Buy" buttons. Scarcity makes it work; if everything is plum, nothing is.
- **Blush = soft information.** Price pills, decorative tags. Never as a button.
- **Brown = grounding.** Long-form text, the booking card on the events page, footer. Provides visual weight.

## Typography

- Display / headings: `'Playfair Display', serif`
- Body: `'Lato', sans-serif`

## Adding a new color

1. Add the token to `:root` in `src/styles/global.css`.
2. Add a row to the table above with its intended purpose.
3. Add a usage rule if it represents a new role (e.g. a warning state).

If a one-off hex shows up in a component without a token, that's a sign the system is missing a name — promote it to `:root` rather than leaving the literal in place.
