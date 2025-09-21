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

  // Create new work experience
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

  // Update work experience
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

  // Delete work experience
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

  // Get work experience by ID - memoized to prevent infinite loops
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

// src/hooks/use-projects.ts
export interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
  duration: string
  githubUrl?: string
  liveUrl?: string
  highlights: string[]
  order: number
  createdAt: Date
  updatedAt: Date
}

export interface CreateProjectData {
  title: string
  description: string
  technologies: string[]
  duration: string
  githubUrl?: string
  liveUrl?: string
  highlights: string[]
  order?: number
}

export interface UpdateProjectData extends CreateProjectData {
  id: string
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch all projects
  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/projects')
      if (!response.ok) {
        throw new Error('Failed to fetch projects')
      }
      const data = await response.json()
      setProjects(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  // Create new project
  const createProject = useCallback(async (data: CreateProjectData): Promise<Project | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        throw new Error('Failed to create project')
      }
      
      const newProject = await response.json()
      setProjects(prev => [...prev, newProject].sort((a, b) => a.order - b.order))
      toast.success('Project created successfully')
      return newProject
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      toast.error(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  // Update project
  const updateProject = useCallback(async (data: UpdateProjectData): Promise<Project | null> => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/projects/${data.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        throw new Error('Failed to update project')
      }
      
      const updatedProject = await response.json()
      setProjects(prev => 
        prev.map(item => item.id === data.id ? updatedProject : item)
           .sort((a, b) => a.order - b.order)
      )
      toast.success('Project updated successfully')
      return updatedProject
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      toast.error(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  // Delete project
  const deleteProject = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete project')
      }
      
      setProjects(prev => prev.filter(item => item.id !== id))
      toast.success('Project deleted successfully')
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

  // Get project by ID - memoized to prevent infinite loops
  const getProjectById = useCallback((id: string): Project | undefined => {
    try {
      return projects.find(item => item.id === id)
    } catch (error) {
      console.error('Error getting project by ID:', error)
      return undefined
    }
  }, [projects])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  return {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    getProjectById,
  }
}