/**
 * Patients Hook
 * React Query hooks for patient management
 */

import { useQuery } from '@tanstack/react-query'
import { patientsApi, type PatientsFilters } from '@/lib/api'
import { useSession } from 'next-auth/react'

/**
 * Get patients list
 */
export function usePatients(filters?: PatientsFilters) {
  const { data: session } = useSession()
  const hospitalId = session?.user?.organizationId

  return useQuery({
    queryKey: ['patients', hospitalId, filters],
    queryFn: () => patientsApi.getList(hospitalId!, filters),
    enabled: !!hospitalId,
    staleTime: 5 * 60 * 1000, // 5 minutes (patients data changes less frequently)
  })
}

/**
 * Get single patient by ID
 */
export function usePatient(patientId: string) {
  const { data: session } = useSession()
  const hospitalId = session?.user?.organizationId

  return useQuery({
    queryKey: ['patient', hospitalId, patientId],
    queryFn: () => patientsApi.getById(hospitalId!, patientId),
    enabled: !!hospitalId && !!patientId,
  })
}

/**
 * Search patients
 */
export function usePatientSearch(query: string) {
  const { data: session } = useSession()
  const hospitalId = session?.user?.organizationId

  return useQuery({
    queryKey: ['patients', 'search', hospitalId, query],
    queryFn: () => patientsApi.search(hospitalId!, query),
    enabled: !!hospitalId && query.length >= 2, // Only search with 2+ characters
    staleTime: 1 * 60 * 1000, // 1 minute (search results should be fresh)
  })
}
