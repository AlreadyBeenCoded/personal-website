/*
 * Pure rice solver: (type, amount, unit, texture) → everything else.
 * No state, no DOM — the card component is just a view over solveRice().
 * All math runs at full precision; rounding happens once, at the edge,
 * with per-quantity steps so the numbers stay kitchen-plausible.
 */

import {
  CUP_ML,
  GO_ML,
  GRAMS_PER_SERVING,
  RICE_TYPES,
  SALT_GRAMS_PER_TSP,
  type RiceTypeId,
  type RiceUnit,
} from './data';

export type RiceInput = {
  type: RiceTypeId;
  amount: number;
  unit: RiceUnit;
  /** -1 firmer … +1 softer; interpolates within the type's band. */
  texture: number;
};

export type Step = {
  label: string;
  minutes?: number;
  detail?: string;
};

export type SaltResult = {
  grams: number;
  teaspoons: number;
  when: string;
};

export type RiceResult = {
  riceGrams: number;
  servings: number;
  washes: number;
  soakMinutes: number;
  /** null for parboil-drain, where water is "abundant", not measured. */
  waterMl: number | null;
  /** Set instead of waterMl for parboil-drain types. */
  parboilLiters?: number;
  salt: SaltResult | null;
  saltNote?: string;
  steps: Step[];
  fluff: string;
};

const roundTo = (value: number, step: number) => Math.round(value / step) * step;

/** Map -1…1 into a [firmer, softer] band. */
const inBand = ([firmer, softer]: [number, number], t: number) =>
  firmer + ((clamp(t) + 1) / 2) * (softer - firmer);

const clamp = (t: number) => Math.min(1, Math.max(-1, t));

export function riceGramsFrom(amount: number, unit: RiceUnit, type: RiceTypeId): number {
  const { gramsPerMl } = RICE_TYPES[type];
  switch (unit) {
    case 'g':
      return amount;
    case 'go':
      return amount * GO_ML * gramsPerMl;
    case 'cups':
      return amount * CUP_ML * gramsPerMl;
  }
}

export function solveRice(input: RiceInput): RiceResult {
  const config = RICE_TYPES[input.type];
  const riceGrams = riceGramsFrom(input.amount, input.unit, input.type);
  const servings = roundTo(riceGrams / GRAMS_PER_SERVING, 0.5);

  const base = {
    riceGrams: roundTo(riceGrams, 5),
    servings,
    washes: config.washes,
    soakMinutes: config.soakMinutes,
    saltNote: config.saltNote,
    fluff: config.fluff,
  };

  if (config.method.kind === 'absorption') {
    const { waterRatioByVolume, simmerMinutes } = config.method;
    // Ratios are quoted by volume, so convert grams back through density.
    const riceMl = riceGrams / config.gramsPerMl;
    const waterMl = roundTo(riceMl * inBand(waterRatioByVolume, input.texture), 5);

    const salt: SaltResult | null =
      config.saltGramsPer100g === null
        ? null
        : saltResult((riceGrams / 100) * config.saltGramsPer100g, 'Stir into the cooking water before the boil.');

    return {
      ...base,
      waterMl,
      salt,
      steps: [
        { label: 'Boil', detail: 'Bring to a boil over medium-high heat, lid on.' },
        { label: 'Simmer', minutes: simmerMinutes, detail: 'Lowest heat, lid on — no peeking.' },
        { label: 'Rest', minutes: config.restMinutes, detail: 'Off the heat, lid still on.' },
      ],
    };
  }

  const { parboilMinutes, steamMinutes, parboilWaterMlPerGram, saltGramsPerLiter } = config.method;
  const parboilLiters = roundTo((riceGrams * parboilWaterMlPerGram) / 1000, 0.5);

  return {
    ...base,
    waterMl: null,
    parboilLiters,
    salt: saltResult(parboilLiters * saltGramsPerLiter, 'In the parboil water — most of it drains away.'),
    steps: [
      {
        label: 'Parboil',
        minutes: Math.round(inBand(parboilMinutes, input.texture)),
        detail: `Rolling boil in ~${parboilLiters} L of salted water, until just al dente.`,
      },
      { label: 'Drain', detail: 'Drain immediately and thoroughly.' },
      {
        label: 'Steam',
        minutes: steamMinutes,
        detail: 'Back in the pot with a splash of oil, lid wrapped in a towel, lowest heat.',
      },
      { label: 'Rest', minutes: config.restMinutes, detail: 'Off the heat before serving.' },
    ],
  };
}

function saltResult(grams: number, when: string): SaltResult {
  return {
    grams: roundTo(grams, 0.5),
    teaspoons: roundTo(grams / SALT_GRAMS_PER_TSP, 0.25),
    when,
  };
}
