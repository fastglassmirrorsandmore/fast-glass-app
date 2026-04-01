export function parseFractionalInches(input: string | number): number | null {
  if (typeof input === "number") {
    return Number.isFinite(input) ? input : null;
  }

  if (!input) return null;

  const value = input.trim();

  // Whole number or decimal
  if (/^\d+(\.\d+)?$/.test(value)) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  // Mixed number like "30 1/4"
  const mixedMatch = value.match(/^(\d+)\s+(\d+)\/(\d+)$/);
  if (mixedMatch) {
    const whole = Number(mixedMatch[1]);
    const numerator = Number(mixedMatch[2]);
    const denominator = Number(mixedMatch[3]);

    if (
      !Number.isFinite(whole) ||
      !Number.isFinite(numerator) ||
      !Number.isFinite(denominator) ||
      denominator === 0
    ) {
      return null;
    }

    return whole + numerator / denominator;
  }

  // Fraction only like "1/4"
  const fractionMatch = value.match(/^(\d+)\/(\d+)$/);
  if (fractionMatch) {
    const numerator = Number(fractionMatch[1]);
    const denominator = Number(fractionMatch[2]);

    if (
      !Number.isFinite(numerator) ||
      !Number.isFinite(denominator) ||
      denominator === 0
    ) {
      return null;
    }

    return numerator / denominator;
  }

  return null;
}

export function roundUpToNextEvenInch(inches: number): number {
  if (!Number.isFinite(inches) || inches <= 0) return 0;
  return Math.ceil(inches / 2) * 2;
}

export function calculateBilledSquareFeet(
  widthInches: number,
  heightInches: number,
  minimumSqFt = 3
): number {
  if (
    !Number.isFinite(widthInches) ||
    !Number.isFinite(heightInches) ||
    widthInches <= 0 ||
    heightInches <= 0
  ) {
    return 0;
  }

  const billedWidth = roundUpToNextEvenInch(widthInches);
  const billedHeight = roundUpToNextEvenInch(heightInches);

  const sqFt = (billedWidth * billedHeight) / 144;

  return Math.max(sqFt, minimumSqFt);
}