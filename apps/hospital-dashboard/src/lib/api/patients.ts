/**
 * Patients API Service
 * Patient and pet management
 */

import { apiClient } from './client'
import { Patient } from '../types'

export interface PatientsFilters {
  search?: string
  limit?: number
  offset?: number
}

export interface PatientsResponse {
  patients: Patient[]
  total: number
  page: number
  pageSize: number
}

/**
 * Get patients list
 */
export async function getPatients(hospitalId: string, filters?: PatientsFilters) {
  const response = await apiClient.get<PatientsResponse>(
    `/dashboard/hospital/pets`,
    {
      params: { hospitalId, ...filters }
    }
  )
  return response.data
}

/**
 * Get single patient by ID
 */
export async function getPatientById(hospitalId: string, patientId: string) {
  const response = await apiClient.get<Patient>(
    `/dashboard/hospital/pets/${patientId}`,
    {
      params: { hospitalId }
    }
  )
  return response.data
}

/**
 * Search patients
 */
export async function searchPatients(hospitalId: string, query: string) {
  const response = await apiClient.get<PatientsResponse>(
    `/dashboard/hospital/pets/search`,
    {
      params: { hospitalId, q: query }
    }
  )
  return response.data
}

export const patientsApi = {
  getList: getPatients,
  getById: getPatientById,
  search: searchPatients,
}
