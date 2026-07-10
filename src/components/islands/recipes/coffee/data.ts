/*
 * Different styles of coffee brewing gives different qualities
 * it also needs different times, temps, and grinds
 * This serves as an easy way to calculate all of the variations 
 */

export type MethodId =
  | 'v60'
  | 'frenchPress'
  | 'aeropress'
  | 'icedAeropress'

export type MethodAnchor = 'dose' | 'water' | 'cups';

export const CUP_ML = 200;
export const ABSORPTION = 2; /* grounds retain ~2 g water per g of coffee — why cups ≠ brew water */

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

export const COFFEE_METHOD: Record<MethodId, MethodConfig> = {
  v60: {
    id: 'v60',
    label: 'V60',
    ratioBand: [14, 17],
    grind: 'medium-fine',
    tempC: 94,
    bloomFactor: 2.5,
    brewTime: '2:30-3:00',      
    icePct: null
  },
  frenchPress: {
    id: 'frenchPress',
    label: 'French press',
    ratioBand: [12, 15],
    grind: 'coarse',
    tempC: 95,
    bloomFactor: null,
    brewTime: '4:00 + plunge',
    icePct: null
  },
  aeropress: {
    id: 'aeropress',
    label: 'AeroPress',
    ratioBand: [12, 16],
    grind: 'medium-fine',
    tempC: 90,
    bloomFactor: 2,
    brewTime: '1:30-2:00',
    icePct: null
  },
  icedAeropress: {
    id: 'icedAeropress',
    label: 'Iced AeroPress',
    ratioBand: [11, 14],
    grind: 'fine',
    tempC: 95,
    bloomFactor: 2,
    brewTime: '1:00-1:30',
    icePct: 0.40
  },
};
