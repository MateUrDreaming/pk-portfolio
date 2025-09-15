"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github, Calendar, Edit, Trash2 } from "lucide-react"
import { Project, useProjects } from "@/features/portfolio/hooks/use-projects"
import { EditProjectModal } from "@/features/portfolio/components/experience/filter/modals/edit-project-modal"
import { DeleteConfirmationModal } from "@/features/portfolio/components/experience/filter/modals/delete-confirmation-modal"

interface ProjectCardProps {
  project: Project
  isAdmin: boolean
  onDataChange?: () => void 
}

export function ProjectCard({ project, isAdmin, onDataChange }: ProjectCardProps) {
  const { deleteProject, loading, fetchProjects } = useProjects()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const handleDelete = async () => {
    const success = await deleteProject(project.id)
    if (success) {
      setIsDeleteModalOpen(false)

      if (onDataChange) {
        onDataChange()
      } else {
  
        await fetchProjects()
      }
    }
  }

  const handleEditSuccess = async () => {
    if (onDataChange) {
      onDataChange()
    } else {
      await fetchProjects()
    }
  }

  return (
    <>
      <Card className="group hover:shadow-lg transition-all duration-300 h-full flex flex-col">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                {project.title}
              </CardTitle>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {project.duration}
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

        <CardContent className="flex-1 space-y-4">
          <p className="text-muted-foreground text-sm leading-relaxed">{project.description}</p>

          {project.technologies.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-foreground">Technologies</h4>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <Badge key={tech} variant="secondary" className="text-xs">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {project.highlights.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-foreground">Highlights</h4>
              <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground">
                {project.highlights.map((highlight, index) => (
                  <li key={index}>{highlight}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>

        <CardFooter className="pt-4 border-t">
          <div className="flex gap-2 w-full">
            {project.githubUrl && (
              <Button variant="outline" size="sm" asChild className="flex-1">
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4 mr-2" />
                  Code
                </a>
              </Button>
            )}
            {project.liveUrl && (
              <Button variant="outline" size="sm" asChild className="flex-1">
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Live Demo
                </a>
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>

      <EditProjectModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        projectId={project.id}
        onSuccess={handleEditSuccess}
      />

      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        onConfirm={handleDelete}
        title={project.title}
        description="This action cannot be undone."
        loading={loading}
      />
    </>
  )
}