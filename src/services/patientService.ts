import { apiClient } from './apiClient.js';
import type { Patient, CreatePatientData } from '../types/patient.js';

export const getAllPatients = async (): Promise<Patient[]> => {
  const response = await apiClient.get<Patient[]>('/patients');
  return response.data;
};

export const getPatientById = async (id: number): Promise<Patient> => {
  const response = await apiClient.get<Patient>(`/patients/${id}`);
  return response.data;
};

export const createPatient = async (data: CreatePatientData): Promise<Patient> => {
  const response = await apiClient.post<Patient>('/patients', data);
  return response.data;
};
