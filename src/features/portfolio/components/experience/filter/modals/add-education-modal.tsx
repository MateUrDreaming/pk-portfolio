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
import { useEducation, CreateEducationData } from "@/features/portfolio/hooks/use-education"
import { useRouter } from "next/navigation"

interface AddEducationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void 
}

export function AddEducationModal({ open, onOpenChange, onSuccess }: AddEducationModalProps) {
  const { createEducation, loading, fetchEducation } = useEducation()
  const router = useRouter()
  const [formData, setFormData] = useState<CreateEducationData>({
    degree: "",
    field: "",
    institution: "",
    location: "",
    duration: "",
    description: "",
    gpa: "",
    coursework: [],
    achievements: [],
    order: 0,
  })

  const [isCourseworkExpanded, setIsCourseworkExpanded] = useState(false)
  const [isAchievementsExpanded, setIsAchievementsExpanded] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const cleanedData = {
      ...formData,
      coursework: formData.coursework.filter(course => course.trim() !== ""),
      achievements: formData.achievements.filter(achievement => achievement.trim() !== "")
    }
    
    const result = await createEducation(cleanedData)
    if (result) {
      resetForm()

      if (onSuccess) {
        onSuccess()
      }

      await fetchEducation()
      
      setTimeout(() => {
        onOpenChange(false)
      }, 100)
    }
  }

  const resetForm = () => {
    setFormData({
      degree: "",
      field: "",
      institution: "",
      location: "",
      duration: "",
      description: "",
      gpa: "",
      coursework: [],
      achievements: [],
      order: 0,
    })
    setIsCourseworkExpanded(false)
    setIsAchievementsExpanded(false)
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetForm()
    }
    onOpenChange(newOpen)
  }

  const addCoursework = () => {
    setFormData(prev => ({
      ...prev,
      coursework: [...prev.coursework, ""]
    }))
  }

  const updateCoursework = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      coursework: prev.coursework.map((course, i) => i === index ? value : course)
    }))
  }

  const removeCoursework = (index: number) => {
    setFormData(prev => ({
      ...prev,
      coursework: prev.coursework.filter((_, i) => i !== index)
    }))
  }

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

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Education</DialogTitle>
          <DialogDescription>
            Add your educational background to your portfolio.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="degree">Degree</Label>
              <Input
                id="degree"
                value={formData.degree}
                onChange={(e) => setFormData(prev => ({ ...prev, degree: e.target.value }))}
                placeholder="e.g., Bachelor of Science"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="field">Field of Study</Label>
              <Input
                id="field"
                value={formData.field}
                onChange={(e) => setFormData(prev => ({ ...prev, field: e.target.value }))}
                placeholder="e.g., Computer Science"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="institution">Institution</Label>
              <Input
                id="institution"
                value={formData.institution}
                onChange={(e) => setFormData(prev => ({ ...prev, institution: e.target.value }))}
                placeholder="e.g., University of Technology"
                required
              />
            </div>
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                placeholder="e.g., 2018 - 2022"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gpa">GPA (Optional)</Label>
              <Input
                id="gpa"
                value={formData.gpa}
                onChange={(e) => setFormData(prev => ({ ...prev, gpa: e.target.value }))}
                placeholder="e.g., 3.8/4.0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your educational experience..."
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCourseworkExpanded(!isCourseworkExpanded)}
              className="flex items-center gap-2 w-full justify-start"
            >
              {isCourseworkExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
              Relevant Coursework (Optional)
            </Button>

            {isCourseworkExpanded && (
              <div className="space-y-2 p-4 border rounded-lg">
                {formData.coursework.map((course, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={course}
                      onChange={(e) => updateCoursework(index, e.target.value)}
                      placeholder="e.g., Data Structures and Algorithms"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeCoursework(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addCoursework}
                  className="flex items-center gap-2 w-full"
                >
                  <Plus className="h-4 w-4" />
                  Add Course
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAchievementsExpanded(!isAchievementsExpanded)}
              className="flex items-center gap-2 w-full justify-start"
            >
              {isAchievementsExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
              Achievements (Optional)
            </Button>

            {isAchievementsExpanded && (
              <div className="space-y-2 p-4 border rounded-lg">
                {formData.achievements.map((achievement, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={achievement}
                      onChange={(e) => updateAchievement(index, e.target.value)}
                      placeholder="e.g., Dean's List, Magna Cum Laude"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeAchievement(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addAchievement}
                  className="flex items-center gap-2 w-full"
                >
                  <Plus className="h-4 w-4" />
                  Add Achievement
                </Button>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Education"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}