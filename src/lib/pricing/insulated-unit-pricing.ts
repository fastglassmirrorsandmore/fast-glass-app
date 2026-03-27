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
  sqFt: number;
  materialsAmount: number;
  adjustedMaterialsAmount: number;
  taxAmount: number;
  totalAmount: number;
};

function roundTo(value: number, places: number): number {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
}

export function priceInsulatedUnit(
  input: InsulatedUnitPricingInput
): InsulatedUnitPricingResult {
  const sqFt = roundTo((input.width * input.height) / 144, 4);

  const lite1 = sqFt * input.lite1CostPerSqFt;
  const lite2 = sqFt * input.lite2CostPerSqFt;
  const spacer = sqFt * input.spacerCostPerSqFt;

  const materials = lite1 + lite2 + spacer;
  const adjustedMaterials = materials * input.pricingCategoryMultiplier;

  const tax = input.customerTaxExempt ? 0 : adjustedMaterials * input.quoteTaxRate;
  const total = adjustedMaterials + tax;

  return {
    sqFt,
    materialsAmount: roundTo(materials, 2),
    adjustedMaterialsAmount: roundTo(adjustedMaterials, 2),
    taxAmount: roundTo(tax, 2),
    totalAmount: roundTo(total, 2),
  };
}