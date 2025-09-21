import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'

export interface WorkExperience {
  id: string
  title: string
  company: string
  location: string
  duration: string
  description: string
  technologies: string[]
  achievements: string[]
  order: number
  createdAt: Date
  updatedAt: Date
}

export interface CreateWorkExperienceData {
  title: string
  company: string
  location: string
  duration: string
  description: string
  technologies: string[]
  achievements: string[]
  order?: number
}

export interface UpdateWorkExperienceData extends CreateWorkExperienceData {
  id: string
}

export function useWorkExperience() {
  const [workExperience, setWorkExperience] = useState<WorkExperience[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch all work experience
  const fetchWorkExperience = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/work-experience')
      if (!response.ok) {
        throw new Error('Failed to fetch work experience')
      }
      const data = await response.json()
      setWorkExperience(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  const createWorkExperience = useCallback(async (data: CreateWorkExperienceData): Promise<WorkExperience | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/work-experience', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        throw new Error('Failed to create work experience')
      }
      
      const newWorkExperience = await response.json()
      setWorkExperience(prev => [...prev, newWorkExperience].sort((a, b) => a.order - b.order))
      toast.success('Work experience created successfully')
      return newWorkExperience
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      toast.error(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const updateWorkExperience = useCallback(async (data: UpdateWorkExperienceData): Promise<WorkExperience | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/work-experience/${data.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        throw new Error('Failed to update work experience')
      }
      
      const updatedWorkExperience = await response.json()
      setWorkExperience(prev => 
        prev.map(item => item.id === data.id ? updatedWorkExperience : item)
           .sort((a, b) => a.order - b.order)
      )
      toast.success('Work experience updated successfully')
      return updatedWorkExperience
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      toast.error(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteWorkExperience = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/work-experience/${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete work experience')
      }
      
      setWorkExperience(prev => prev.filter(item => item.id !== id))
      toast.success('Work experience deleted successfully')
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


  const getWorkExperienceById = useCallback((id: string): WorkExperience | undefined => {
    return workExperience.find(item => item.id === id)
  }, [workExperience])

  useEffect(() => {
    fetchWorkExperience()
  }, [fetchWorkExperience])

  return {
    workExperience,
    loading,
    error,
    fetchWorkExperience,
    createWorkExperience,
    updateWorkExperience,
    deleteWorkExperience,
    getWorkExperienceById,
  }
}
