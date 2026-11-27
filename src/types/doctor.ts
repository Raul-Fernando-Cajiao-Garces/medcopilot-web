export interface Doctor {
  id: number;
  fullName: string;
  specialty: string;
  licenseCode: string;
}

export interface CreateDoctorData {
  fullName: string;
  specialty: string;
  licenseCode: string;
}
