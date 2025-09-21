import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'

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