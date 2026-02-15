
import { GoogleGenAI, Type } from "@google/genai";
import { FinancialData } from "../types";

export const analyzeImpact = async (data: FinancialData, originalData: FinancialData) => {
  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY || "" });
  
  const prompt = `
    Como asesor experto en economía doméstica colombiana para la campaña de Sandra al Senado 2026, cuya propuesta bandera es "La Ley Contra los Abusos en los Servicios Públicos".
    Analiza este presupuesto DETALLADO de una familia colombiana:
    
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
    1. Un resumen del impacto: Explica cómo el costo de los servicios públicos le quita presupuesto a necesidades básicas como alimentación, salud o transporte.
    2. Tres recomendaciones: Enfócate en identificar posibles cobros injustos o ineficiencias que la Ley de Sandra busca eliminar para aliviar el bolsillo.
    3. Un mensaje político de Sandra: Un llamado a la acción sobre "La Ley Contra los Abusos en los Servicios Públicos" para el Senado 2026, enfocado en que "no es justo que pagues más de luz que de comida".
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            recommendations: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            sandraMessage: { type: Type.STRING }
          },
          required: ["summary", "recommendations", "sandraMessage"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return {
      summary: "El peso de los servicios públicos está comprometiendo tu capacidad de cubrir alimentación y salud dignas.",
      recommendations: [
        "Verifica que no te estén cobrando promedios en lugar de consumo real.",
        "Revisa los cobros de alumbrado público y aseo, suelen tener sobrecostos.",
        "Apoya la vigilancia ciudadana que propone la Ley de Sandra."
      ],
      sandraMessage: "¡Tu comida y tu salud son prioridad! Mi Ley Contra los Abusos en los Servicios Públicos bajará tus facturas para que el dinero te rinda para lo que de verdad importa. ¡Sandra al Senado 2026!"
    };
  }
};
