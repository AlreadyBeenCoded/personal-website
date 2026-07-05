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
- **Texture & background:** full decision brief in
  `background-texture-brief.md` — this is a think-through-together item,
  and step one is Claude's honest recommendation, not implementation.
  Current state: static grain is live at 5% opacity (`body::after` in
  global.css). Andrew prototyped five options, most→least restrained:
  1. Static grain (SVG noise, ~10%, multiply) — most invisible, no assets
  2. Washi paper (directional fibres + speckle, likely one optimised image)
  3. Faint mesh / time-of-day color wash (sage/clay/stone, pure CSS) —
     where the existing daypart tint would live
  4. Drifting grain — film-grain shimmer, hero only; must pin still under
     reduced motion
  5. Cursor-reactive glow — held in reserve; template-territory risk,
     useless on touch
  Andrew's leaning: base = 1 or 2, plus 3; 4 hero-only; 5 probably not.
  Open questions he wants real push-back on: grain vs washi (and whether
  layering both adds anything), ambient drift vs actual-local-time shift,
  whether any cursor-reactivity is compatible with the aesthetic, and
  whether the disciplined answer is "option 1 only".
  Constraints: CSS/generated or one small asset; reduced-motion honored per
  layer; contrast holds; composites under content; no template feel.
  His working prototype (`background-textures.html`) is not in the repo yet
  — ask him for it before starting this item.

## 2. Real content pass

Replace every marked PLACEHOLDER:

- Landing intro (Hero.astro) — Andrew's real first-person lines
- /now — actual season content (src/content/now.mdx)
- /work — real roles, dates, notes (src/pages/work.astro)
- partmatch + compliance case studies (src/content/projects/)
- Real recipe with Andrew's ratios, real bikes, real games
  (src/content/recipes/, src/pages/off-the-clock.astro)

## 3. Recipe calculator widget (rice + coffee solver)

Full brief in `recipe-calculator-brief.md` — spec *and* invitation: step one
is Claude's read on the open questions + a component-structure proposal,
then sign-off, then build. Supersedes the earlier "two separate widgets"
idea: it's ONE React island with a Rice/Coffee mode toggle.

- **Dual home:** Off the clock as a tool Andrew actually uses; Building as
  a portfolio case study.
- **Model:** a solver, not a form — fix one known quantity, everything else
  recomputes live (no Calculate button, single live result panel).
- **Rice mode:** short-grain white / sushi / brown; input in 合 (gō ≈180 ml
  ≈150 g) / g / cups with live conversion; firmer↔softer slider nudging
  ratio within a band (white ~1:1.1–1.2 by volume, brown ~1:1.5–2);
  rinse/soak options; outputs water + soak/cook/rest times.
- **Coffee mode:** V60 / French press / AeroPress / espresso; strength
  slider within method's ratio band (V60 ~1:15–16 @92–96°C, FP ~1:12–15
  coarse ~4 min, AeroPress ~1:13–16, espresso ~1:2 ~25–30 s); ONE known
  quantity (cups | water | dose) → other two computed; outputs dose, water,
  grind label, temp, bloom, brew time.
- **Tech:** one Astro island, `client:visible`, fully client-side, Tailwind
  matching the site system; localStorage (or nanostores) persistence of
  last settings.
- **Open questions Andrew wants real input on:** is fix-one-solve-rest right
  for coffee's three interrelated quantities; better-calibrated domain
  numbers (he'd rather trust the values than keep his draft); v1 scope of
  rice types/methods; single result panel vs inline results; anything
  missing for kitchen usefulness or portfolio impressiveness.
- **v1 defaults (proposed, open):** V60 + short-grain white. Build order:
  recommendation → structure proposal → sign-off → v1 → persistence →
  motion polish. Non-negotiables: no generic-calculator feel, live updates,
  accessible/responsive, trustworthy rounding and units.
- **Later, not v1:** more grains/methods, named presets, remembered
  metric⇄imperial.
- Brief §10 ("Notes for me") is still blank — Andrew's own defaults and
  taste-locked ratios; ask before building.

## 4. Publish on Vercel

- Connect AlreadyBeenCoded/personal-website to Vercel; push-to-deploy on main
  (repo pushed 2026-07-04)
- Custom domain (which one? — decide), HTTPS
- Pre-launch checklist: favicon, OG image + meta tags, 404 page,
  Lighthouse pass (perf + a11y), decide repo visibility (currently private)

## Agreed earlier, still parked

- **Dark mode** (manual toggle) — palette is CSS-vars throughout, so this is
  a variable-swap exercise; deferred until the light palette is final.
- **Time-of-day tint** currently uses visitor's local clock — revisit if it
  should follow Salzburg time instead (site-as-place vs visitor-comfort).
