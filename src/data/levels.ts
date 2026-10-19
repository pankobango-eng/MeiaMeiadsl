/**
 * Standard Scoring and Timer Penalty Rules based on sensitivity rating (1 to 5)
 */
export interface SensitivityRule {
  rating: number;
  points: number;
  timeDeductionSec: number;
  label: string;
}

export const SENSITIVITY_RULES: Record<number, SensitivityRule> = {
  5: { rating: 5, points: 100, timeDeductionSec: 0.5, label: 'Ultra Reflex (5)' },
  4: { rating: 4, points: 75, timeDeductionSec: 1.0, label: 'High Sensitivity (4)' },
  3: { rating: 3, points: 50, timeDeductionSec: 1.5, label: 'Moderate (3)' },
  2: { rating: 2, points: 25, timeDeductionSec: 2.0, label: 'Resilient (2)' },
  1: { rating: 1, points: 10, timeDeductionSec: 3.0, label: 'Deep Cushion (1)' },
};

export function getSensitivityRule(rating: number): SensitivityRule {
  const rounded = Math.max(1, Math.min(5, Math.round(rating)));
  return SENSITIVITY_RULES[rounded] || SENSITIVITY_RULES[3];
}
