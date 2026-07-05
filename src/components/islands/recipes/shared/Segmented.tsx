import { useId } from 'react';

/*
 * Pill-style single choice built on real radio inputs, so arrow-key
 * navigation and form semantics come free. Selected pill fills with ink —
 * the site's strongest mark, reserved for "this is the active choice".
 */
type Option<V extends string> = { value: V; label: string };

type Props<V extends string> = {
  legend: string;
  options: readonly Option<V>[];
  value: V;
  onChange: (value: V) => void;
  size?: 'md' | 'sm';
};

export default function Segmented<V extends string>({
  legend,
  options,
  value,
  onChange,
  size = 'md',
}: Props<V>) {
  const name = useId();
  const padding = size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <fieldset>
      <legend className="sr-only">{legend}</legend>
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => {
          const checked = option.value === value;
          return (
            <label
              key={option.value}
              className={`cursor-pointer rounded-full border transition-colors duration-200 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-kaki/60 ${padding} ${
                checked
                  ? 'border-ink bg-ink text-bone'
                  : 'border-fog/60 text-ink-soft hover:border-ink-soft hover:text-ink'
              }`}
            >
              <input
                type="radio"
                className="sr-only"
                name={name}
                value={option.value}
                checked={checked}
                onChange={() => onChange(option.value)}
              />
              {option.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
