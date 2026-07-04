import { useState } from 'react';

/*
 * The interactive slice of the recipe card — the servings slider and the
 * ingredient quantities that scale with it. Everything else on the page
 * (title, method, layout) is static Astro; this island is the only
 * hydrated component on the site.
 */

type Ingredient = {
  amount: number | null;
  unit?: string;
  item: string;
};

type Props = {
  baseServings: number;
  ingredients: Ingredient[];
};

// Quarter-step rounding keeps scaled amounts kitchen-plausible
// (1.5 tbsp, ¾ onion) instead of "1.3333 tbsp".
function formatAmount(value: number): string {
  const rounded = Math.round(value * 4) / 4;
  const whole = Math.trunc(rounded);
  const fraction = { 0.25: '¼', 0.5: '½', 0.75: '¾' }[rounded - whole];
  if (fraction) return whole === 0 ? fraction : `${whole}${fraction}`;
  return String(rounded);
}

export default function RecipeCard({ baseServings, ingredients }: Props) {
  const [servings, setServings] = useState(baseServings);
  const factor = servings / baseServings;

  return (
    <div>
      <div className="flex items-baseline justify-between gap-6">
        <label htmlFor="servings" className="text-sm text-ink-soft">
          Servings
        </label>
        <output htmlFor="servings" className="font-serif text-2xl leading-none">
          {servings}
        </output>
      </div>
      <input
        id="servings"
        type="range"
        min={1}
        max={6}
        step={1}
        value={servings}
        onChange={(e) => setServings(Number(e.currentTarget.value))}
        className="mt-3 w-full accent-kaki"
      />
      <ul className="mt-8">
        {ingredients.map(({ amount, unit, item }) => (
          <li
            key={item}
            className="flex justify-between gap-6 border-t border-fog/40 py-2.5 text-[0.95rem] first:border-t-0"
          >
            <span>{item}</span>
            <span className="shrink-0 text-ink-soft">
              {amount === null ? '—' : `${formatAmount(amount * factor)} ${unit ?? ''}`.trim()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
