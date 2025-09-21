import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'

export interface Education {
  id: string
  degree: string
  field: string
  institution: string
  location: string
  duration: string
  description: string
  gpa?: string
  coursework: string[]
  achievements: string[]
  order: number
  createdAt: Date
  updatedAt: Date
}

export interface CreateEducationData {
  degree: string
  field: string
  institution: string
  location: string
  duration: string
  description: string
  gpa?: string
  coursework: string[]
  achievements: string[]
  order?: number
}

export interface UpdateEducationData extends CreateEducationData {
  id: string
}

export function useEducation() {
  const [education, setEducation] = useState<Education[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchEducation = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/education')
      if (!response.ok) {
        throw new Error('Failed to fetch education')
      }
      const data = await response.json()
      setEducation(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  const createEducation = useCallback(async (data: CreateEducationData): Promise<Education | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/education', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        throw new Error('Failed to create education')
      }
      
      const newEducation = await response.json()
      setEducation(prev => [...prev, newEducation].sort((a, b) => a.order - b.order))
      toast.success('Education created successfully')
      return newEducation
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      toast.error(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const updateEducation = useCallback(async (data: UpdateEducationData): Promise<Education | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/education/${data.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        throw new Error('Failed to update education')
      }
      
      const updatedEducation = await response.json()
      setEducation(prev => 
        prev.map(item => item.id === data.id ? updatedEducation : item)
           .sort((a, b) => a.order - b.order)
      )
      toast.success('Education updated successfully')
      return updatedEducation
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      toast.error(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteEducation = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/education/${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete education')
      }
      
      setEducation(prev => prev.filter(item => item.id !== id))
      toast.success('Education deleted successfully')
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

  const getEducationById = useCallback((id: string): Education | undefined => {
    try {
      return education.find(item => item.id === id)
    } catch (error) {
      console.error('Error getting education by ID:', error)
      return undefined
    }
  }, [education])

  useEffect(() => {
    fetchEducation()
  }, [fetchEducation])

  return {
    education,
    loading,
    error,
    fetchEducation,
    createEducation,
    updateEducation,
    deleteEducation,
    getEducationById,
  }
}