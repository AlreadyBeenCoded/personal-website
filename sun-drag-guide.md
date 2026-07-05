# Sun Drag — Build Guide (for Andrew)

> **Goal:** make the footer sundial draggable — pull the sun along the horizon and
> the whole site follows: canvas, mesh, disc color, even the footer's
> "Evening in Eugendorf" line.
> When you've got something — working or stuck — show Claude and it gets reviewed
> like a PR. Same deal as `coffee-card-guide.md`.

## The mental model in one paragraph

Everything already listens to ONE attribute: `data-daypart` on `<html>`. The canvas
color, the mesh corner washes, the `.dp` footer word, and the sun's own color
(kaki ↔ fog moon at night) are all pure CSS keyed to it. The sun's position is one
CSS variable, `--sun-x`, on the `[data-sun]` track (set by `placeSun()` in
`src/scripts/motion.ts`: minutes-since-midnight ÷ 1440, linear across the track).
So the entire drag interaction is: **pointer x → minutes → set `--sun-x` + set
`data-daypart`**. You never touch a color. Release does nothing — the dragged sky
just stays. Navigation resets everything because `astro:before-swap` re-stamps the
real daypart and sun position on the incoming page (already shipped; you get the
reset for free).

## Where the code goes

New file `src/scripts/sun-drag.ts`, exporting `initSunDrag()`. Call it from the
`astro:page-load` listener in `motion.ts` (after `placeSun()`). Page-load fires on
every client-side navigation and the footer is rebuilt each time, so re-query the
track inside `initSunDrag()` — never cache elements across navigations.

## Build steps

1. **Grab the pieces.** `const track = document.querySelector<HTMLElement>('[data-sun]')`,
   and the `.sun` disc inside it. Bail if missing.

2. **Pointer plumbing.** On the disc: `pointerdown` → `setPointerCapture(e.pointerId)`,
   then `pointermove` updates, `pointerup`/`pointercancel` ends. Pointer events cover
   mouse + touch in one API. Add `touch-action: none` to `.sun` in CSS or the browser
   will fight you for the gesture on mobile. The 12px disc is too small a target —
   give it a larger invisible hit area (padding + background-clip, or a ::before).

3. **x → minutes.** `const rect = track.getBoundingClientRect()`;
   fraction = `(e.clientX - rect.left) / rect.width`, clamped to [0, 1].
   `minutes = Math.round(fraction * 1439)`.

4. **minutes → daypart.** Same bands as `daypart()` in motion.ts
   (6–11 morning, 11–16 midday, 16–21 evening, else night). Consider exporting the
   band logic from motion.ts instead of copying it — one clock, one truth.

5. **Apply.** `track.style.setProperty('--sun-x', …%)` and
   `document.documentElement.dataset.daypart = …`. That's the whole trick — CSS does
   the rest. (Set `--sun-x` on every move, but only touch `data-daypart` when the
   band actually changes: the 1500ms canvas fade shouldn't restart on every pixel.)

6. **Make it honest for keyboards.** It's a slider, so say so: on the disc set
   `role="slider"`, `tabindex="0"`, `aria-label="Time of day in Eugendorf"`,
   `aria-valuemin="0"`, `aria-valuemax="1439"`, `aria-valuenow` = minutes,
   `aria-valuetext` like `"evening — 19:40"`. Arrow keys ±15 min, Shift+Arrow ±60.
   **Remove `aria-hidden="true"` from the track in Footer.astro** — it was only
   correct while the sundial was decorative.

7. **Focus style.** A visible ring on the disc (`outline-offset` a couple px, bone
   color). The site's rule: keyboard focus is always visible.

## Test checklist (dev server, then production)

- Drag right to the end of the track → canvas darkens, footer word flips to
  "Night in Eugendorf", disc turns fog. Drag back → kaki returns, sky lightens.
- Release anywhere → nothing snaps back; the dragged sky holds.
- Click to another page → real Salzburg time is restored, no fade artifact.
- Tab to the disc, arrow keys move it, `aria-valuetext` updates (check with
  VoiceOver if you're feeling thorough).
- Phone (or DevTools device mode): drag works, page doesn't scroll while dragging.
- `prefers-reduced-motion`: drag still works; position/color just snap (CSS
  transitions are already gated — verify, don't assume).

## Later polish, deliberately not now

- Altitude arc (a shallow sine lift so the midday sun rides higher).
- A tiny "return to now" affordance if playtesters get lost.
- Persistence is REJECTED, not deferred — the footer line promises the real time;
  a stored override would make the site lie on every subsequent page.
