# Coffee Card — Build Guide (for Andrew)

> **Goal:** build the coffee calculator card yourself, using the rice card as the template.
> Rice card reference: `src/components/islands/recipes/` (shared primitives + `rice/`).
> When you've got something — working or stuck — show Claude and it gets reviewed like a PR.

## The mental model in one paragraph

The rice card is a one-way pipe: inputs → `solveRice` → display. Coffee is *almost* that,
with one twist: dose, water, and cups are three views of **one number**, so your state stores
just that one number (`anchorValue`) plus *which field the user last typed in* (`anchor`).
Whichever field is the anchor stays fixed when the strength slider or method changes; the
other two are recomputed. Everything else — pure solver, config-per-method, thin card
component — is a copy of the rice pattern.

## Step 1 — `coffee/data.ts` (the domain table)

Mirror `rice/data.ts`: one config object per method, so adding a method later never touches
solver code. Skeleton:

```ts
export type MethodId = 'v60' | 'frenchPress' | 'aeropress' | 'aeropressIced';

export type MethodConfig = {
  id: MethodId;
  label: string;
  /** [strongest, weakest] — water g per 1 g coffee. NOTE: stronger = SMALLER number! */
  ratioBand: [number, number];
  grind: string;
  tempC: number;
  /** bloom water = this × dose; null = no bloom step (press) */
  bloomFactor: number | null;
  brewTime: string;          // display string is fine: '2:30–3:00'
  /** flash brew: this fraction of total water is ice in the vessel; null = hot brew */
  icePct: number | null;
};
```

Calibrated starting values (defensible; tune to taste later):

| method         | ratioBand | grind       | temp | bloom | ice  | time         |
| -------------- | --------- | ----------- | ---- | ----- | ---- | ------------ |
| V60            | [14, 17]  | medium-fine | 94°C | 2.5×  | —    | 2:30–3:30    |
| French press   | [12, 15]  | coarse      | 95°C | none  | —    | 4:00 + plunge|
| AeroPress      | [12, 16]  | medium-fine | 90°C | 2×    | —    | 1:30–2:00    |
| Iced AeroPress | [11, 14]  | fine        | 95°C | 2×    | 40%  | 1:00–1:30    |

Iced runs a slightly tighter ratio band, hotter water, and a shorter, finer brew because
only ~60% of the water ever touches the grounds — the concentrate has to carry the melt.

Also export two constants: `CUP_ML = 200` and `ABSORPTION = 2` (grounds retain ~2 g water
per g of coffee — this is why cups ≠ brew water).

## Step 2 — `coffee/solve.ts` (the actual solver)

Pure function, same shape as `solveRice`. Input: `{ method, strength, anchor, anchorValue }`
where `strength` is −1…1 (copy the `inBand` helper from rice — but note the band is
`[strong, weak]`, so decide which slider end maps to which and label it honestly in the UI).

The algebra — this is the whole "solver", three cases:

```
beverage-in-cup = water − ABSORPTION × dose        (physics)
water           = dose × ratio                      (recipe)

anchor = dose:   water = dose × ratio;  cups = dose × (ratio − 2) / CUP_ML
anchor = water:  dose = water / ratio;  cups as above
anchor = cups:   dose = (cups × CUP_ML) / (ratio − 2);  water = dose × ratio
```

Iced AeroPress doesn't touch this algebra at all — that's the point of flash brew: the ice
**is** part of the brew water, so `water` above is always *total* water and all three anchor
cases work unchanged. The split happens only in the return, when `icePct` is set:

```
iceG      = icePct × water
hotWaterG = water − iceG
```

(Absorption doesn't change either — the melt ends up in the cup just like poured water.)
Output everything the panel shows: dose, water, cups, ratio (nice to display as "1 : 15.5"),
grind, temp, bloom grams, ice/hot split when `icePct` is set, brew time.

**Compute at full precision, round only in the return**: dose to 0.5 g, water to 5 g,
bloom and ice to 5 g — the rice `roundTo` helper is two lines, copy it.

## Step 3 — prove the math before touching UI

This saved a real bug on the rice card. Write a scratch script and run it with tsx:

```bash
npx tsx check.ts    # anywhere, import solve.ts by absolute path
```

Cases worth checking by hand:

- V60, anchor=cups, 2 cups, neutral strength → dose should land around **29–30 g** and
  water around **455 g**. (If you get exactly 400 water, you forgot absorption.)
- Move strength with anchor=cups → **water stays put while dose moves**. That's the anchor
  working.
- anchor=dose 30 g, move strength → the opposite: dose stays, water/cups move.
- Iced AeroPress, anchor=dose 15 g, neutral strength → total water ~185–190 g, ice ~75 g.
  **Ice + hot must equal total exactly** — round the ice, then derive hot as
  `water − iceG`; rounding the two halves independently makes them drift apart.

## Step 4 — `coffee/CoffeeCard.tsx`

Copy `rice/RiceCard.tsx` as your starting file — the structure (stored state → sanitize →
solve → two-column JSX) is identical. Reuse `Segmented` (method pills), `Stepper` (all three
quantity fields), `useStoredState` (key: `'coffee-calculator-v1'`), and the range slider
markup for strength.

The one new UI idea: **three Steppers — dose, water, cups — all always editable.** In each
one's `onChange`, set *both* the anchor and the value:

```tsx
onChange={(v) => update({ anchor: 'dose', anchorValue: v })}
```

The other two show *solved* values (`value={result.waterG}`), so they update live as you
type in the anchored one. Mark the anchor subtly — a small kaki dot next to its label is
enough. When `icePct !== null` (iced), render one extra line under water — something like
"75 g ice in the vessel, 113 g hot over the grounds"; because the config declares this,
your JSX is just one conditional, no `if (method === 'aeropressIced')` anywhere.

Gotcha to expect: when the user edits the dose field, that Stepper's `value` prop is their
own input echoed back — fine. But switching anchor means a previously-anchored field becomes
computed, and its displayed value may jump slightly (rounding). That's correct behavior,
don't fight it.

## Step 5 — mount and verify

Add a second card div in the kitchen section of `src/pages/off-the-clock.astro` — copy the
"Rice, solved" block, swap the import and title. Then:

```bash
npm run dev
npx tsc --noEmit --strict --skipLibCheck --jsx react-jsx --target es2022 \
  --module esnext --moduleResolution bundler src/components/islands/recipes/coffee/CoffeeCard.tsx
```

Manual test script: type a dose → water/cups follow; type cups → dose follows; move strength
with each anchor and watch the right thing stay fixed; switch to iced AeroPress → ice/hot
split appears and sums to the water number; reload → settings survive.

## Traps, ranked by how likely they are to get you

1. **Ratio direction.** "Stronger" = *less* water per gram = smaller ratio number. Get this
   backwards and the slider feels haunted.
2. **`ratio − 2` in the cups algebra.** Forgetting absorption gives brews ~10% weak;
   forgetting the `− 2` when solving *from* cups gives division that's silently wrong, not
   crashing.
3. **Ice on top of, instead of out of, total water.** If you compute `water = dose × ratio`
   and then *add* ice, every iced brew drinks 40% watery. Ice is carved out of the total.
4. **Rounding inside the math.** Round once, at the edge, or dose/water/cups stop agreeing
   with each other. Same family: derive hot water as `water − iceG` *after* rounding ice,
   so the split always sums to the total.
5. **Logic creeping into the component.** If `CoffeeCard.tsx` contains any arithmetic beyond
   display formatting, move it into `solve.ts`.

Commit after each step, not at the end — the solver alone is a fine commit.
Step 3 is where it clicks.
