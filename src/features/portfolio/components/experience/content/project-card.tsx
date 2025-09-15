"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Github, ExternalLink, Trash2, Edit } from "lucide-react"

interface ProjectCardProps {
  project: {
    id: number
    title: string
    description: string
    technologies: string[]
    duration: string
    githubUrl?: string
    liveUrl?: string
    highlights: string[]
  }
  onDelete?: (id: number) => void
  onUpdate?: (id: number) => void
}

export function ProjectCard({ project, onDelete, onUpdate }: ProjectCardProps) {
  return (
    <Card className="bg-card border-border hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-xl text-card-foreground">{project.title}</CardTitle>
            <CardDescription className="text-muted-foreground">{project.duration}</CardDescription>
          </div>
          <div className="flex gap-2">
            {project.githubUrl && (
              <Button size="sm" variant="outline" asChild>
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4" />
                </a>
              </Button>
            )}
            {project.liveUrl && (
              <Button size="sm" variant="outline" asChild>
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
        </div>
        <div className="pt-2 flex gap-2 w-full">
              <Button
                size="sm"
                variant="outline"
                className="flex items-center gap-2 flex-1"
              >
                <Edit className="h-4 w-4" />
                Update
              </Button>
              <Button
                size="sm"
                variant="destructive"
                className="flex items-center gap-2 flex-1"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
          </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-card-foreground leading-relaxed">{project.description}</p>

        <div className="border border-primary rounded-lg p-4">
          <h4 className="font-semibold text-card-foreground mb-2">Key Features:</h4>
          <div className="max-h-32 overflow-y-auto pr-2">
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              {project.highlights.map((highlight, index) => (
                <li key={index}>{highlight}</li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-card-foreground mb-2">Technologies:</h4>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <Badge key={tech} variant="secondary" className="bg-primary text-secondary-foreground">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
