/*
 * Domain knowledge for the rice solver. Everything a rice type "knows" —
 * density, washes, soak, salt, water ratio or parboil timing — lives here
 * as data, so adding a type is a config change, not a solver change.
 *
 * Two cooking methods exist and they are genuinely different:
 *  - absorption: measured water, cooked until fully absorbed (most types)
 *  - parboil-drain: boiled in abundant salted water like pasta, drained,
 *    then steamed (Afghan challow/palaw with sella basmati)
 */

export type RiceTypeId =
  | 'jasmine'
  | 'basmati'
  | 'shortGrain'
  | 'sushi'
  | 'afghan'
  | 'brown';

export type RiceUnit = 'g' | 'go' | 'cups';

// [firmer, softer] — the texture slider interpolates inside this band.
type Band = [number, number];

type AbsorptionMethod = {
  kind: 'absorption';
  /** Water : rice by volume, the traditional way these ratios are quoted. */
  waterRatioByVolume: Band;
  simmerMinutes: number;
};

type ParboilDrainMethod = {
  kind: 'parboil-drain';
  /** Firmer texture = shorter parboil; the steam finishes the grain. */
  parboilMinutes: Band;
  steamMinutes: number;
  /** Parboil water is generous, like pasta water — quoted per g of rice. */
  parboilWaterMlPerGram: number;
  saltGramsPerLiter: number;
};

export type RiceTypeConfig = {
  id: RiceTypeId;
  label: string;
  /** Dry density, g per ml — converts 合/cups to the canonical grams. */
  gramsPerMl: number;
  washes: number;
  soakMinutes: number;
  /**
   * Salt in the cooking water, g per 100 g rice. null = traditionally
   * unsalted (Japanese types, jasmine); parboil-drain salts by water
   * volume instead, so it also uses null here.
   */
  saltGramsPer100g: number | null;
  saltNote?: string;
  method: AbsorptionMethod | ParboilDrainMethod;
  restMinutes: number;
  fluff: string;
};

export const GO_ML = 180;
export const CUP_ML = 240;
/** Uncooked grams per serving — one modest bowl. 1 合 ≈ 2 servings. */
export const GRAMS_PER_SERVING = 75;
/** Fine table salt, g per teaspoon. */
export const SALT_GRAMS_PER_TSP = 6;

export const RICE_TYPES: Record<RiceTypeId, RiceTypeConfig> = {
  shortGrain: {
    id: 'shortGrain',
    label: 'Short grain',
    gramsPerMl: 0.83, // 1 合 = 180 ml ≈ 150 g
    washes: 3,
    soakMinutes: 30,
    saltGramsPer100g: null,
    saltNote: 'Traditionally unsalted — season the dish, not the rice.',
    method: { kind: 'absorption', waterRatioByVolume: [1.05, 1.25], simmerMinutes: 13 },
    restMinutes: 10,
    fluff: 'Cut and turn from the bottom with a paddle to release steam.',
  },
  sushi: {
    id: 'sushi',
    label: 'Sushi',
    gramsPerMl: 0.83,
    washes: 3,
    soakMinutes: 30,
    saltGramsPer100g: null,
    saltNote: 'No salt in the pot — the seasoning comes from the sushi-zu.',
    // Drier than plain short grain: the vinegar seasoning adds moisture back.
    method: { kind: 'absorption', waterRatioByVolume: [1.0, 1.12], simmerMinutes: 13 },
    restMinutes: 10,
    fluff: 'Turn into a wide bowl, fold in sushi-zu with cutting strokes while fanning.',
  },
  jasmine: {
    id: 'jasmine',
    label: 'Jasmine',
    gramsPerMl: 0.78,
    washes: 2,
    soakMinutes: 0,
    saltGramsPer100g: null,
    saltNote: 'Usually unsalted — its aroma is the point.',
    method: { kind: 'absorption', waterRatioByVolume: [1.1, 1.35], simmerMinutes: 13 },
    restMinutes: 10,
    fluff: 'Fluff gently with a fork.',
  },
  basmati: {
    id: 'basmati',
    label: 'Basmati',
    gramsPerMl: 0.76,
    washes: 3,
    soakMinutes: 25,
    saltGramsPer100g: 1.5, // ≈ ½ tsp per cup of dry rice
    // Ratio assumes the soak; unsoaked basmati would want more water.
    method: { kind: 'absorption', waterRatioByVolume: [1.3, 1.6], simmerMinutes: 12 },
    restMinutes: 8,
    fluff: 'Fluff gently with a fork — the grains should stay separate.',
  },
  afghan: {
    id: 'afghan',
    label: 'Afghan (sella)',
    gramsPerMl: 0.76,
    washes: 3,
    soakMinutes: 60,
    saltGramsPer100g: null,
    method: {
      kind: 'parboil-drain',
      parboilMinutes: [5, 8],
      steamMinutes: 25,
      parboilWaterMlPerGram: 8,
      saltGramsPerLiter: 15,
    },
    restMinutes: 5,
    fluff: 'Mound gently with a slotted spoon — never press.',
  },
  brown: {
    id: 'brown',
    label: 'Brown',
    gramsPerMl: 0.8,
    washes: 1,
    soakMinutes: 45,
    saltGramsPer100g: 0.8,
    method: { kind: 'absorption', waterRatioByVolume: [1.5, 1.9], simmerMinutes: 40 },
    restMinutes: 10,
    fluff: 'Fluff with a fork.',
  },
};
