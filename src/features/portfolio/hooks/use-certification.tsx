import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'

export interface Certification {
  id: string
  qualificationName: string
  provider: string
  dateReceived: string
  proofLink?: string
  order: number
  createdAt: Date
  updatedAt: Date
}

export interface CreateCertificationData {
  qualificationName: string
  provider: string
  dateReceived: string
  proofLink?: string
  order?: number
}

export interface UpdateCertificationData extends CreateCertificationData {
  id: string
}

export function useCertifications() {
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCertifications = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/certifications')
      if (!response.ok) {
        throw new Error('Failed to fetch certifications')
      }
      const data = await response.json()
      setCertifications(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  const createCertification = useCallback(async (data: CreateCertificationData): Promise<Certification | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/certifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        throw new Error('Failed to create certification')
      }
      
      const newCertification = await response.json()
      setCertifications(prev => [...prev, newCertification].sort((a, b) => a.order - b.order))
      toast.success('Certification created successfully')
      return newCertification
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      toast.error(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const updateCertification = useCallback(async (data: UpdateCertificationData): Promise<Certification | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/certifications/${data.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        throw new Error('Failed to update certification')
      }
      
      const updatedCertification = await response.json()
      setCertifications(prev => 
        prev.map(item => item.id === data.id ? updatedCertification : item)
           .sort((a, b) => a.order - b.order)
      )
      toast.success('Certification updated successfully')
      return updatedCertification
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      toast.error(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteCertification = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/certifications/${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete certification')
      }
      
      setCertifications(prev => prev.filter(item => item.id !== id))
      toast.success('Certification deleted successfully')
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      toast.error(errorMessage)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const getCertificationById = useCallback((id: string): Certification | undefined => {
    return certifications.find(item => item.id === id)
  }, [certifications])

  useEffect(() => {
    fetchCertifications()
  }, [fetchCertifications])

  return {
    certifications,
    loading,
    error,
    fetchCertifications,
    createCertification,
    updateCertification,
    deleteCertification,
    getCertificationById,
  }
}