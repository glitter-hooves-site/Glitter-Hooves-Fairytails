# Glitter Hooves & Fairytails — agent guide

Marketing site for a trauma-informed farm in Kittrell, NC. Static Astro site, deployed to GitHub Pages via Actions on push to `main`.

## Commands

| Task | Command |
|---|---|
| Install deps | `npm install` |
| Local dev server (hot reload) | `npm run dev` — http://localhost:4321 |
| Production build | `npm run build` — outputs `dist/` |
| Preview built output | `npm run preview` |

Run `npm run build` before opening a PR to confirm no Astro errors.

## Deploy

Deployment is automatic. Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds Astro and publishes `dist/` to GitHub Pages. The site is served at `https://glitterhoovesfairytails.org` (custom domain via `public/CNAME`).

**There is no staging environment.** Merging to `main` is the deploy.

## Git workflow

- **Never commit to `main`.** Always branch, push, open a PR.
- Merge strategy: **squash merge** (only option enabled on GitHub).
- After merging, delete the local branch.
- Before pushing a follow-up commit to an existing branch, verify the PR is still open: `gh pr view <branch> --json state`. If it's been merged, open a new PR off the updated `main`.
- Never `git push --force` to `main`.

## Repository layout

```
src/
  layouts/BaseLayout.astro        Shared <head>, nav, footer, glitter canvas, SEO meta + JSON-LD
  components/
    EventsBooking.astro           Event list + RSVP form (Formspree-backed)
    Newsletter.astro              Footer newsletter signup
    GlitterCanvas.astro           Decorative particle effect on every page
  pages/
    index.astro                   /
    about.astro                   /about/
    animals.astro                 /animals/
    experiences.astro             /experiences/
    events.astro                  /events/
    shop.astro                    /shop/
    donate.astro                  /donate/
  data/
    events.ts                     Single source of truth for events + RSVP form
    photos.ts                     Single source of truth for photo galleries
  assets/images/                  Source photos, optimized at build by <Image>
    farm/                         "Life on the Farm" homepage scroller
    about/                        About page collage (1.jpeg is featured)
    animals/{piper,petunia}/      Per-animal photo folders
    events/                       Reserved for future event photos
  styles/global.css               All site styles. CSS variables defined in :root.

public/                           Served raw, byte for byte, NOT optimized
  CNAME                           Custom domain — do not delete
  favicon.svg
  robots.txt                      Points crawlers at the sitemap
  og-image.jpg                    1200x630 social card; needs a stable unhashed URL

docs/design-system.md             Color tokens + usage rules. Read before changing colors.
astro.config.mjs                  site URL, sitemap integration
.github/workflows/deploy.yml      Build + Pages deploy
```

## How to do common edits

### Add an event
Edit `src/data/events.ts`. Append to `RAW_EVENTS` — order doesn't matter, the module sorts by date and drops past events automatically. Use `displayMonth`/`displayDay` overrides instead of a date for recurring or TBA experiences. Set `rsvpUrl` for external registration links; the RSVP button renders automatically when present. Event schema JSON-LD is emitted for any event with a real date.

Dates use the `localDate` helper, **never** `new Date('YYYY-MM-DD')`:

```ts
{ date: localDate('2026-08-15'), title: '...', time: '...', price: '...', seats: '...' },
```

`new Date('2026-08-15')` parses as UTC midnight per spec, which reads as the *previous* day anywhere west of UTC. `localDate` builds from calendar parts instead.

Event dates always mean **America/New_York** (the farm's timezone), regardless of where the build runs — `todayAtFarm()` pins the past-event cutoff to the farm's own calendar day, so a UTC CI runner won't retire an event at 8pm ET while it's still happening. An event stays listed through the whole of its own day at the farm.

Because the filter runs at **build time**, a past event doesn't disappear from the live site until the next deploy.

Every event needs a `slug`. It is the shareable anchor — `/events/#teen-reset` — so once an event has been advertised, treat its slug as permanent; changing it breaks every link already in the wild. Duplicates fail the build. Do not derive slugs from titles, or rewording a title will silently break shared links.

**Always report the share URL when you add an event.** Events are advertised by linking straight to their row:

```
https://glitterhoovesfairytails.org/events/#<slug>
```

The owner pastes these into Facebook posts, emails and Eventbrite descriptions, so finish any task that adds an event — or changes a slug — by giving them the full URL. Don't make them go and find it.

There is deliberately **no copy-link button in the UI**. Visitors have no use for one; the anchors exist for the owner's own advertising. Don't add customer-facing share controls unless asked.

### Add a photo
1. Drop the file in the matching subfolder under **`src/assets/images/`** — not `public/`.
2. Add one line to the relevant array in `src/data/photos.ts`, wrapping the path in `image()`:
   ```ts
   { src: image('farm/new-photo.jpg'), alt: 'Short description of what is in the photo' },
   ```
   `FARM_PHOTOS` is the homepage scroller, `ABOUT_PHOTOS` the about-page collage. Order matters — the first entry is featured/leftmost. A typo in the path fails the build with a list of what's actually available.
3. Filenames: `lowercase-with-hyphens.jpg`, no spaces.

Write real alt text describing what's in the frame — it's an image-search signal and an accessibility requirement. Don't ship `"farm photo"`.

No need to resize before committing. Files under `src/assets/` are rendered through Astro's `<Image>`, which emits resized WebP with `width`/`height` and `loading="lazy"`. A 4.8 MB phone photo becomes ~40 kB. That only works from `src/assets/` — anything in `public/` is served raw at full size.

### Change a color
Read `docs/design-system.md` first. Edit the token in `:root` at the top of `src/styles/global.css` rather than swapping raw hex codes inline. New tokens should be added to the doc.

### Add a page
Create `src/pages/new-page.astro`. Import and wrap content in `<BaseLayout title="..." description="...">`. The route is auto-generated from the filename (`new-page.astro` → `/new-page/`). To add it to the nav, edit `navLinks` in `src/layouts/BaseLayout.astro`.

## Conventions & gotchas

- **Photos go through `<Image>` from `astro:assets`, never a bare `<img>` with a `/images/...` path.** Source files live in `src/assets/images/` and are resolved via `image()` from `src/data/photos.ts`. Bare `<img>` skips optimization and drops `width`/`height`, which regresses both LCP and CLS.
- **`public/` is for files that need a stable, unhashed URL** — `CNAME`, `robots.txt`, `favicon.svg`, `og-image.jpg`. Everything there is served raw at full size. Don't put content photos in it.
- **Every page needs exactly one `<h1>`.** Use `<h1 class="section-title">` for the page's lead heading; `.section-title` styles the same regardless of tag. Subordinate headings step down without skipping — several CSS selectors are tag-based (`.exp-card h2`, `.event-info h2`, `.animal-card h2`, `.booking-card h2`), so changing a heading tag means updating its selector too.
- **Form submissions go to Formspree** (`https://formspree.io/f/maqavneq`). The booking form uses `fetch()` with `Accept: application/json` so the success message appears inline rather than navigating away. Don't switch back to a native form POST.
- **Astro scripts in `<script>` blocks run on the client after streaming completes.** Event listeners must be attached after the elements exist; querying `document.getElementById` at the top of an inline script is fine because the script tag comes after the markup.
- **The CSS token `--brown` was renamed to `--forest`** (it was a green hex all along). Don't reintroduce `--brown`.
- **The Bash tool does not persist `cd` between calls.** Use `git -C /abs/path` or `cd /abs/path && cmd` in a single invocation.
- **TypeScript types in Astro `<script>` blocks** are stripped at build, but they help during editing.

## SEO

- Per-page `<title>` and `<meta description>` come from `BaseLayout` props — always pass both.
- Every page has exactly one `<h1>` naming its subject. This is a primary topical signal; don't demote it to `<h2>` for styling reasons.
- Open Graph + Twitter Card tags use the same title/description, plus an `ogImage` prop defaulting to `/og-image.jpg` (1200×630, in `public/` so the URL stays stable for social crawlers).
- Homepage carries a LocalBusiness JSON-LD with the Kittrell, NC address. `/events/` emits Event JSON-LD per dated event.
- Sitemap generated by `@astrojs/sitemap` at `/sitemap-index.xml`, with `lastmod`; the 404 is filtered out.
- Custom `404.astro` links back into the site rather than dead-ending on GitHub's default page.

**Still open** (needs info only the owner has): there's no phone number, email, or `/contact/` page anywhere on the site, and the LocalBusiness JSON-LD has no `telephone`, `openingHours`, `geo`, or street address. That's the largest remaining local-SEO gap.

## Out of scope

- No backend, no database, no API routes. If a feature needs server-side state, surface that constraint rather than working around it.
- No Tailwind, no CSS-in-JS. Styles live in `src/styles/global.css`.
- No CMS. Content lives in `.astro` pages and the `src/data/*.ts` files.
