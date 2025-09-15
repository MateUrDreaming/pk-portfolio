"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ChevronDown, ChevronUp, Plus, X } from "lucide-react"
import { useProjects, Project, UpdateProjectData } from "@/features/portfolio/hooks/use-projects"
import { useRouter } from "next/navigation"

interface EditProjectModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: string | null
  onSuccess?: () => void 
}

export function EditProjectModal({ open, onOpenChange, projectId, onSuccess }: EditProjectModalProps) {
  const { updateProject, getProjectById, loading, fetchProjects } = useProjects()
  const router = useRouter()
  const [formData, setFormData] = useState<UpdateProjectData>({
    id: "",
    title: "",
    description: "",
    technologies: [],
    duration: "",
    githubUrl: "",
    liveUrl: "",
    highlights: [],
    order: 0,
  })

  const [isTechnologiesExpanded, setIsTechnologiesExpanded] = useState(false)
  const [isHighlightsExpanded, setIsHighlightsExpanded] = useState(false)

  useEffect(() => {
    if (projectId && open) {
      const project = getProjectById(projectId)
      if (project) {
        setFormData({
          id: project.id,
          title: project.title || "",
          description: project.description || "",
          technologies: Array.isArray(project.technologies) ? [...project.technologies] : [],
          duration: project.duration || "",
          githubUrl: project.githubUrl || "",
          liveUrl: project.liveUrl || "",
          highlights: Array.isArray(project.highlights) ? [...project.highlights] : [],
          order: project.order || 0,
        })
        setIsTechnologiesExpanded(Array.isArray(project.technologies) && project.technologies.length > 0)
        setIsHighlightsExpanded(Array.isArray(project.highlights) && project.highlights.length > 0)
      }
    } else if (!open) {
      setFormData({
        id: "",
        title: "",
        description: "",
        technologies: [],
        duration: "",
        githubUrl: "",
        liveUrl: "",
        highlights: [],
        order: 0,
      })
      setIsTechnologiesExpanded(false)
      setIsHighlightsExpanded(false)
    }
  }, [projectId, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const cleanedData = {
      ...formData,
      technologies: formData.technologies.filter(tech => tech.trim() !== ""),
      highlights: formData.highlights.filter(highlight => highlight.trim() !== "")
    }
    
    const result = await updateProject(cleanedData)
    if (result) {
      if (onSuccess) {
        onSuccess()
      }
      
      await fetchProjects()
      
      
      setTimeout(() => {
        onOpenChange(false)
      }, 100)
    }
  }

  const addTechnology = () => {
    setFormData(prev => ({
      ...prev,
      technologies: [...prev.technologies, ""]
    }))
  }

  const updateTechnology = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.map((tech, i) => i === index ? value : tech)
    }))
  }

  const removeTechnology = (index: number) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter((_, i) => i !== index)
    }))
  }

  const addHighlight = () => {
    setFormData(prev => ({
      ...prev,
      highlights: [...prev.highlights, ""]
    }))
  }

  const updateHighlight = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.map((highlight, i) => i === index ? value : highlight)
    }))
  }

  const removeHighlight = (index: number) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index)
    }))
  }

  if (!projectId || !open) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Unable to Edit</DialogTitle>
            <DialogDescription>
              Project data could not be loaded.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={() => onOpenChange(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>
            Update the project details.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Project Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., E-commerce Platform"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your project..."
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                placeholder="e.g., 3 months (2024)"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="order">Display Order</Label>
              <Input
                id="order"
                type="number"
                value={formData.order}
                onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="githubUrl">GitHub URL (Optional)</Label>
              <Input
                id="githubUrl"
                value={formData.githubUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, githubUrl: e.target.value }))}
                placeholder="https://github.com/username/project"
                type="url"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="liveUrl">Live URL (Optional)</Label>
              <Input
                id="liveUrl"
                value={formData.liveUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, liveUrl: e.target.value }))}
                placeholder="https://project-demo.com"
                type="url"
              />
            </div>
          </div>

          {/* Technologies Section */}
          <div className="space-y-2">
            <div className="border rounded-md">
              <Button
                type="button"
                variant="ghost"
                className="w-full flex items-center justify-between p-4 h-auto"
                onClick={() => setIsTechnologiesExpanded(!isTechnologiesExpanded)}
              >
                <div className="flex items-center gap-2">
                  <Label className="text-base font-medium">Technologies</Label>
                  {formData.technologies.length > 0 && (
                    <span className="text-sm text-muted-foreground">({formData.technologies.length} added)</span>
                  )}
                </div>
                {isTechnologiesExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
              {isTechnologiesExpanded && (
                <div className="border-t p-4 space-y-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addTechnology}
                    className="w-full bg-transparent"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Technology
                  </Button>
                  {formData.technologies.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No technologies added yet. Click "Add Technology" to get started.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {formData.technologies.map((technology, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input
                            value={technology}
                            onChange={(e) => updateTechnology(index, e.target.value)}
                            placeholder="e.g., React, Node.js, TypeScript..."
                            className="flex-1"
                          />
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeTechnology(index)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Highlights Section */}
          <div className="space-y-2">
            <div className="border rounded-md">
              <Button
                type="button"
                variant="ghost"
                className="w-full flex items-center justify-between p-4 h-auto"
                onClick={() => setIsHighlightsExpanded(!isHighlightsExpanded)}
              >
                <div className="flex items-center gap-2">
                  <Label className="text-base font-medium">Project Highlights</Label>
                  {formData.highlights.length > 0 && (
                    <span className="text-sm text-muted-foreground">({formData.highlights.length} added)</span>
                  )}
                </div>
                {isHighlightsExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
              {isHighlightsExpanded && (
                <div className="border-t p-4 space-y-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addHighlight}
                    className="w-full bg-transparent"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Highlight
                  </Button>
                  {formData.highlights.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No highlights added yet. Click "Add Highlight" to get started.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {formData.highlights.map((highlight, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input
                            value={highlight}
                            onChange={(e) => updateHighlight(index, e.target.value)}
                            placeholder="e.g., Integrated Stripe payment processing..."
                            className="flex-1"
                          />
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeHighlight(index)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Project"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}