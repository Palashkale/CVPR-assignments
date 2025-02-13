export interface PatientInfo {
  age: number;
  medicalHistory: string[];
  lifestyle: string[];
  preferences: string[];
}

export interface InsurancePlan {
  id: string;
  name: string;
  coverage: string[];
  monthlyPremium: number;
  deductible: number;
  description: string;
}