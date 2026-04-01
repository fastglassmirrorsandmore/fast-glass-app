"use client";

import { useMemo, useState } from "react";
import { priceInsulatedUnit } from "../../../lib/pricing/insulated-unit-pricing";

const PRICING_CATEGORIES = [
  { id: "retail", name: "Retail", multiplier: 1.0 },
  { id: "contractor", name: "Contractor", multiplier: 0.9 },
  { id: "apartment", name: "Apartment", multiplier: 0.8 },
];

const TAX_RATES = [
  { id: "none", name: "No Tax", rate: 0 },
  { id: "sample", name: "Sample Tax", rate: 0.07 },
];

const GLASS_PRODUCTS = [
  { id: "clear18", name: 'Clear 1/8"', costPerSqFt: 7.5 },
  { id: "loe18", name: 'Low-E 1/8"', costPerSqFt: 11.2 },
];

const SPACERS = [
  { id: "quarter", name: '1/4"', costPerSqFt: 0.25 },
  { id: "five16", name: '5/16"', costPerSqFt: 0.25 },
  { id: "three8", name: '3/8"', costPerSqFt: 0.15 },
  { id: "seven16", name: '7/16"', costPerSqFt: 0.30 },
  { id: "half", name: '1/2"', costPerSqFt: 0.20 },
  { id: "five8", name: '5/8"', costPerSqFt: 0.35 },
];

function getById<T extends { id: string }>(items: T[], id: string): T {
  return items.find((item) => item.id === id) ?? items[0];
}
function parseDimension(value: string): number {
  if (!value) return 0;

  const trimmed = value.trim();

  if (trimmed.includes(" ")) {
    const [whole, fraction] = trimmed.split(" ");
    const [num, den] = fraction.split("/");
    return Number(whole) + Number(num) / Number(den);
  }

  if (trimmed.includes("/")) {
    const [num, den] = trimmed.split("/");
    return Number(num) / Number(den);
  }

  return Number(trimmed);
}

export default function NewQuotePage() {
const [width, setWidth] = useState("36");
const [height, setHeight] = useState("48");
  const [quantity, setQuantity] = useState(1);
  const [lite1Id, setLite1Id] = useState("clear18");
  const [lite2Id, setLite2Id] = useState("loe18");
  const [spacerId, setSpacerId] = useState("half");
  const [pricingCategoryId, setPricingCategoryId] = useState("retail");
  const [taxRateId, setTaxRateId] = useState("sample");
  const [customerTaxExempt, setCustomerTaxExempt] = useState(false);

  const pricingCategory = getById(PRICING_CATEGORIES, pricingCategoryId);
  const taxRate = getById(TAX_RATES, taxRateId);
  const lite1 = getById(GLASS_PRODUCTS, lite1Id);
  const lite2 = getById(GLASS_PRODUCTS, lite2Id);
  const spacer = getById(SPACERS, spacerId);

  const totals = useMemo(() => {
const parsedWidth = parseDimension(width);
const parsedHeight = parseDimension(height);const result = priceInsulatedUnit({
  width: parsedWidth,
  height: parsedHeight,
      lite1CostPerSqFt: lite1.costPerSqFt,
      lite2CostPerSqFt: lite2.costPerSqFt,
      spacerCostPerSqFt: spacer.costPerSqFt,
      pricingCategoryMultiplier: pricingCategory.multiplier,
      quoteTaxRate: taxRate.rate,
      customerTaxExempt,
      spacerOverride: false,
    });

    return {
  actualWidth: result.actualWidth,
  actualHeight: result.actualHeight,
  billedWidth: result.billedWidth,
  billedHeight: result.billedHeight,
  sqFt: result.sqFt,
  lite1Amount: result.lite1Amount * quantity,
  lite2Amount: result.lite2Amount * quantity,
  spacerAmount: result.spacerAmount * quantity,
  materialsAmount: result.materialsAmount * quantity,
  adjustedMaterialsAmount: result.adjustedMaterialsAmount * quantity,
  taxAmount: result.taxAmount * quantity,
  totalAmount: result.totalAmount * quantity,
};
  }, [
    width,
    height,
    quantity,
    lite1,
    lite2,
    spacer,
    pricingCategory,
    taxRate,
    customerTaxExempt,
  ]);

  return (
    <main style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Quote Builder</h1>

     <div>
  <label>Width: </label>
  <input
    type="text"
    value={width}
    onChange={(e) => setWidth(e.target.value)}
  />
</div>

<div>
  <label>Height: </label>
  <input
    type="text"
    value={height}
    onChange={(e) => setHeight(e.target.value)}
  />
</div>
      <div>
        <label>Quantity: </label>
        <input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value) || 1)} />
      </div>

      <div>
        <label>Lite 1: </label>
        <select value={lite1Id} onChange={(e) => setLite1Id(e.target.value)}>
          {GLASS_PRODUCTS.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Lite 2: </label>
        <select value={lite2Id} onChange={(e) => setLite2Id(e.target.value)}>
          {GLASS_PRODUCTS.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Spacer: </label>
        <select value={spacerId} onChange={(e) => setSpacerId(e.target.value)}>
          {SPACERS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Pricing Category: </label>
        <select value={pricingCategoryId} onChange={(e) => setPricingCategoryId(e.target.value)}>
          {PRICING_CATEGORIES.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Tax Rate: </label>
        <select value={taxRateId} onChange={(e) => setTaxRateId(e.target.value)}>
          {TAX_RATES.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={customerTaxExempt}
            onChange={(e) => setCustomerTaxExempt(e.target.checked)}
          />
          Customer Tax Exempt
        </label>
      </div>

      <hr />

      <h2>Internal Cost Breakdown</h2>
<p>Sq Ft: {totals.sqFt.toFixed(2)}</p>
      <p>Lite 1 Cost: ${totals.lite1Amount.toFixed(2)}</p>
      <p>Lite 2 Cost: ${totals.lite2Amount.toFixed(2)}</p>
      <p>Spacer Cost: ${totals.spacerAmount.toFixed(2)}</p>
      <p>Raw Materials: ${totals.materialsAmount.toFixed(2)}</p>
      <p>Adjusted Materials: ${totals.adjustedMaterialsAmount.toFixed(2)}</p>
      <p>Tax: ${totals.taxAmount.toFixed(2)}</p>
      <p>Total: ${totals.totalAmount.toFixed(2)}</p>
    </main>
  );
}