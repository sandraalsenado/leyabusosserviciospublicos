import { GoogleGenAI, Type } from "@google/genai";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { data, originalData } = req.body || {};
    const apiKey = process.env.API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "Missing API_KEY in server env" });
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
Como asesor experto en economía doméstica colombiana para la campaña de Sandra al Senado 2026, cuya propuesta bandera es "La Ley Contra los Abusos en los Servicios Públicos".
Analiza este presupuesto DETALLADO de una familia colombiana:

INGRESOS: $${data?.income} COP
GASTOS EN SERVICIOS:
- Energía: $${data?.electricity} COP
- Agua: $${data?.water} COP

OTROS GASTOS:
- Arriendo: $${data?.rent} COP
- Alimentación: $${data?.food} COP
- Salud: $${data?.health} COP
- Transporte: $${data?.transport} COP
- Educación: $${data?.education} COP
- Entretenimiento/Ocio: $${data?.entertainment} COP
- Telefonía/Internet: $${data?.telecom} COP
- Cuidado Personal: $${data?.personalCare} COP
- Otros Gastos: $${data?.others} COP

Genera un análisis en JSON que incluya:
1. Un resumen del impacto: Explica cómo el costo de los servicios públicos le quita presupuesto a necesidades básicas como alimentación, salud o transporte.
2. Tres recomendaciones: Enfócate en identificar posibles cobros injustos o ineficiencias que la Ley de Sandra busca eliminar para aliviar el bolsillo.
3. Un mensaje político de Sandra: Un llamado a la acción sobre "La Ley Contra los Abusos en los Servicios Públicos" para el Senado 2026, enfocado en que "no es justo que pagues más de luz que de comida".
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

    const text = response.text || "{}";
    return res.status(200).json(JSON.parse(text));
  } catch (e: any) {
    return res.status(200).json({
      summary: "El peso de los servicios públicos está comprometiendo tu capacidad de cubrir alimentación y salud dignas.",
      recommendations: [
        "Verifica que no te estén cobrando promedios en lugar de consumo real.",
        "Revisa los cobros de alumbrado público y aseo, suelen tener sobrecostos.",
        "Apoya la vigilancia ciudadana que propone la Ley de Sandra."
      ],
      sandraMessage: "¡Tu comida y tu salud son prioridad! Mi Ley Contra los Abusos en los Servicios Públicos bajará tus facturas para que el dinero te rinda para lo que de verdad importa."
    });
  }
}
