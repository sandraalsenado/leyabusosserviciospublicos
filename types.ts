
export interface FinancialData {
  income: number;
  electricity: number;
  water: number;
  rent: number;
  education: number;
  entertainment: number;
  telecom: number;
  personalCare: number;
  food: number;
  health: number;
  transport: number;
  others: number;
}

export interface SimulationResult {
  disposableIncome: number;
  percentageUtilities: number;
  impactMessage: string;
}

export interface AIAnalysisResponse {
  summary: string;
  recommendations: string[];
  sandraMessage: string;
}
