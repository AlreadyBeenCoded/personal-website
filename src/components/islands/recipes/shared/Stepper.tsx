import { useState } from 'react';
import { formatNumber } from './format';

/*
 * Tactile number input: −/+ buttons around a small editable field.
 * Typing is allowed (reaching 300 g by ± presses would be tedious), but
 * the field re-normalizes on blur so garbage input can never stick.
 */
type Props = {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
};

const BUTTON =
  'grid h-8 w-8 place-items-center rounded-full border border-fog/60 text-lg leading-none ' +
  'text-ink-soft transition-colors hover:border-ink-soft hover:text-ink ' +
  'disabled:opacity-40 disabled:hover:border-fog/60 disabled:hover:text-ink-soft';

export default function Stepper({ label, value, min, max, step, onChange }: Props) {
  const [draft, setDraft] = useState<string | null>(null);
  const clamp = (n: number) => Math.min(max, Math.max(min, n));

  const nudge = (direction: 1 | -1) => {
    setDraft(null);
    // Snap to the step grid so a typed 310 g becomes 325/300, not 335.
    onChange(clamp(Math.round((value + direction * step) / step) * step));
  };

  return (
    <div className="flex items-center gap-3">
      <button type="button" aria-label={`Less ${label}`} disabled={value <= min} onClick={() => nudge(-1)} className={BUTTON}>
        −
      </button>
      <input
        aria-label={label}
        type="text"
        inputMode="decimal"
        value={draft ?? formatNumber(value)}
        onChange={(event) => {
          setDraft(event.currentTarget.value);
          const parsed = Number.parseFloat(event.currentTarget.value.replace(',', '.'));
          if (Number.isFinite(parsed)) onChange(clamp(parsed));
        }}
        onBlur={() => setDraft(null)}
        className="w-16 border-b border-fog/60 bg-transparent pb-0.5 text-center font-serif text-2xl leading-none outline-none transition-colors focus:border-kaki"
      />
      <button type="button" aria-label={`More ${label}`} disabled={value >= max} onClick={() => nudge(1)} className={BUTTON}>
        +
      </button>
    </div>
  );
}
