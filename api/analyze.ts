import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { data } = req.body || {};

    if (!data) {
      return res.status(400).json({ error: "Missing financial data" });
    }

    const apiKey = process.env.API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "Missing API_KEY in environment variables" });
    }

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

Responde EXCLUSIVAMENTE en formato JSON válido con esta estructura:

{
  "summary": "Análisis detallado del impacto económico",
  "recommendations": ["Recomendación 1", "Recomendación 2", "Recomendación 3"],
  "sandraMessage": "Mensaje político contundente de Sandra"
}

Condiciones obligatorias:
- El análisis debe ser profundo y concreto.
- Si los servicios superan el 10% del ingreso, explica que hay presión financiera.
- Si hay déficit, explica que la familia está asfixiada.
- Incluye la idea: "no es justo que pagues más de luz que de comida".
- No incluyas texto fuera del JSON.
`;

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text?.trim() || "{}";

    let parsed;

    try {
      parsed = JSON.parse(text);
    } catch (parseError) {
      console.error("JSON parse failed:", text);
      return res.status(500).json({
        error: "Invalid JSON returned by Gemini",
        raw: text
      });
    }

    return res.status(200).json(parsed);

  } catch (error: any) {
    console.error("Gemini API error:", error?.message || error);
    return res.status(500).json({
      error: "Gemini failed",
      detail: error?.message || String(error)
    });
  }
}
