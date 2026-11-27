export interface Patient {
  id: number;
  documentId: string;
  fullName: string;
  allergies: string;
  metabolicProfile: string;
}

export interface CreatePatientData {
  documentId: string;
  fullName: string;
  allergies?: string;
  metabolicProfile?: string;
}
