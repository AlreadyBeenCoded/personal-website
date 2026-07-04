# Backlog

Rough priority order. Items move up when their content exists.

## 1. More life — images, color, texture

- **Images:** the site is currently all type. Candidates, in rough order of
  impact: dishes for Off the clock (cooking is the most photogenic artifact),
  project screenshots for the Building case studies, bikes, possibly a small
  landing portrait. Needs Andrew's photos — treat, don't decorate: few,
  well-placed, lazy-loaded.
- **Color:** the palette exists (clay / sage / fog / kaki) but mostly shows up
  in details. Give it more presence — e.g. tinted section surfaces, colored
  hover states, sage/clay in imagery treatment — without breaking the
  bone-quiet base.
- **Texture:** film grain is live at 5% opacity (body::after in global.css)
  but nearly subliminal. Tune it up and/or add a subtle paper tone to card
  surfaces. Static only, per the brief.

## 2. Real content pass

Replace every marked PLACEHOLDER:

- Landing intro (Hero.astro) — Andrew's real first-person lines
- /now — actual season content (src/content/now.mdx)
- /work — real roles, dates, notes (src/pages/work.astro)
- partmatch + compliance case studies (src/content/projects/)
- Real recipe with Andrew's ratios, real bikes, real games
  (src/content/recipes/, src/pages/off-the-clock.astro)

## 3. Publish on Vercel

- Connect AlreadyBeenCoded/personal-website to Vercel; push-to-deploy on main
- Custom domain (which one? — decide), HTTPS
- Pre-launch checklist: favicon, OG image + meta tags, 404 page,
  Lighthouse pass (perf + a11y), decide repo visibility (currently private)

## Agreed earlier, still parked

- **Dark mode** (manual toggle) — palette is CSS-vars throughout, so this is
  a variable-swap exercise; deferred until the light palette is final.
- **Time-of-day tint** currently uses visitor's local clock — revisit if it
  should follow Salzburg time instead (site-as-place vs visitor-comfort).
