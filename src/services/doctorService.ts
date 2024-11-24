import { apiClient } from './apiClient.js';
import type { Doctor, CreateDoctorData } from '../types/doctor.js';

export const getAllDoctors = async (): Promise<Doctor[]> => {
  const response = await apiClient.get<Doctor[]>('/doctors');
  return response.data;
};

export const getDoctorById = async (id: number): Promise<Doctor> => {
  const response = await apiClient.get<Doctor>(`/doctors/${id}`);
  return response.data;
};

export const createDoctor = async (data: CreateDoctorData): Promise<Doctor> => {
  const response = await apiClient.post<Doctor>('/doctors', data);
  return response.data;
};
