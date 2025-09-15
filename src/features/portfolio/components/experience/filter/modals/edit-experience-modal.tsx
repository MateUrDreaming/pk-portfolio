"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { X, Plus, ChevronDown, ChevronUp } from "lucide-react"
import { useWorkExperience, WorkExperience, UpdateWorkExperienceData } from "@/features/portfolio/hooks/use-work-experience"
import { useRouter } from "next/navigation"

interface EditWorkExperienceModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workExperienceId: string | null
  onSuccess?: () => void // Optional callback for parent to handle success
}

export function EditWorkExperienceModal({ open, onOpenChange, workExperienceId, onSuccess }: EditWorkExperienceModalProps) {
  const { updateWorkExperience, getWorkExperienceById, loading, fetchWorkExperience } = useWorkExperience()
  const router = useRouter()
  const [formData, setFormData] = useState<UpdateWorkExperienceData>({
    id: "",
    title: "",
    company: "",
    location: "",
    duration: "",
    description: "",
    technologies: [],
    achievements: [],
    order: 0,
  })

  const [isTechnologiesExpanded, setIsTechnologiesExpanded] = useState(false)
  const [isAchievementsExpanded, setIsAchievementsExpanded] = useState(false)

  useEffect(() => {
    if (workExperienceId && open) {
      const workExperience = getWorkExperienceById(workExperienceId)
      if (workExperience) {
        setFormData({
          id: workExperience.id,
          title: workExperience.title || "",
          company: workExperience.company || "",
          location: workExperience.location || "",
          duration: workExperience.duration || "",
          description: workExperience.description || "",
          technologies: Array.isArray(workExperience.technologies) ? [...workExperience.technologies] : [],
          achievements: Array.isArray(workExperience.achievements) ? [...workExperience.achievements] : [],
          order: workExperience.order || 0,
        })
        setIsTechnologiesExpanded(Array.isArray(workExperience.technologies) && workExperience.technologies.length > 0)
        setIsAchievementsExpanded(Array.isArray(workExperience.achievements) && workExperience.achievements.length > 0)
      }
    } else if (!open) {
      setFormData({
        id: "",
        title: "",
        company: "",
        location: "",
        duration: "",
        description: "",
        technologies: [],
        achievements: [],
        order: 0,
      })
      setIsTechnologiesExpanded(false)
      setIsAchievementsExpanded(false)
    }
  }, [workExperienceId, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const cleanedData = {
      ...formData,
      technologies: formData.technologies.filter(tech => tech.trim() !== ""),
      achievements: formData.achievements.filter(achievement => achievement.trim() !== "")
    }
    
    const result = await updateWorkExperience(cleanedData)
    if (result) {

      if (onSuccess) {
        onSuccess()
      }
      

      await fetchWorkExperience()
      

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

  // Achievements management
  const addAchievement = () => {
    setFormData(prev => ({
      ...prev,
      achievements: [...prev.achievements, ""]
    }))
  }

  const updateAchievement = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements.map((achievement, i) => i === index ? value : achievement)
    }))
  }

  const removeAchievement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index)
    }))
  }


  if (!workExperienceId || !open) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Unable to Edit</DialogTitle>
            <DialogDescription>
              Work experience data could not be loaded.
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
          <DialogTitle>Edit Work Experience</DialogTitle>
          <DialogDescription>
            Update the work experience details.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Senior Software Engineer"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                placeholder="e.g., Tech Corp"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="e.g., San Francisco, CA"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                placeholder="e.g., 2022 - Present"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your role and responsibilities..."
              rows={4}
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

          {/* Achievements Section */}
          <div className="space-y-2">
            <div className="border rounded-md">
              <Button
                type="button"
                variant="ghost"
                className="w-full flex items-center justify-between p-4 h-auto"
                onClick={() => setIsAchievementsExpanded(!isAchievementsExpanded)}
              >
                <div className="flex items-center gap-2">
                  <Label className="text-base font-medium">Key Achievements</Label>
                  {formData.achievements.length > 0 && (
                    <span className="text-sm text-muted-foreground">({formData.achievements.length} added)</span>
                  )}
                </div>
                {isAchievementsExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
              {isAchievementsExpanded && (
                <div className="border-t p-4 space-y-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addAchievement}
                    className="w-full bg-transparent"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Achievement
                  </Button>
                  {formData.achievements.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No achievements added yet. Click "Add Achievement" to get started.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {formData.achievements.map((achievement, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input
                            value={achievement}
                            onChange={(e) => updateAchievement(index, e.target.value)}
                            placeholder="Describe a key achievement..."
                            className="flex-1"
                          />
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeAchievement(index)}>
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
              {loading ? "Updating..." : "Update Experience"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}