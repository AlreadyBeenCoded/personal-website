/*
 * Pure coffee solver: (methodId, methodAnchor) → everything else.
 * round only once - at the end of the calculation
 */

import {
  CUP_ML,
  ABSORPTION,
  COFFEE_METHOD,
  type MethodId,
  type MethodAnchor,
} from './data';

export type MethodInput = {
  type: MethodId;
  anchor: MethodAnchor;
  anchorValue: number;
  strength: number;
};

export type CoffeeResult = {
  doseG: number;
  waterG: number;
  cups: number;
  ratio: number;
  grind: string;
  tempC: number;
  bloomG: number | null;
  iceG: number | null;
  hotWaterG: number | null;
  brewTime: string;
};

const roundTo = (value: number, step: number) => Math.round(value / step) * step;

/** Map -1…1 into a [stronger, weaker] band. */
const inBand = ([stronger, weaker]: [number, number], t: number) =>
  stronger + ((clamp(t) + 1) / 2) * (weaker - stronger);

const clamp = (t: number) => Math.min(1, Math.max(-1, t));

export function solveCoffee(input: MethodInput): CoffeeResult {
  const config = COFFEE_METHOD[input.type];
  const ratio = inBand(config.ratioBand, input.strength);

  let doseG = number;
  switch (input.anchor) {
    case 'dose':
      doseG = input.anchorValue;
      break;
    case 'water':
      doseG = input.anchorValue / ratio; //dose = water/ratio
      break;
    case 'cups':
      doseG = input.anchorValue x 240 / (ratio - ABSORPTION); //convert cups to ML, divide by ratio less absorbtion
      break;
  
  
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
