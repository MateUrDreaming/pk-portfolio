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
import { useEducation, Education, UpdateEducationData } from "@/features/portfolio/hooks/use-education"
import { useRouter } from "next/navigation"

interface EditEducationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  educationId: string | null
  onSuccess?: () => void 
}

export function EditEducationModal({ open, onOpenChange, educationId, onSuccess }: EditEducationModalProps) {
  const { updateEducation, getEducationById, loading, fetchEducation } = useEducation()
  const router = useRouter()
  const [formData, setFormData] = useState<UpdateEducationData>({
    id: "",
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

  useEffect(() => {
    if (educationId && open) {
      const education = getEducationById(educationId)
      if (education) {
        setFormData({
          id: education.id,
          degree: education.degree || "",
          field: education.field || "",
          institution: education.institution || "",
          location: education.location || "",
          duration: education.duration || "",
          description: education.description || "",
          gpa: education.gpa || "",
          coursework: Array.isArray(education.coursework) ? [...education.coursework] : [],
          achievements: Array.isArray(education.achievements) ? [...education.achievements] : [],
          order: education.order || 0,
        })
        setIsCourseworkExpanded(Array.isArray(education.coursework) && education.coursework.length > 0)
        setIsAchievementsExpanded(Array.isArray(education.achievements) && education.achievements.length > 0)
      }
    } else if (!open) {
      setFormData({
        id: "",
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
  }, [educationId, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const cleanedData = {
      ...formData,
      coursework: formData.coursework.filter(course => course.trim() !== ""),
      achievements: formData.achievements.filter(achievement => achievement.trim() !== "")
    }
    
    const result = await updateEducation(cleanedData)
    if (result) {
      if (onSuccess) {
        onSuccess()
      }
      
      await fetchEducation()
      
      setTimeout(() => {
        onOpenChange(false)
      }, 100)
    }
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

  if (!educationId || !open) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Unable to Edit</DialogTitle>
            <DialogDescription>
              Education data could not be loaded.
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
          <DialogTitle>Edit Education</DialogTitle>
          <DialogDescription>
            Update the education details.
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
              {loading ? "Updating..." : "Update Education"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}