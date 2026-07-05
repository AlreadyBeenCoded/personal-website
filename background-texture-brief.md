# Background & Texture — Build Brief

> **For:** Claude Fable 5 (build partner)
> **From:** Andrew
> **Context:** Part of my personal website (see `personal-site-brief.md`). Warm Japanese-minimalist aesthetic — bone base, muted earthy tones (clay, sage, stone), generous space, one restrained accent, craft over flash.
> **How to use this brief:** This is a decision I want to *think through with you*, not hand you finished. Below is the exploration I've already done and where I'm currently leaning — but treat it as a starting position. If your judgment differs, say so and make the case. I'd rather land on the right answer together than have you just implement mine.

---

## 1. The goal

Add a subtle texture to the site background so it reads as *warm paper*, not flat digital white — without ever competing with content. The test for anything we add: **does it stay quiet when I'm not looking at it?**

## 2. Options I explored

I prototyped five, from most restrained to most active:

1. **Static grain** — faint monochrome SVG noise (~10% opacity, multiply blend). Most invisible, most on-brand. No image assets.
2. **Washi paper** — directional fibres + fine speckle on a warmer bone. A quiet Japanese nod with more character than pure noise. Best served by one optimised paper image rather than pure SVG.
3. **Faint mesh / time-of-day** — a barely-there color wash (sage / clay / stone) that drifts very slowly, like ambient light. This is where my day-to-dusk palette-shift idea would live. Pure CSS.
4. **Drifting grain** — the static grain, shimmering film-grain style. Life without motion you'd consciously track. Reduced-motion must pin it still.
5. **Cursor-reactive glow** — a soft light following the pointer. The true "interactive background" tier — and, to my eye, the first thing that risks tipping minimalism into template territory. Does nothing for touch visitors.

## 3. Where I'm currently leaning *(open to your push-back)*

- **Base:** option 1 or 2.
- **Plus** option 3 for the slow time-of-day shift.
- **Option 4** reserved for the hero section only, not the whole page.
- **Option 5** held in reserve — probably not site-wide, maybe one small moment or not at all.

That's three layers that all whisper. But I genuinely want your read on it.

## 4. Where I'd value your input

Please actually weigh in on these — don't just ratify my leaning:

- **Grain vs. washi as the base:** which serves this aesthetic better, and does layering both add anything or just noise? Is pure-SVG washi good enough, or is a real paper texture worth the asset weight?
- **The time-of-day shift:** is an always-on ambient drift the right call, or should the palette only shift with actual local time? What's the tasteful, non-gimmicky version?
- **Interactive tier:** is there a version of cursor-reactivity restrained enough to belong here, or is it fundamentally at odds with the aesthetic? If it stays, where — hero only?
- **Anything I'm missing:** a sixth option, a smarter way to combine layers, or a reason to do *less* than I'm proposing. If the disciplined answer is "just option 1, nothing else," I want to hear that too.

## 5. Constraints (these aren't negotiable)

- **Performance:** prefer generated/CSS textures or a single small optimised asset. No heavy image stacks. It should feel instant.
- **Accessibility:** honor `prefers-reduced-motion` for every animated layer; ensure text contrast holds over any texture.
- **No template feel:** the result should feel specific to this site, not a starter-kit background.
- **Layering discipline:** whatever we choose composites cleanly under content and never fights legibility.

## 6. How to work

1. Give me your honest recommendation first — agree, adjust, or redirect my leaning, with reasoning.
2. Once we align, build the chosen layer(s) as reusable, the-able components/tokens that drop into the Astro site.
3. Small, reviewable steps. Explain the non-obvious calls.

---

## 7. Reference

A working prototype of all five options exists (`background-textures.html`) — feel free to ask me to share it or describe any option in more detail.
