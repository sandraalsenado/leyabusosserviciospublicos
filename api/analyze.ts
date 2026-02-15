import { GoogleGenAI, Type } from "@google/genai";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { data, originalData } = req.body || {};
    const apiKey = process.env.API_KEY;
    if (!apiKey) return res.status(500).json({ error: "Missing API_KEY" });

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
Como asesor experto en economía doméstica colombiana para la campaña de Sandra al Senado 2026, cuya propuesta bandera es "La Ley Contra los Abusos en los Servicios Públicos".
Analiza este presupuesto DETALLADO de una familia colombiana que siente el peso de las facturas:

INGRESOS: $${data.income} COP
GASTOS EN SERVICIOS:
- Energía: $${data.electricity} COP
- Agua: $${data.water} COP

OTROS GASTOS:
- Arriendo: $${data.rent} COP
- Alimentación: $${data.food} COP
- Salud: $${data.health} COP
- Transporte: $${data.transport} COP
- Educación: $${data.education} COP
- Entretenimiento/Ocio: $${data.entertainment} COP
- Telefonía/Internet: $${data.telecom} COP
- Cuidado Personal: $${data.personalCare} COP
- Otros Gastos: $${data.others} COP

Genera un análisis en JSON que incluya:
1. Un resumen del impacto: Explica cómo el "abuso" en las tarifas de servicios (especialmente si superan el 10-15% del ingreso) está asfixiando otros derechos como la educación o la alimentación.
2. Tres recomendaciones: Enfócate en identificar posibles cobros injustos o ineficiencias que la Ley de Sandra busca eliminar (como cobros estimados, falta de mantenimiento, o tarifas abusivas).
3. Un mensaje político de Sandra: Debe ser un llamado a la acción sobre "La Ley Contra los Abusos en los Servicios Públicos", explicando que su ley devolverá el equilibrio al bolsillo de la gente y castigará a las empresas que abusan. Incluye la idea: "no es justo que pagues más de luz que de comida".
`;

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
            sandraMessage: { type: Type.STRING }
          },
          required: ["summary", "recommendations", "sandraMessage"]
        }
      }
    });

    return res.status(200).json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("API analyze error:", error?.message || error);
    return res.status(500).json({ error: "Gemini failed", detail: error?.message || String(error) });
  }
}
