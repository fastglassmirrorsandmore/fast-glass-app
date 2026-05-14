"use client";

import { useEffect, useMemo, useState } from "react";
import { priceInsulatedUnit } from "../../../lib/pricing/insulated-unit-pricing";
import { parseFractionalInches } from "../../../lib/dimensions";

type QuoteItem = {
  id: string;
  part: string;
  description: string;
  location: string;
  qty: number;
  width: string;
  height: string;

  lite1Id: string;
  lite2Id: string;
  spacerId: string;
  pricingCategoryId: string;

  oa: string;
  lineTotal: number;
};

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const PRICING_CATEGORIES = [
  { id: "retail", name: "Retail", multiplier: 2.0 },
  { id: "contractor", name: "Contractor", multiplier: 1.8 },
  { id: "apartment", name: "Apartment", multiplier: 1.6 },
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
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([]);
  const [measurementType, setMeasurementType] = useState("actual");
  const [finalMeasurementsRequired, setFinalMeasurementsRequired] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [lite1Id, setLite1Id] = useState("clear18");
  const [lite2Id, setLite2Id] = useState("loe18");
  const [spacerId, setSpacerId] = useState("half");
  const [pricingCategoryId, setPricingCategoryId] = useState("retail");
  const [taxRateId, setTaxRateId] = useState("sample");
  const [customerTaxExempt, setCustomerTaxExempt] = useState(false);
  const [showDimensionsOnQuote, setShowDimensionsOnQuote] = useState(false);
  const [showFgmmCost, setShowFgmmCost] = useState(true);
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
const [hasContractor, setHasContractor] = useState(true);
const [contractorCustomerId, setContractorCustomerId] = useState("");
const [contractorCompany, setContractorCompany] = useState("");
const [contractorContact, setContractorContact] = useState("");
const [contractorStreet, setContractorStreet] = useState("");
const [contractorCity, setContractorCity] = useState("");
const [contractorState, setContractorState] = useState("");
const [contractorZip, setContractorZip] = useState("");
const [homeownerCustomerId, setHomeownerCustomerId] = useState("");
const [homeownerName, setHomeownerName] = useState("");
const [jobSiteAddress, setJobSiteAddress] = useState("");
const [homeownerPhone, setHomeownerPhone] = useState("");



const [unitLocation, setUnitLocation] = useState("");
const [jobStreet, setJobStreet] = useState("");
const [jobCity, setJobCity] = useState("");
const [jobState, setJobState] = useState("");
const [jobZip, setJobZip] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("deposit");
  const [paymentResponsible, setPaymentResponsible] = useState("customer");
  const [techPaymentNote, setTechPaymentNote] = useState("");

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
    description,
    location: unitLocation,
    qty: quantity,
    width,
    height,
    lite1Id,
    lite2Id,
    spacerId,
    pricingCategoryId,
    oa: formatThickness(overallThickness),
    lineTotal: priceEach * quantity,
  };

  setQuoteItems((prev) => [...prev, newItem]);

  setWidth("");
  setHeight("");
  setQuantity(1);
  setPartCode("IGC6");
  setDescription("Insulated ClimaGuard 70/36 Low-E");
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
    "0.5625": '9/16"',
    "0.625": '5/8"',
    "0.75": '3/4"',
    "0.875": '7/8"',
    "1": '1"',
  };

  const rounded = Number(value.toFixed(3)).toString();
  return fractions[rounded] ?? `${value}"`;
}

function calculateQuoteItemLineTotal(
  item: QuoteItem,
  newWidth: string,
  newHeight: string,
  newQty: number
): number {
  const parsedWidth = parseFractionalInches(newWidth);
  const parsedHeight = parseFractionalInches(newHeight);

  if (parsedWidth === null || parsedHeight === null) {
    return item.lineTotal;
  }

  const itemLite1 = getById(GLASS_PRODUCTS, item.lite1Id);
  const itemLite2 = getById(GLASS_PRODUCTS, item.lite2Id);
  const itemSpacer = getById(SPACERS, item.spacerId);
  const itemPricingCategory = getById(PRICING_CATEGORIES, item.pricingCategoryId);

  const result = priceInsulatedUnit({
    width: parsedWidth,
    height: parsedHeight,
    lite1CostPerSqFt: itemLite1.costPerSqFt,
    lite2CostPerSqFt: itemLite2.costPerSqFt,
    spacerCostPerSqFt: itemSpacer.costPerSqFt,
    pricingCategoryMultiplier: itemPricingCategory.multiplier,
    quoteTaxRate: 0,
    customerTaxExempt: true,
    spacerOverride: false,
  });

  return result.adjustedMaterialsAmount * newQty;
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
  sqFt: result.sqFt,lite1Amount: result.lite1Amount,
lite2Amount: result.lite2Amount,
spacerAmount: result.spacerAmount,
materialsAmount: result.materialsAmount,
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

 const laborTotal = laborItems.reduce((sum, item) => {
  const calculated = (Number(item.hours) || 0) * (Number(item.rate) || 0);
  const finalAmount =
    item.override !== "" ? (Number(item.override) || 0) : calculated;

  return sum + finalAmount;
}, 0);

const tripChargeTotal = showTripCharge
  ? (Number(tripChargeMiles) || 0) * (Number(tripChargeRate) || 0)
  : 0;

const materialSubtotal = quoteItems.reduce(
  (sum, item) => sum + item.lineTotal,
  0
);

const customerSubtotal = materialSubtotal;
const customerTax = customerTaxExempt ? 0 : materialSubtotal * taxRate.rate;
const customerTotal =
  customerSubtotal + laborTotal + tripChargeTotal + customerTax;

const priceEach = totals
  ? totals.materialsAmount * pricingCategory.multiplier
  : 0;

const lineDescription = showDimensionsOnQuote
  ? `${partCode} - ${description} - ${formatThickness(overallThickness)} - ${width} X ${height}`
  : `${partCode} - ${description} - ${formatThickness(overallThickness)}`;

const displayQuoteItems = quoteItems;

return (<main
  style={{
    padding: "20px",
    fontFamily: "Arial",
    maxWidth: "1200px",
    margin: "0 auto",
  }}
>
      <h1 style={{ marginBottom: "20px" }}>Quote Builder</h1>
<div
  style={{
    border: "1px solid #ccc",
    padding: "16px",
    marginBottom: "20px",
    background: "#fafafa",
  }}
>
  <h2 style={{ marginTop: 0 }}>Customer / Job Information</h2>

<div
  style={{
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "24px",
    alignItems: "start",
  }}
>
    <div>
      <div
  style={{
    border: "1px solid #ccc",
    padding: "16px",
    borderRadius: "6px",
    background: "#fff",
  }}
>
      <h3>Contractor / Billing</h3>
<label style={{ display: "flex", gap: "8px", alignItems: "center" }}>
  <input
    type="checkbox"
    checked={hasContractor}
    onChange={(e) => setHasContractor(e.target.checked)}
  />
  This quote has a contractor
</label>
{hasContractor && (
  <div style={{ display: "grid", gap: "12px", marginTop: "12px" }}>
 <label style={{ display: "grid", gap: "4px", fontWeight: 600 }}>
  Customer ID
   <input
      style={{ width: "100%", padding: "8px" }}
      value={contractorCustomerId}
      onChange={(e) => setContractorCustomerId(e.target.value)}
    />
  </label>
<label>
  Company Name
  <input
    style={{ width: "100%", padding: "8px" }}
    value={contractorCompany}
    onChange={(e) => setContractorCompany(e.target.value)}
  />
</label>

<label style={{ display: "grid", gap: "4px", fontWeight: 600 }}>
  Contact Name
 <input
    style={{ width: "100%", padding: "8px" }}
    value={contractorContact}
    onChange={(e) => setContractorContact(e.target.value)}
  />
</label>

<label style={{ display: "grid", gap: "4px", fontWeight: 600 }}>
  Street
  <input
    style={{ width: "100%", padding: "8px" }}
    value={contractorStreet}
    onChange={(e) => setContractorStreet(e.target.value)}
  />
</label>

<div className="grid grid-cols-3 gap-2">
  <label style={{ display: "grid", gap: "4px", fontWeight: 600 }}>
    City
    <input
      style={{ width: "100%", padding: "8px" }}
      value={contractorCity}
      onChange={(e) => setContractorCity(e.target.value)}
    />
  </label>

 <label style={{ display: "grid", gap: "4px", fontWeight: 600 }}>
    State
    <input
      style={{ width: "100%", padding: "8px" }}
      value={contractorState}
      onChange={(e) => setContractorState(e.target.value)}
    />
  </label>

  <label style={{ display: "grid", gap: "4px", fontWeight: 600 }}>
    ZIP
    <input
      style={{ width: "100%", padding: "8px" }}
      value={contractorZip}
      onChange={(e) => setContractorZip(e.target.value)}
    />
   </label>
</div>
</div>
)}
   </div>
</div>

<div
  style={{
    border: "1px solid #ccc",
    padding: "16px",
    borderRadius: "6px",
    background: "#fff",
  }}
>
      <h3>Homeowner / Job Site</h3>
<div style={{ display: "grid", gap: "12px", marginTop: "12px" }}>
<label style={{ display: "grid", gap: "4px", fontWeight: 600 }}>
  Homeowner Name
  <input
    style={{ width: "100%", padding: "8px" }}
    value={homeownerName}
    onChange={(e) => setHomeownerName(e.target.value)}
  />
</label>
<label style={{ display: "grid", gap: "4px", fontWeight: 600 }}>
  Phone
  <input
  style={{ width: "100%", padding: "8px" }}
  value={homeownerPhone}
  onChange={(e) => setHomeownerPhone(e.target.value)}
/>
</label>

<label style={{ display: "grid", gap: "4px", fontWeight: 600 }}>
  Street
  <input
    style={{ width: "100%", padding: "8px" }}
    value={jobStreet}
    onChange={(e) => setJobStreet(e.target.value)}
  />
</label>

<div className="grid grid-cols-3 gap-2">
  <label style={{ display: "grid", gap: "4px", fontWeight: 600 }}>
    City
    <input
      style={{ width: "100%", padding: "8px" }}
      value={jobCity}
      onChange={(e) => setJobCity(e.target.value)}
    />
  </label>

  <label style={{ display: "grid", gap: "4px", fontWeight: 600 }}>
    State
    <input
      style={{ width: "100%", padding: "8px" }}
      value={jobState}
      onChange={(e) => setJobState(e.target.value)}
    />
  </label>
<label style={{ display: "grid", gap: "4px", fontWeight: 600 }}>
  Customer ID / Phone
  <input
    style={{ width: "100%", padding: "8px" }}
    value={homeownerCustomerId}
    onChange={(e) => setHomeownerCustomerId(e.target.value)}
  />
</label>
  <label style={{ display: "grid", gap: "4px", fontWeight: 600 }}>
    ZIP
    <input
      style={{ width: "100%", padding: "8px" }}
      value={jobZip}
      onChange={(e) => setJobZip(e.target.value)}
    />
  </label>
</div>

     
    </div>
  </div>
</div>

<div style={{ marginBottom: "16px" }}>
  <button
    onClick={() => {
      setQuoteItems([]);
      setContractorCustomerId("");
setContractorCompany("");
setContractorContact("");
setContractorStreet("");
setContractorCity("");
setContractorState("");
setContractorZip("");

setHomeownerName("");
setHomeownerPhone("");
setJobStreet("");
setJobCity("");
setJobState("");
setJobZip("");
      setPaymentTerms("deposit");
      setPaymentResponsible("customer");
      setTechPaymentNote("");
      setLaborItems([
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
      setShowTripCharge(false);
      setTripChargeMiles("0");
      setTripChargeRate("2.725");
    }}
    style={{
      padding: "8px 14px",
      background: "#d9534f",
      color: "#fff",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
    }}
  >
    New Quote
  </button>
</div>



      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "24px",
          alignItems: "start",
        }}
      >
        <div>

          <h2>Quote Items</h2>

          {displayQuoteItems.map((item, index) => (
            <div
              key={item.id}
              style={{
  border: "1px solid #ccc",
  borderRadius: "6px",
  padding: "12px",
  marginBottom: "12px",
  background: "#fff",
}}
            >
           <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "6px",
  }}
><div>
  <strong>{item.part}</strong>

  <input
    type="text"
    value={item.location}
    onChange={(e) => {
      const newLocation = e.target.value;

      setQuoteItems((prev) =>
        prev.map((quoteItem) =>
          quoteItem.id === item.id
            ? { ...quoteItem, location: newLocation }
            : quoteItem
        )
      );
    }}
    placeholder="Unit Location"
    style={{
      display: "block",
      marginTop: "4px",
      fontSize: "12px",
      width: "160px",
    }}
  />
</div>

  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}><div style={{ textAlign: "right" }}>
  <div>
    <strong>{currency.format(item.lineTotal)}</strong>
  </div>

  <div style={{ fontSize: "12px", color: "#666" }}>
    {currency.format(item.lineTotal / item.qty)} each
  </div>
</div>

  <button
    onClick={() =>
      setQuoteItems((prev) => [
        ...prev,
        {
          ...item,
          id: crypto.randomUUID(),
        },
      ])
    }
    style={{
      background: "#0275d8",
      color: "#fff",
      border: "none",
      borderRadius: "4px",
      padding: "4px 8px",
      cursor: "pointer",
    }}
  >
    Duplicate
  </button>

  <button
    onClick={() =>
      setQuoteItems((prev) =>
        prev.filter((quoteItem) => quoteItem.id !== item.id)
      )
    }
      style={{
        background: "#d9534f",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        padding: "4px 8px",
        cursor: "pointer",
      }}
    >
      Delete
    </button>
  </div>
</div>

<div style={{ fontSize: "14px", marginBottom: "6px" }}>
  {item.description}
</div>
<div style={{ fontSize: "14px", color: "#555" }}>
  Qty:{" "}
  <input
    type="number"
    min="1"
    value={item.qty}
    onChange={(e) => {
      const newQty = Number(e.target.value) || 1;

      setQuoteItems((prev) =>
        prev.map((quoteItem) =>
          quoteItem.id === item.id
            ? {
                ...quoteItem,
                qty: newQty,
                lineTotal: calculateQuoteItemLineTotal(
                  quoteItem,
                  quoteItem.width,
                  quoteItem.height,
                  newQty
                ),
              }
            : quoteItem
        )
      );
    }}
    style={{ width: "60px", marginRight: "8px" }}
  />

  {" | Size: "}
  <input
    type="text"
    value={item.width}
    onChange={(e) => {
      const newWidth = e.target.value;

      setQuoteItems((prev) =>
        prev.map((quoteItem) =>
          quoteItem.id === item.id
            ? {
                ...quoteItem,
                width: newWidth,
                lineTotal: calculateQuoteItemLineTotal(
                  quoteItem,
                  newWidth,
                  quoteItem.height,
                  quoteItem.qty
                ),
              }
            : quoteItem
        )
      );
    }}
    style={{ width: "70px" }}
  />

  {" x "}
  <input
    type="text"
    value={item.height}
    onChange={(e) => {
      const newHeight = e.target.value;

      setQuoteItems((prev) =>
        prev.map((quoteItem) =>
          quoteItem.id === item.id
            ? {
                ...quoteItem,
                height: newHeight,
                lineTotal: calculateQuoteItemLineTotal(
                  quoteItem,
                  quoteItem.width,
                  newHeight,
                  quoteItem.qty
                ),
              }
            : quoteItem
        )
      );
    }}
    style={{ width: "70px" }}
  />

  {" | OA: "}
  {item.oa}

  <div style={{ fontSize: "12px", color: "#b36b00", marginTop: "4px" }}>
    Size edits recalculate pricing using the current temporary formula.
  </div>
<div style={{ marginTop: "8px", fontSize: "14px" }}>
  Lite 1:{" "}<select
  value={item.lite1Id}
  onChange={(e) => {
    const newLite1Id = e.target.value;

    setQuoteItems((prev) =>
      prev.map((quoteItem) =>
        quoteItem.id === item.id
          ? {
             ...quoteItem,
lite1Id: newLite1Id,
oa: formatThickness(
  getById(GLASS_PRODUCTS, newLite1Id).thickness +
  getById(SPACERS, quoteItem.spacerId).thickness +
  getById(GLASS_PRODUCTS, quoteItem.lite2Id).thickness
),
lineTotal: calculateQuoteItemLineTotal(
                { ...quoteItem, lite1Id: newLite1Id },
                quoteItem.width,
                quoteItem.height,
                quoteItem.qty
              ),
            }
          : quoteItem
      )
    );
  }}
>
    {GLASS_PRODUCTS.map((g) => (
      <option key={g.id} value={g.id}>
        {g.name}
      </option>
    ))}
  </select>

  {"  "}Spacer:{" "}
  <select
  value={item.spacerId}
  onChange={(e) => {
    const newSpacerId = e.target.value;

    setQuoteItems((prev) =>
      prev.map((quoteItem) =>
        quoteItem.id === item.id
          ? {
              ...quoteItem,
spacerId: newSpacerId,
oa: formatThickness(
  getById(GLASS_PRODUCTS, quoteItem.lite1Id).thickness +
  getById(SPACERS, newSpacerId).thickness +
  getById(GLASS_PRODUCTS, quoteItem.lite2Id).thickness
),
lineTotal: calculateQuoteItemLineTotal(
                { ...quoteItem, spacerId: newSpacerId },
                quoteItem.width,
                quoteItem.height,
                quoteItem.qty
              ),
            }
          : quoteItem
      )
    );
  }}
>
    {SPACERS.map((s) => (
      <option key={s.id} value={s.id}>
        {s.name}
      </option>
    ))}
  </select>

  {"  "}Lite 2:{" "}
<select
  value={item.lite2Id}
  onChange={(e) => {
    const newLite2Id = e.target.value;

    setQuoteItems((prev) =>
      prev.map((quoteItem) =>
        quoteItem.id === item.id
          ? {
              ...quoteItem,
lite2Id: newLite2Id,
oa: formatThickness(
  getById(GLASS_PRODUCTS, quoteItem.lite1Id).thickness +
  getById(SPACERS, quoteItem.spacerId).thickness +
  getById(GLASS_PRODUCTS, newLite2Id).thickness
),
lineTotal: calculateQuoteItemLineTotal(
                { ...quoteItem, lite2Id: newLite2Id },
                quoteItem.width,
                quoteItem.height,
                quoteItem.qty
              ),
            }
          : quoteItem
      )
    );
  }}
>
    {GLASS_PRODUCTS.map((g) => (
      <option key={g.id} value={g.id}>
        {g.name}
      </option>
    ))}
  </select>
</div>
</div>
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
<h2 style={{ marginTop: "24px" }}>New Quote Item</h2>

          <div>
<div style={{ marginTop: "20px", marginBottom: "10px" }}>
  <strong>Glass Details</strong>
</div>


<div>
  <label>Width</label>
  <input
    type="text"
    value={width}
    onChange={(e) => setWidth(e.target.value)}
    placeholder='Example: 38 1/2'
  />
</div>

          <div>
  <label>Height</label>
  <input
    type="text"
    value={height}
    onChange={(e) => setHeight(e.target.value)}
    placeholder='Example: 69 3/4'
  />
</div>


      <div>
  <button
  type="button"
  onClick={handleAddUnit}
  style={{ padding: "8px 12px", marginRight: "8px" }}
>
    Add Unit to Quote
  </button>
<button
  type="button"
  onClick={() => {
    setWidth("");
    setHeight("");
    setQuantity(1);
    setPartCode("IGC6");
    setDescription("Insulated ClimaGuard 70/36 Low-E");
  }}
  style={{ marginLeft: "8px" }}
>
  Clear Current Unit
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
<div style={{ marginTop: "20px", marginBottom: "10px" }}>
  <strong>Quote Item Details</strong>
</div>

<div>
  <label>Quantity</label>
  <input
    type="number"
    min="1"
    value={quantity}
    onChange={(e) => setQuantity(Number(e.target.value))}
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
<div>
  <label>OA</label>
  <input
    type="text"
    value={formatThickness(overallThickness)}
    readOnly
  />
</div>

        <div>
  <label>Part Code</label>
  <input
    type="text"
    value={partCode}
    onChange={(e) => setPartCode(e.target.value)}
  />
</div>

<div>
  <label>Description</label>
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

         
<div style={{ marginTop: "20px", marginBottom: "10px" }}>
  <strong>Pricing</strong>
</div>
            <label>Pricing Category</label>
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

       

 <div style={{ marginBottom: "12px" }}>
  <label>
    <input
      type="checkbox"
      checked={showFgmmCost}
      onChange={(e) => setShowFgmmCost(e.target.checked)}
    />{" "}
    Show FGMM Cost Breakdown
  </label>
</div>

<div style={{ border: "1px solid #ccc", padding: "16px", marginBottom: "20px", background: "#fafafa" }}>
  <h3 style={{ marginTop: 0 }}>Current New Unit Pricing</h3>
  <p><strong>Width x Height:</strong> {width} x {height}</p>
  <p><strong>OA:</strong> {formatThickness(overallThickness)}</p>
  <p><strong>Lite 1:</strong> {lite1.name} — {currency.format(lite1.costPerSqFt)}/sq ft</p>
  <p><strong>Spacer:</strong> {spacer.name} — {currency.format(spacer.costPerSqFt)}/sq ft</p>
  <p><strong>Lite 2:</strong> {lite2.name} — {currency.format(lite2.costPerSqFt)}/sq ft</p>

  {totals ? (
    <>
      {showFgmmCost && (
        <>
          <p><strong>Lite 1 Cost:</strong> {currency.format(totals.lite1Amount)}</p>
          <p><strong>Spacer Cost:</strong> {currency.format(totals.spacerAmount)}</p>
          <p><strong>Lite 2 Cost:</strong> {currency.format(totals.lite2Amount)}</p>
          <p><strong>FGMM Material Cost:</strong> {currency.format(totals.materialsAmount)}</p>
        </>
      )}

      <p><strong>Retail (x2):</strong> {currency.format(totals.materialsAmount * 2)}</p>
      <p><strong>Contractor:</strong> {currency.format(totals.materialsAmount * 1.8)}</p>
      <p><strong>Apartment:</strong> {currency.format(totals.materialsAmount * 1.6)}</p>

      <p><strong>Price Each:</strong> {currency.format(priceEach)}</p>
      <p><strong>Line Total:</strong> {currency.format(priceEach * quantity)}</p>
    </>
  ) : (
    <p>Enter a valid width and height.</p>
  )}
</div>
  <div style={{ border: "1px solid #ccc", padding: "16px", marginBottom: "20px", background: "#fafafa" }}>
    <h2 style={{ marginTop: 0 }}>Quote Summary</h2>
    <p><strong>Subtotal:</strong> {currency.format(materialSubtotal)}</p>
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
      <p><strong>Materials Subtotal:</strong> {currency.format(materialSubtotal)}</p>
      <p><strong>Labor:</strong> {currency.format(laborTotal)}</p>
      {showTripCharge && (
        <p><strong>Trip Charge:</strong> {currency.format(tripChargeTotal)}</p>
      )}
      <p><strong>Tax:</strong> {currency.format(customerTax)}</p>
      <p><strong>Grand Total:</strong> {currency.format(customerTotal)}</p>
    </div>

                               </div>
        </div>
      </div>
    </div>
    </main>
  );
}