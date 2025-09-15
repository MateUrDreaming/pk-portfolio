import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'

export interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  content: string
  avatar?: string
  proofUrl?: string
  isApproved: boolean
  isUserSubmitted: boolean
  order: number
  createdAt: Date
  updatedAt: Date
}

export interface CreateTestimonialData {
  name: string
  role: string
  company: string
  content: string
  avatar?: string
  proofUrl?: string
  isUserSubmitted?: boolean
  order?: number
}

export interface UpdateTestimonialData extends CreateTestimonialData {
  id: string
  isApproved?: boolean
}

export function useTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch all testimonials (admin) or approved testimonials (public)
  const fetchTestimonials = useCallback(async (includeUnapproved = false) => {
    try {
      setLoading(true)
      setError(null)
      const url = includeUnapproved ? '/api/testimonials?includeUnapproved=true' : '/api/testimonials'
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Failed to fetch testimonials')
      }
      const data = await response.json()
      setTestimonials(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch only approved testimonials for public display
  const fetchApprovedTestimonials = useCallback(async () => {
    await fetchTestimonials(false)
  }, [fetchTestimonials])

  // Fetch all testimonials for admin
  const fetchAllTestimonials = useCallback(async () => {
    await fetchTestimonials(true)
  }, [fetchTestimonials])

  // Create new testimonial
  const createTestimonial = useCallback(async (data: CreateTestimonialData): Promise<Testimonial | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/testimonials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        throw new Error('Failed to create testimonial')
      }
      
      const newTestimonial = await response.json()
      setTestimonials(prev => [...prev, newTestimonial].sort((a, b) => a.order - b.order))
      
      if (data.isUserSubmitted) {
        toast.success('Testimonial submitted successfully! It will be reviewed before being published.')
      } else {
        toast.success('Testimonial created successfully')
      }
      
      return newTestimonial
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      toast.error(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  // Update testimonial
  const updateTestimonial = useCallback(async (data: UpdateTestimonialData): Promise<Testimonial | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/testimonials/${data.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        throw new Error('Failed to update testimonial')
      }
      
      const updatedTestimonial = await response.json()
      setTestimonials(prev => 
        prev.map(item => item.id === data.id ? updatedTestimonial : item)
           .sort((a, b) => a.order - b.order)
      )
      toast.success('Testimonial updated successfully')
      return updatedTestimonial
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      toast.error(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  // Delete testimonial
  const deleteTestimonial = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/testimonials/${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete testimonial')
      }
      
      setTestimonials(prev => prev.filter(item => item.id !== id))
      toast.success('Testimonial deleted successfully')
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

  // Approve testimonial (admin only)
  const approveTestimonial = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/testimonials/${id}?action=approve`, {
        method: 'PATCH',
      })
      
      if (!response.ok) {
        throw new Error('Failed to approve testimonial')
      }
      
      const updatedTestimonial = await response.json()
      setTestimonials(prev => 
        prev.map(item => item.id === id ? updatedTestimonial : item)
      )
      toast.success('Testimonial approved successfully')
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

  // Reject testimonial (admin only)
  const rejectTestimonial = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/testimonials/${id}?action=reject`, {
        method: 'PATCH',
      })
      
      if (!response.ok) {
        throw new Error('Failed to reject testimonial')
      }
      
      const updatedTestimonial = await response.json()
      setTestimonials(prev => 
        prev.map(item => item.id === id ? updatedTestimonial : item)
      )
      toast.success('Testimonial rejected')
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

  // Get testimonial by ID - memoized to prevent infinite loops
  const getTestimonialById = useCallback((id: string): Testimonial | undefined => {
    return testimonials.find(item => item.id === id)
  }, [testimonials])

  useEffect(() => {
    fetchApprovedTestimonials()
  }, [fetchApprovedTestimonials])

  return {
    testimonials,
    loading,
    error,
    fetchTestimonials,
    fetchApprovedTestimonials,
    fetchAllTestimonials,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
    approveTestimonial,
    rejectTestimonial,
    getTestimonialById,
  }
}