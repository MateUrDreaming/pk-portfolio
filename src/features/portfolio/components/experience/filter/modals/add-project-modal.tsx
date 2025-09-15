"use client"

import { useState } from "react"
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
import { useProjects, CreateProjectData } from "@/features/portfolio/hooks/use-projects"
import { useRouter } from "next/navigation"

interface AddProjectModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void // Optional callback for parent to handle success
}

export function AddProjectModal({ open, onOpenChange, onSuccess }: AddProjectModalProps) {
  const { createProject, loading, fetchProjects } = useProjects()
  const router = useRouter()
  const [formData, setFormData] = useState<CreateProjectData>({
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Filter out empty strings before submitting
    const cleanedData = {
      ...formData,
      technologies: formData.technologies.filter(tech => tech.trim() !== ""),
      highlights: formData.highlights.filter(highlight => highlight.trim() !== "")
    }
    
    const result = await createProject(cleanedData)
    if (result) {
      resetForm()
      
      // Option 1: Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess()
      }
      
      // Option 2: Explicitly refresh the projects data
      await fetchProjects()
      
      // Option 3: Use router.refresh() for full page refresh (if needed)
      // router.refresh()
      
      // Small delay to ensure state updates are applied before closing
      setTimeout(() => {
        onOpenChange(false)
      }, 100)
    }
  }

  const resetForm = () => {
    setFormData({
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

  // Reset form when modal is closed
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetForm()
    }
    onOpenChange(newOpen)
  }

  // Technologies management
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

  // Highlights management
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

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Project</DialogTitle>
          <DialogDescription>
            Add a new project to your portfolio.
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
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Add Project"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}