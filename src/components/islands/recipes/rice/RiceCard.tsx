import { CUP_ML, GO_ML, RICE_TYPES, type RiceTypeId, type RiceUnit } from './data';
import { riceGramsFrom, solveRice } from './solve';
import Segmented from '../shared/Segmented';
import Stepper from '../shared/Stepper';
import { formatFraction } from '../shared/format';
import { useStoredState } from '../shared/useStoredState';

/*
 * The rice calculator island. All cooking knowledge lives in data.ts and
 * solve.ts — this component is a thin view: inputs left, solved result
 * right, recomputed on every touch, no submit step. Card chrome (border,
 * paper, heading) belongs to the page, same as RecipeCard.
 */

type State = {
  type: RiceTypeId;
  amount: number;
  unit: RiceUnit;
  texture: number;
};

const DEFAULTS: State = { type: 'shortGrain', amount: 1, unit: 'go', texture: 0 };

const TYPE_OPTIONS = Object.values(RICE_TYPES).map(({ id, label }) => ({ value: id, label }));

// `step` drives the ± buttons; `snap` is the finer grid used when
// converting between units, so a toggle never shifts the quantity by
// more than half a snap (25 g button steps would eat up to 12.5 g).
const UNIT_META: Record<
  RiceUnit,
  { label: string; step: number; snap: number; min: number; max: number; ml?: number }
> = {
  go: { label: '合', step: 0.5, snap: 0.25, min: 0.5, max: 6, ml: GO_ML },
  g: { label: 'g', step: 25, snap: 5, min: 25, max: 1200 },
  cups: { label: 'cups', step: 0.25, snap: 0.25, min: 0.25, max: 5, ml: CUP_ML },
};

const UNIT_OPTIONS = (Object.keys(UNIT_META) as RiceUnit[]).map((unit) => ({
  value: unit,
  label: UNIT_META[unit].label,
}));

const MICRO_LABEL = 'text-xs font-medium tracking-[0.12em] uppercase text-ink-soft';

export default function RiceCard() {
  const [stored, update] = useStoredState<State>('rice-calculator-v1', DEFAULTS);

  // Never trust persisted state blindly — a stale schema falls back cleanly.
  const type = stored.type in RICE_TYPES ? stored.type : DEFAULTS.type;
  const unit = stored.unit in UNIT_META ? stored.unit : DEFAULTS.unit;
  const amount = Number.isFinite(stored.amount) ? stored.amount : DEFAULTS.amount;
  const texture = Number.isFinite(stored.texture) ? stored.texture : DEFAULTS.texture;

  const result = solveRice({ type, amount, unit, texture });

  // Switching units keeps the quantity, re-expressed and snapped to the
  // new unit's step: 2 合 → 300 g → 1.5 cups, never a reset to defaults.
  const switchUnit = (next: RiceUnit) => {
    if (next === unit) return;
    const grams = riceGramsFrom(amount, unit, type);
    const meta = UNIT_META[next];
    const raw = meta.ml ? grams / (meta.ml * RICE_TYPES[type].gramsPerMl) : grams;
    const snapped = Math.min(meta.max, Math.max(meta.min, Math.round(raw / meta.snap) * meta.snap));
    update({ unit: next, amount: snapped });
  };

  const salt = result.salt;
  const saltAmount = salt
    ? `${salt.grams} g · ${
        salt.teaspoons >= 3 ? `≈ ${formatFraction(salt.teaspoons / 3)} tbsp` : `${formatFraction(salt.teaspoons)} tsp`
      }`
    : 'none';

  return (
    <div className="grid gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:gap-14">
      <div>
        <p className={MICRO_LABEL}>Rice</p>
        <div className="mt-3">
          <Segmented legend="Rice type" options={TYPE_OPTIONS} value={type} onChange={(v) => update({ type: v })} />
        </div>

        <p className={`${MICRO_LABEL} mt-9`}>Amount</p>
        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-3">
          <Stepper
            label={`amount in ${UNIT_META[unit].label}`}
            value={amount}
            min={UNIT_META[unit].min}
            max={UNIT_META[unit].max}
            step={UNIT_META[unit].step}
            onChange={(v) => update({ amount: v })}
          />
          <Segmented legend="Unit" size="sm" options={UNIT_OPTIONS} value={unit} onChange={switchUnit} />
        </div>

        <p className={`${MICRO_LABEL} mt-9`}>Texture</p>
        <input
          type="range"
          aria-label="Texture, firmer to softer"
          min={-1}
          max={1}
          step={0.25}
          value={texture}
          onChange={(e) => update({ texture: Number(e.currentTarget.value) })}
          className="mt-4 w-full accent-kaki"
        />
        <div className="mt-1 flex justify-between text-xs text-ink-soft">
          <span>Firmer</span>
          <span>Softer</span>
        </div>
      </div>

      <div>
        <div aria-live="polite">
          {result.waterMl !== null ? (
            <p className="flex flex-wrap items-baseline gap-x-2">
              <span className="font-serif text-4xl leading-none">{result.waterMl} ml</span>
              <span className="text-sm text-ink-soft">water in the pot</span>
            </p>
          ) : (
            <p className="flex flex-wrap items-baseline gap-x-2">
              <span className="font-serif text-4xl leading-none">~{result.parboilLiters} L</span>
              <span className="text-sm text-ink-soft">salted water — boil like pasta, then drain</span>
            </p>
          )}
          <p className="mt-2 text-sm text-ink-soft">
            {result.riceGrams} g rice · about {formatFraction(result.servings)}{' '}
            {result.servings === 1 ? 'serving' : 'servings'}
          </p>
        </div>

        <ul className="mt-7">
          <ResultRow label="Wash" value={`${result.washes}×, until nearly clear`} />
          <ResultRow
            label="Soak"
            value={result.soakMinutes > 0 ? `${result.soakMinutes} min` : 'not needed'}
          />
          <ResultRow label="Salt" value={saltAmount} note={salt ? salt.when : result.saltNote} />
        </ul>

        <ol className="mt-7 border-t border-fog/40">
          {result.steps.map((step) => (
            <li key={step.label} className="border-b border-fog/40 py-2.5">
              <div className="flex items-baseline justify-between gap-6 text-[0.95rem]">
                <span className="font-medium">{step.label}</span>
                <span className="shrink-0 text-ink-soft">{step.minutes ? `${step.minutes} min` : '—'}</span>
              </div>
              {step.detail && <p className="mt-0.5 text-xs leading-relaxed text-ink-soft">{step.detail}</p>}
            </li>
          ))}
        </ol>

        <p className="mt-5 text-sm italic leading-relaxed text-ink-soft">{result.fluff}</p>
      </div>
    </div>
  );
}

function ResultRow({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <li className="border-t border-fog/40 py-2.5 text-[0.95rem] first:border-t-0">
      <div className="flex justify-between gap-6">
        <span className="text-ink-soft">{label}</span>
        <span className="text-right">{value}</span>
      </div>
      {note && <p className="mt-0.5 text-right text-xs leading-relaxed text-ink-soft">{note}</p>}
    </li>
  );
}
