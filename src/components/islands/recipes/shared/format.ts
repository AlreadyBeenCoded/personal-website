/*
 * Number formatting shared by the recipe calculators. Quarter-step
 * fractions keep kitchen quantities plausible (½ tsp, 1¾ cups) instead
 * of decimal noise.
 */
const FRACTIONS: Record<string, string> = { '0.25': '¼', '0.5': '½', '0.75': '¾' };

export function formatFraction(value: number): string {
  const rounded = Math.round(value * 4) / 4;
  const whole = Math.trunc(rounded);
  const fraction = FRACTIONS[String(rounded - whole)];
  if (fraction) return whole === 0 ? fraction : `${whole}${fraction}`;
  return String(rounded);
}

/** Trim float noise for editable number displays (0.5, 1, 1.25). */
export function formatNumber(value: number): string {
  return String(Math.round(value * 100) / 100);
}
