import { apiClient } from './apiClient.js';
import type {
  Consultation,
  CreateConsultationInput,
  UpdateConsultationData,
} from '../types/consultation.js';

export const getAllConsultations = async (): Promise<Consultation[]> => {
  const response = await apiClient.get<Consultation[]>('/consultations');
  return response.data;
};

export const getConsultationById = async (id: number): Promise<Consultation> => {
  const response = await apiClient.get<Consultation>(`/consultations/${id}`);
  return response.data;
};

export const createConsultation = async (
  input: CreateConsultationInput
): Promise<Consultation> => {
  const response = await apiClient.post<Consultation>('/consultations', input);
  return response.data;
};

export const updateConsultation = async (
  id: number,
  data: UpdateConsultationData
): Promise<Consultation> => {
  const response = await apiClient.put<Consultation>(`/consultations/${id}`, data);
  return response.data;
};

export const deleteConsultation = async (
  id: number
): Promise<{ message: string }> => {
  const response = await apiClient.delete<{ message: string }>(`/consultations/${id}`);
  return response.data;
};
