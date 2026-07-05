# Backlog

Rough priority order. Items move up when their content exists.

## 1. More life — images, color, texture

- **Images:** the site is currently all type. Candidates, in rough order of
  impact: dishes for Off the clock (cooking is the most photogenic artifact),
  project screenshots for the Building case studies, bikes, possibly a small
  landing portrait. Needs Andrew's photos — treat, don't decorate: few,
  well-placed, lazy-loaded.
- **Color: SHIPPED 2026-07-05** — section-hue system (one earth tone per
  room via data-hue on body: Now=sage, Work=stone, Building=clay,
  landing/Off the clock=kaki; kaki stays the sole interaction accent) +
  full-bleed ink-dark footer. 2026-07-05 also shipped: /now section
  headings take their room's hue (Building=clay, At work=stone, Off the
  clock=kaki) — /now as a color-coded index of the site; landing room
  index under the hero (four hue-ticked rows, Now row live from now.mdx
  frontmatter; hero 82→72svh so the first row peeks above the fold);
  footer period follows the room hue; footer names the daypart ("Evening
  in Eugendorf", CSS-toggled off data-daypart); hero takes Instrument
  Serif Italic on "software by night". Still open for this bullet: tinted
  surfaces (deliberately held until images exist) and kanji annotations
  (Andrew's call, unmade).
- **Texture & background: DECIDED & SHIPPED 2026-07-05.** Outcome: pure-SVG
  washi (fibre + speckle, multiply) as base + a *still* daypart-driven
  color mesh (no drift animation); options 4 (drifting grain) and 5
  (cursor glow) cut entirely; palette warmed halfway toward the prototype
  (ink-soft darkened to hold AA). Decision record follows for reference.
  Original brief in `background-texture-brief.md`.
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

- **DEPLOYED 2026-07-05** — push-to-deploy on main is live; site is public
  on the .vercel.app domain with placeholder content throughout, which
  makes the real content pass (item 2) the launch blocker, not the infra.
- Consider `noindex` meta until the content pass lands (production
  .vercel.app deploys ARE indexable; previews are not) — or accept that a
  fresh .vercel.app URL has effectively zero discoverability. Remove it
  the day real content ships.
- Custom domain (which one? — decide), HTTPS
- Pre-launch checklist: favicon, OG image + meta tags, ~~404 page~~
  (shipped ad9303d), Lighthouse pass (perf + a11y), decide repo
  visibility (currently private)

## Agreed earlier, still parked

- **Dark mode** (manual toggle) — palette is CSS-vars throughout, so this is
  a variable-swap exercise; deferred until the light palette is final.
- **Time-of-day tint: RESOLVED 2026-07-05** — switched to Salzburg time
  (Europe/Vienna via Intl) in both the head script and motion.ts. Decided
  by the footer daypart line: once the site says "Evening in Eugendorf",
  the clock has to be Eugendorf's (site-as-place won).
- **Sticky nav: decided against 2026-07-05.** Pages are too short to earn
  it, and a pinned strip (solid or blurred) would sit over the washi
  backdrop and re-introduce per-frame compositing. If long case studies
  land, the version to build is a "peek-back" nav that slides in only on
  scroll-up and stays hidden while reading.
