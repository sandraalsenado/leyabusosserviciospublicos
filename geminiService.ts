import { FinancialData } from "./types";

export const analyzeImpact = async (data: FinancialData, originalData: FinancialData) => {
  const r = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data, originalData })
  });

  return await r.json();
};
