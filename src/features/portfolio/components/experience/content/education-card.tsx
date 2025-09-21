"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, Edit, Trash2, GraduationCap } from "lucide-react"
import { Education, useEducation } from "@/features/portfolio/hooks/use-education"
import { EditEducationModal } from "@/features/portfolio/components/experience/filter/modals/edit-education-modal"
import { DeleteConfirmationModal } from "@/features/portfolio/components/experience/filter/modals/delete-confirmation-modal"

interface EducationCardProps {
  education: Education
  isAdmin: boolean
  onDataChange?: () => void 
}

export function EducationCard({ education, isAdmin, onDataChange }: EducationCardProps) {
  const { deleteEducation, loading, fetchEducation } = useEducation()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const handleDelete = async () => {
    const success = await deleteEducation(education.id)
    if (success) {
      setIsDeleteModalOpen(false)

      if (onDataChange) {
        onDataChange()
      } else {
        await fetchEducation()
      }
    }
  }

  const handleEditSuccess = async () => {
    if (onDataChange) {
      onDataChange()
    } else {
      await fetchEducation()
    }
  }

  return (
    <>
      <Card className="group hover:shadow-lg transition-all duration-300 h-full flex flex-col">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                {education.degree} in {education.field}
              </CardTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{education.institution}</span>
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {education.location}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {education.duration}
                </div>
                {education.gpa && (
                  <div className="flex items-center gap-1">
                    <GraduationCap className="h-3 w-3" />
                    GPA: {education.gpa}
                  </div>
                )}
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

        <CardContent className="space-y-4 flex-1">
          <p className="text-muted-foreground leading-relaxed">{education.description}</p>

          {education.coursework.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-foreground">Relevant Coursework</h4>
              <div className="flex flex-wrap gap-2">
                {education.coursework.map((course) => (
                  <Badge key={course} variant="secondary" className="text-xs">
                    {course}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {education.achievements.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-foreground">Achievements</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                {education.achievements.map((achievement, index) => (
                  <li key={index}>{achievement}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      <EditEducationModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        educationId={education.id}
        onSuccess={handleEditSuccess}
      />

      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        onConfirm={handleDelete}
        title={`${education.degree} in ${education.field} at ${education.institution}`}
        description="This action cannot be undone."
        loading={loading}
      />
    </>
  )
}