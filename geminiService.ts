import { FinancialData } from "./types";

export const analyzeImpact = async (data: FinancialData, originalData: FinancialData) => {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 15000); // 15 segundos máximo

  try {
    const r = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data, originalData }),
      signal: controller.signal
    });

    return await r.json();
  } catch (error) {
    console.error("Error calling backend:", error);
    return {
      summary: "Tus finanzas están bajo presión por costos de servicios que parecen no tener control.",
      recommendations: [
        "Revisa que tu recibo no esté estimado y que el consumo sea real.",
        "Verifica cobros adicionales (alumbrado público, aseo) y su soporte.",
        "Exige transparencia en las inversiones que te están cobrando."
      ],
      sandraMessage: "¡Basta de abusos! No es justo que pagues más de luz que de comida. Vamos a recuperar el equilibrio del bolsillo."
    };
  } finally {
    clearTimeout(t);
  }
};
