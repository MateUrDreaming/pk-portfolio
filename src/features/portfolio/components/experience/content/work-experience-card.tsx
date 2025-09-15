// src/features/portfolio/components/experience/content/work-experience-card.tsx
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, Edit, Trash2 } from "lucide-react"
import { WorkExperience, useWorkExperience } from "@/features/portfolio/hooks/use-work-experience"
import { EditWorkExperienceModal } from "@/features/portfolio/components/experience/filter/modals/edit-experience-modal"
import { DeleteConfirmationModal } from "@/features/portfolio/components/experience/filter/modals/delete-confirmation-modal"

interface WorkExperienceCardProps {
  job: WorkExperience
  isAdmin: boolean
  onDataChange?: () => void // Add callback for data changes
}

export function WorkExperienceCard({ job, isAdmin, onDataChange }: WorkExperienceCardProps) {
  const { deleteWorkExperience, loading, fetchWorkExperience } = useWorkExperience()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const handleDelete = async () => {
    const success = await deleteWorkExperience(job.id)
    if (success) {
      setIsDeleteModalOpen(false)
      // Trigger data refresh
      if (onDataChange) {
        onDataChange()
      } else {
        // Fallback to direct refresh
        await fetchWorkExperience()
      }
    }
  }

  const handleEditSuccess = async () => {
    // Trigger data refresh after edit
    if (onDataChange) {
      onDataChange()
    } else {
      // Fallback to direct refresh
      await fetchWorkExperience()
    }
  }

  return (
    <>
      <Card className="group hover:shadow-lg transition-all duration-300">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                {job.title}
              </CardTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{job.company}</span>
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {job.location}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {job.duration}
                </div>
              </div>
            </div>
            
            {isAdmin && (
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditModalOpen(true)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsDeleteModalOpen(true)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-muted-foreground leading-relaxed">{job.description}</p>

          {job.technologies.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-foreground">Technologies</h4>
              <div className="flex flex-wrap gap-2">
                {job.technologies.map((tech) => (
                  <Badge key={tech} variant="secondary" className="text-xs">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {job.achievements.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-foreground">Key Achievements</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                {job.achievements.map((achievement, index) => (
                  <li key={index}>{achievement}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      <EditWorkExperienceModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        workExperienceId={job.id}
        onSuccess={handleEditSuccess}
      />

      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        onConfirm={handleDelete}
        title={`${job.title} at ${job.company}`}
        description="This action cannot be undone."
        loading={loading}
      />
    </>
  )
}