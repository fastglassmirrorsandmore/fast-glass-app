"use client";

import { useEffect, useMemo, useState } from "react";
import { priceInsulatedUnit } from "../../../lib/pricing/insulated-unit-pricing";
import { parseFractionalInches } from "../../../lib/dimensions";

type QuoteItem = {
  id: string;
  part: string;
  description: string;
  qty: number;
  width: string;
  height: string;
  oa: string;
  lineTotal: number;
};

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

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
  { id: "clear18", name: 'Clear 1/8"', costPerSqFt: 7.5, thickness: 0.125, thicknessLabel: '1/8"' },
  { id: "loe18", name: 'Low-E 1/8"', costPerSqFt: 11.2, thickness: 0.125, thicknessLabel: '1/8"' },
];

const SPACERS = [
  { id: "quarter", name: '1/4"', costPerSqFt: 0.25, thickness: 0.25, thicknessLabel: '1/4"' },
  { id: "five16", name: '5/16"', costPerSqFt: 0.25, thickness: 0.3125, thicknessLabel: '5/16"' },
  { id: "three8", name: '3/8"', costPerSqFt: 0.15, thickness: 0.375, thicknessLabel: '3/8"' },
  { id: "seven16", name: '7/16"', costPerSqFt: 0.3, thickness: 0.4375, thicknessLabel: '7/16"' },
  { id: "half", name: '1/2"', costPerSqFt: 0.2, thickness: 0.5, thicknessLabel: '1/2"' },
  { id: "five8", name: '5/8"', costPerSqFt: 0.35, thickness: 0.625, thicknessLabel: '5/8"' },
];

function getById<T extends { id: string }>(items: T[], id: string): T {
  return items.find((item) => item.id === id) ?? items[0];
}

export default function NewQuotePage() {
  const [width, setWidth] = useState("36");
  const [height, setHeight] = useState("48");
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([]);
  const [measurementType, setMeasurementType] = useState("actual");
  const [finalMeasurementsRequired, setFinalMeasurementsRequired] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [showInternalPricing, setShowInternalPricing] = useState(true);
  const [lite1Id, setLite1Id] = useState("clear18");
  const [lite2Id, setLite2Id] = useState("loe18");
  const [spacerId, setSpacerId] = useState("half");
  const [pricingCategoryId, setPricingCategoryId] = useState("retail");
  const [taxRateId, setTaxRateId] = useState("sample");
  const [customerTaxExempt, setCustomerTaxExempt] = useState(false);
  const [showDimensionsOnQuote, setShowDimensionsOnQuote] = useState(false);
  const [partCode, setPartCode] = useState("IGC6");
  const [description, setDescription] = useState("Insulated ClimaGuard 70/36 Low-E");
useEffect(() => {
  if (partCode === "IGC6") {
    setDescription("Insulated ClimaGuard 70/36 Low-E");
  } else if (partCode === "IGCR") {
    setDescription("Insulated Clear");
  } else if (partCode === "IGC270") {
    setDescription("Insulated Cardinal 270");
  } else if (partCode === "IGC366") {
    setDescription("Insulated Cardinal 366 Low-E");
  } else if (!partCode.trim()) {
    setDescription("");
  }
}, [partCode]);

  const [laborItems, setLaborItems] = useState([
    {
      id: 1,
      description: "Labor",
      hours: "0",
      rate: "120",
      override: "",
      note: "",
      showNoteOnQuote: false,
    },
  ]);

  const [showTripCharge, setShowTripCharge] = useState(false);
  const [tripChargeMiles, setTripChargeMiles] = useState("0");
  const [tripChargeRate, setTripChargeRate] = useState("2.725");


// ✅ PASTE FUNCTION HERE
function handleAddUnit() {
  if (!width.trim() || !height.trim()) {
    alert("Please enter width and height.");
    return;
  }

  if (!partCode.trim()) {
    alert("Please enter a part code.");
    return;
  }

  if (!description.trim()) {
    alert("Please enter a description.");
    return;
  }

  if (quantity <= 0) {
    alert("Quantity must be at least 1.");
    return;
  }

  const newItem: QuoteItem = {
    id: crypto.randomUUID(),
    part: partCode,
    description: description,
    qty: quantity,
    width,
    height,
    oa: overallThickness,
    lineTotal: priceEach * quantity,
  };

  setQuoteItems((prev) => [...prev, newItem]);

  setWidth("");
  setHeight("");
  setQuantity(1);
  setPartCode("");
  setDescription("");
}

  const pricingCategory = getById(PRICING_CATEGORIES, pricingCategoryId);
  const taxRate = getById(TAX_RATES, taxRateId);
  const lite1 = getById(GLASS_PRODUCTS, lite1Id);
  const lite2 = getById(GLASS_PRODUCTS, lite2Id);
  const spacer = getById(SPACERS, spacerId);
  const overallThickness = lite1.thickness + spacer.thickness + lite2.thickness;

  function formatThickness(value: number): string {
    const fractions: Record<string, string> = {
      "0.125": '1/8"',
      "0.25": '1/4"',
      "0.375": '3/8"',
      "0.5": '1/2"',
      "0.625": '5/8"',
      "0.75": '3/4"',
      "0.875": '7/8"',
      "1": '1"',
    };

    const rounded = Number(value.toFixed(3)).toString();
    return fractions[rounded] ?? `${value}"`;
  }

  const totals = useMemo(() => {
    const parsedWidth = parseFractionalInches(width);
    const parsedHeight = parseFractionalInches(height);

    if (parsedWidth === null || parsedHeight === null) {
      return null;
    }

    const result = priceInsulatedUnit({
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
      actualWidth: parsedWidth,
      actualHeight: parsedHeight,
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

  const customerSubtotal = totals ? totals.adjustedMaterialsAmount : 0;
  const customerTax = totals ? totals.taxAmount : 0;

  const laborTotal = laborItems.reduce((sum, item) => {
    const calculated = (Number(item.hours) || 0) * (Number(item.rate) || 0);
    const finalAmount =
      item.override !== "" ? (Number(item.override) || 0) : calculated;

    return sum + finalAmount;
  }, 0);

  const tripChargeTotal = showTripCharge
    ? (Number(tripChargeMiles) || 0) * (Number(tripChargeRate) || 0)
    : 0;

  const customerTotal =
    customerSubtotal + laborTotal + tripChargeTotal + customerTax;

  const priceEach = quantity > 0 ? customerSubtotal / quantity : 0;

  const lineDescription = showDimensionsOnQuote
    ? `${partCode} - ${description} - ${formatThickness(overallThickness)} - ${width} X ${height}`
    : `${partCode} - ${description} - ${formatThickness(overallThickness)}`;

  const displayQuoteItems = quoteItems.map((item, index) => {
    if (index === 0) {
      return {
        ...item,
        description,
        quantity,
        partCode,
        width,
        height,
        measurementType,
        finalMeasurementsRequired,
        oa: formatThickness(overallThickness),
        lineTotal: customerSubtotal,
      };
    }

    return item;
  });

  return (
    <main style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1 style={{ marginBottom: "20px" }}>Quote Builder</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "24px",
          alignItems: "start",
        }}
      >
        <div>
          <button
            type="button"
            onClick={() =>
              setQuoteItems([
                ...quoteItems,
                {
                  id: Date.now(),
                  description: "",
                  quantity: 1,
                  partCode: "IGC6",
                  width: "",
                  height: "",
                  measurementType: "actual",
                  finalMeasurementsRequired: false,
                  oa: "",
                  lineTotal: 0,
                },
              ])
            }
          >
            Add Quote Item
          </button>

          <h2>Quote Items</h2>

          {displayQuoteItems.map((item) => (
            <div
              key={item.id}
              style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}
            >
              <p><strong>Description:</strong> {item.description || "No description"}</p>
              <p><strong>Qty:</strong> {item.quantity}</p>
              <p><strong>Part:</strong> {item.partCode}</p>
              <p>
                <strong>{item.measurementType === "block" ? "Block Size:" : "Size:"}</strong>{" "}
                {item.width} x {item.height}
              </p>
              <p><strong>OA:</strong> {formatThickness(overallThickness)}</p>
              {item.measurementType === "block" && (
                <p style={{ color: "red", fontWeight: "bold" }}>See Original</p>
              )}
              {item.finalMeasurementsRequired && (
                <p style={{ color: "red", fontWeight: "bold" }}>
                  Final field measurements required before production.
                </p>
              )}
              <p><strong>Line Total:</strong> {currency.format(item.lineTotal)}</p>
            </div>
          ))}

          <div style={{ border: "1px solid #ccc", padding: "16px", marginBottom: "20px", background: "#fafafa" }}>
            <h2 style={{ marginTop: 0 }}>Labor</h2>

            {laborItems.map((item, index) => {
              const calculated = (Number(item.hours) || 0) * (Number(item.rate) || 0);
              const finalAmount =
                item.override !== "" ? (Number(item.override) || 0) : calculated;

              return (
                <div key={item.id} style={{ border: "1px solid #ddd", padding: "12px", marginBottom: "12px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => {
                        const updated = [...laborItems];
                        updated[index].description = e.target.value;
                        setLaborItems(updated);
                      }}
                      placeholder="Labor Description"
                    />

                    <input
                      type="number"
                      value={item.hours}
                      onChange={(e) => {
                        const updated = [...laborItems];
                        updated[index].hours = e.target.value;
                        setLaborItems(updated);
                      }}
                      placeholder="Hours"
                    />

                    <input
                      type="number"
                      value={item.rate}
                      onChange={(e) => {
                        const updated = [...laborItems];
                        updated[index].rate = e.target.value;
                        setLaborItems(updated);
                      }}
                      placeholder="Rate"
                    />

                    <input
                      type="number"
                      value={item.override}
                      onChange={(e) => {
                        const updated = [...laborItems];
                        updated[index].override = e.target.value;
                        setLaborItems(updated);
                      }}
                      placeholder="Override Amount"
                    />
                  </div>

                  <div style={{ marginTop: "12px" }}>
                    <textarea
                      value={item.note}
                      onChange={(e) => {
                        const updated = [...laborItems];
                        updated[index].note = e.target.value;
                        setLaborItems(updated);
                      }}
                      placeholder="Explanation / note for additional labor"
                      style={{ width: "100%" }}
                      rows={3}
                    />
                  </div>

                  <div style={{ marginTop: "12px" }}>
                    <label>
                      <input
                        type="checkbox"
                        checked={item.showNoteOnQuote}
                        onChange={(e) => {
                          const updated = [...laborItems];
                          updated[index].showNoteOnQuote = e.target.checked;
                          setLaborItems(updated);
                        }}
                      />{" "}
                      Show note on quote
                    </label>
                  </div>

                  <div style={{ marginTop: "8px" }}>
                    Labor Line Total: {currency.format(finalAmount)}
                  </div>
                </div>
              );
            })}

            <button
              type="button"
              onClick={() => {
                setLaborItems([
                  ...laborItems,
                  {
                    id: Date.now(),
                    description: "Labor",
                    hours: "0",
                    rate: "120",
                    override: "",
                    note: "",
                    showNoteOnQuote: false,
                  },
                ]);
              }}
            >
              Add Labor Line
            </button>

            <div style={{ marginTop: "12px" }}>
              Labor Total: {currency.format(laborTotal)}
            </div>
          </div>

          <div style={{ border: "1px solid #ccc", padding: "16px", marginBottom: "20px", background: "#fafafa" }}>
            <label>
              <input
                type="checkbox"
                checked={showTripCharge}
                onChange={(e) => setShowTripCharge(e.target.checked)}
              />{" "}
              Add Trip Charge
            </label>

            {showTripCharge && (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "12px" }}>
                  <input
                    type="number"
                    value={tripChargeMiles}
                    onChange={(e) => setTripChargeMiles(e.target.value)}
                    placeholder="TC Miles"
                  />

                  <input
                    type="number"
                    value={tripChargeRate}
                    onChange={(e) => setTripChargeRate(e.target.value)}
                    placeholder="TC Rate"
                  />
                </div>

                <div style={{ marginTop: "12px" }}>
                  Trip Charge Total: {currency.format(tripChargeTotal)}
                </div>
              </>
            )}
          </div>

          <div>
            <label>Width: </label>
            <input type="text" value={width} onChange={(e) => setWidth(e.target.value)} />
          </div>

          <div>
            <label>Height: </label>
            <input type="text" value={height} onChange={(e) => setHeight(e.target.value)} />
          </div>

          <div>
<div>
  <button type="button" onClick={handleAddUnit}>
    Add Unit to Quote
  </button>
</div>
            <label>Measurement Type: </label>
            <select value={measurementType} onChange={(e) => setMeasurementType(e.target.value)}>
              <option value="actual">Actual</option>
              <option value="block">Block</option>
            </select>
          </div>

          {measurementType === "block" && (
            <p style={{ color: "red", fontWeight: "bold" }}>See Original</p>
          )}

          <div>
            <label>
              <input
                type="checkbox"
                checked={finalMeasurementsRequired}
                onChange={(e) => setFinalMeasurementsRequired(e.target.checked)}
              />
              Final field measurements required before production.
            </label>
          </div>

          <div>
            <label>Quantity: </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value) || 1)}
            />
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

          <p>
            <strong>OA:</strong> {formatThickness(overallThickness)}
          </p>

          <div>
            <label>Part Code: </label>
            <input
              type="text"
              value={partCode}
              onChange={(e) => setPartCode(e.target.value)}
            />
          </div>

          <div>
            <label>Description: </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label>
              <input
                type="checkbox"
                checked={showDimensionsOnQuote}
                onChange={(e) => setShowDimensionsOnQuote(e.target.checked)}
              />
              Show Dimensions on Quote
            </label>
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

          <div>
            <label>
              <input
                type="checkbox"
                checked={showInternalPricing}
                onChange={(e) => setShowInternalPricing(e.target.checked)}
              />
              Show Internal Pricing
            </label>
          </div>
        </div>

        <div>
          <div style={{ border: "1px solid #ccc", padding: "16px", marginBottom: "20px", background: "#fafafa" }}>
            <h2 style={{ marginTop: 0 }}>Customer Quote Summary</h2>
            <p><strong>Price Each:</strong> {currency.format(priceEach)}</p>
            <p><strong>Line Total:</strong> {currency.format(customerSubtotal)}</p>
            <p><strong>Subtotal:</strong> {currency.format(customerSubtotal)}</p>
            <p>Labor: {currency.format(laborTotal)}</p>

            {laborItems
              .filter((item) => item.showNoteOnQuote && item.note.trim() !== "")
              .map((item) => (
                <p key={item.id}><strong>Labor Note:</strong> {item.note}</p>
              ))}

            <p><strong>Tax:</strong> {currency.format(customerTax)}</p>
            <p><strong>Total:</strong> {currency.format(customerTotal)}</p>
            <p><strong>Balance:</strong> {currency.format(customerTotal)}</p>
          </div>

          <div style={{ border: "1px solid #ccc", padding: "16px", marginBottom: "20px", background: "#fafafa" }}>
            <h2 style={{ marginTop: 0 }}>Totals</h2>

            <div>
              <p><strong>Materials Subtotal:</strong> {currency.format(customerSubtotal)}</p>
              <p><strong>Labor:</strong> {currency.format(laborTotal)}</p>
              {showTripCharge && (
                <p><strong>Trip Charge:</strong> {currency.format(tripChargeTotal)}</p>
              )}
              <p><strong>Tax:</strong> {currency.format(customerTax)}</p>
              <p><strong>Grand Total:</strong> {currency.format(customerTotal)}</p>
            </div>
          </div>

          {showInternalPricing && (
            <div style={{ border: "1px solid #ccc", padding: "16px", marginBottom: "20px", background: "#fafafa" }}>
              <h2 style={{ marginTop: 0 }}>Internal Cost Breakdown</h2>
              {totals ? (
                <>
                  <p>Sq Ft: {totals.sqFt.toFixed(2)}</p>
                  <p>Lite 1 Cost: {currency.format(totals.lite1Amount)}</p>
                  <p>Lite 2 Cost: {currency.format(totals.lite2Amount)}</p>
                  <p>Spacer Cost: {currency.format(totals.spacerAmount)}</p>
                  <p>Raw Materials: {currency.format(totals.materialsAmount)}</p>
                  <p>Adjusted Materials: {currency.format(totals.adjustedMaterialsAmount)}</p>
                  <p>Tax: {currency.format(totals.taxAmount)}</p>
                  <p>Total: {currency.format(totals.totalAmount)}</p>
                </>
              ) : (
                <p>Enter a valid width and height.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}