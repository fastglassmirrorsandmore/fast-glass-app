export type InsulatedUnitPricingInput = {
  width: number;
  height: number;
  lite1CostPerSqFt: number;
  lite2CostPerSqFt: number;
  spacerCostPerSqFt: number;
  pricingCategoryMultiplier: number;
  quoteTaxRate: number;
  customerTaxExempt: boolean;
  spacerOverride: boolean;
};

export type InsulatedUnitPricingResult = {
  actualWidth: number;
  actualHeight: number;
  billedWidth: number;
  billedHeight: number;
  sqFt: number;
  lite1Amount: number;
  lite2Amount: number;
  spacerAmount: number;
  materialsAmount: number;
  adjustedMaterialsAmount: number;
  taxAmount: number;
  totalAmount: number;
};

function roundTo(value: number, places: number): number {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
}

function roundUpToNextEven(value: number): number {
  const roundedUp = Math.ceil(value);
  return roundedUp % 2 === 0 ? roundedUp : roundedUp + 1;
}

export function priceInsulatedUnit(
  input: InsulatedUnitPricingInput
): InsulatedUnitPricingResult {
  const actualWidth = input.width;
  const actualHeight = input.height;

  const billedWidth = roundUpToNextEven(actualWidth);
  const billedHeight = roundUpToNextEven(actualHeight);

  const calculatedSqFt = (billedWidth * billedHeight) / 144;
  const sqFt = roundTo(Math.max(calculatedSqFt, 3), 4);

  const lite1 = sqFt * input.lite1CostPerSqFt;
  const lite2 = sqFt * input.lite2CostPerSqFt;
  const spacer = sqFt * input.spacerCostPerSqFt;

  const materials = lite1 + lite2 + spacer;
  const adjustedMaterials = materials * input.pricingCategoryMultiplier;

  const tax = input.customerTaxExempt ? 0 : adjustedMaterials * input.quoteTaxRate;
  const total = adjustedMaterials + tax;

  return {
    actualWidth: roundTo(actualWidth, 4),
    actualHeight: roundTo(actualHeight, 4),
    billedWidth,
    billedHeight,
    sqFt,
    lite1Amount: roundTo(lite1, 2),
    lite2Amount: roundTo(lite2, 2),
    spacerAmount: roundTo(spacer, 2),
    materialsAmount: roundTo(materials, 2),
    adjustedMaterialsAmount: roundTo(adjustedMaterials, 2),
    taxAmount: roundTo(tax, 2),
    totalAmount: roundTo(total, 2),
  };
}