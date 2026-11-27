export type TriagePriority = 'NORMAL' | 'URGENT';

export interface Consultation {
  id: number;
  patientId: number;
  doctorId: number;
  patientName?: string;
  patientAllergies?: string;
  patientMetabolicProfile?: string;
  doctorName?: string;
  doctorSpecialty?: string;
  symptoms: string;
  temperature: number;
  painLevel: number;
  dias?: number;
  proposedIndications: string;
  triagePriority: TriagePriority;
  metabolicAlerts: string;
  ragContext: string;
  soapDraft: string;
  symptomVector: string;
  doctorNotes: string;
  validatedByDoctor: boolean;
  createdAt: string;
}

export interface CreateConsultationInput {
  patientId: number;
  doctorId: number;
  symptoms: string;
  temperature: number;
  painLevel: number;
  dias?: number;
  proposedIndications?: string;
  doctorNotes?: string;
}

export interface UpdateConsultationData {
  doctorNotes?: string;
  soapDraft?: string;
  validatedByDoctor?: boolean;
}
