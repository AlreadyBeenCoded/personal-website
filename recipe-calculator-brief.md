# Recipe Calculator Widget — Build Brief

> **For:** Claude Fable 5 (build partner)
> **From:** Andrew
> **Context:** A feature module of my personal website (see `personal-site-brief.md`). It lives in the "Building" section as a portfolio piece *and* in "Off the clock" as a tool I actually use.
> **How to use this brief:** This is a spec *and* an invitation. The structure and defaults below are my proposal — where you see a better call (on the solver design, the interaction model, the domain values, or the scope), say so and make the case before we build. Propose the component structure first, build in small reviewable steps, and explain non-obvious choices.

---

## 1. What this is

An interactive **recipe calculator** that computes the perfect rice and the perfect coffee from a few variables. It's a *solver*: you fix one known quantity and it computes everything else, so it feels smart rather than like a form.

Dual purpose:
- **Portfolio:** demonstrates interaction design + code craft, self-contained and impressive.
- **Utility:** something I genuinely use in the kitchen.

## 2. Where it fits (tech)

- Built as an **Astro island**: one React component, hydrated with `client:visible` so it loads only when scrolled into view and ships **zero JS to every other page**.
- **Fully client-side** — no backend, no API. All logic runs in the browser.
- Styling: **Tailwind**, matching the site's warm Japanese-minimalist system (bone base, earthy tones, one accent, generous space).
- **Persistence:** remember the user's last settings via `localStorage` (or a small `nanostores` atom). *Note: this works on the real site; if prototyping inside a Claude artifact, use in-memory state instead — browser storage is blocked there.*

## 3. Interaction & design principles

- **No "Calculate" button** — results recompute live as you touch any input.
- **Single live result panel** that updates in place.
- **Steppers + sliders** over free text where possible; keep it tactile and minimal.
- **Unit toggles:** g / ml / cups, plus 合 (gō, ≈180 ml) for rice — on-brand and practical.
- Honor `prefers-reduced-motion`; keyboard-navigable; readable contrast.
- Two modes in one widget: **Rice** and **Coffee** (tab/segmented toggle).

## 4. Rice mode (Japanese short-grain focus)

**Inputs**
- Rice type: short-grain white / sushi / brown (extendable).
- Quantity: enter in 合 / grams / cups (with live unit conversion).
- Texture preference: firmer ↔ softer (slider that nudges the ratio within a sensible band).
- Options: rinse (yes/no), soak (yes/no + duration).

**Outputs**
- Water amount (in chosen unit).
- Soak time, cook time, rest/steam time.

**Reference ratios (starting values — tune these):**
- Short-grain white: ~1 : 1.1–1.2 by volume. Texture slider moves within this band.
- Brown: ~1 : 1.5–2, longer soak + cook.
- 1 合 ≈ 180 ml uncooked ≈ ~150 g.

## 5. Coffee mode

**Inputs**
- Brew method: V60 / French press / AeroPress / espresso (method drives the ratio).
- Strength: weaker ↔ stronger (nudges ratio within the method's band).
- **One** known quantity: cups *or* water *or* coffee dose — the other two are computed.

**Outputs**
- Coffee dose (g), water (g/ml), grind size (coarse→fine label), water temp, bloom water, brew time.

**Reference ratios (starting values — tune these):**
- Pour-over (V60): ~1 : 15–16, water ~92–96°C, bloom ≈ 2–3× dose, brew ~2:30–3:30.
- French press: ~1 : 12–15, coarse grind, ~4 min steep.
- AeroPress: ~1 : 13–16, medium-fine, ~1–2 min.
- Espresso: ~1 : 2 (ratio-based), fine grind, ~25–30 s shot.

## 6. Where I'd value your input

Please weigh in on these rather than just implementing my version:

- **Solver design:** is "fix one variable, compute the rest" the right model for both modes, or is there a cleaner mental model — especially for coffee, where three quantities interrelate?
- **Domain accuracy:** the reference ratios in §4–5 are starting points from general knowledge. If you have better-calibrated values (grind vocabulary, temp bands, ratio ranges per method), propose them — I'd rather the numbers be trustworthy than match my draft.
- **Scope of v1:** which rice types / brew methods actually earn a place in v1 vs. later? Push back if I've included too many or too few.
- **Interaction model:** is a single live result panel right, or would something else (e.g. inline results next to each input) feel better for a solver? Is there a smarter way to handle the "one known quantity" selection in coffee mode?
- **Anything I'm missing** that would make this genuinely more useful in the kitchen or more impressive as a portfolio piece.

## 7. Build order

1. Give me your read on the questions above, then propose component structure (state model, how the solver is organized, how modes share layout). Wait for sign-off.
2. Build **v1**: mode toggle, live result panel, unit toggles, sensible defaults (**V60** + **short-grain white** — open to your recommendation).
3. Wire up persistence.
4. Polish motion/micro-interactions (subtle, reduced-motion aware) to match the site.

## 8. Non-negotiables

- No template/generic-calculator feel — it should look like it belongs to my site.
- Instant, live updates; no submit step.
- Accessible + responsive (mobile-first).
- Numbers should be easy to trust: sensible rounding, clear units, no false precision.

## 9. Extensibility (later, not v1)

- More rice types / grains; more brew methods.
- Save named presets ("my morning V60").
- Metric ⇄ imperial toggle remembered across visits.

---

## 10. Notes for me — *to fill in*

- Preferred default brew method / rice type: _______
- Any ratios I want locked to my own taste: _______
- Grind-size vocabulary I prefer (numbers vs. words): _______
