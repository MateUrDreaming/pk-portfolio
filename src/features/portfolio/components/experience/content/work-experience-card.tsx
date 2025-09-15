"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Trash2, Edit } from "lucide-react"

interface WorkExperienceCardProps {
  job: {
    id: number
    title: string
    company: string
    location: string
    duration: string
    description: string
    technologies: string[]
    achievements: string[]
  }
  onDelete?: (id: number) => void
  onUpdate?: (id: number) => void
}

export function WorkExperienceCard({ job, onDelete, onUpdate }: WorkExperienceCardProps) {
  return (
    <Card className="bg-card border-border hover:shadow-lg transition-shadow duration-200">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-xl text-card-foreground">{job.title}</CardTitle>
            <CardDescription className="text-lg font-medium text-primary">{job.company}</CardDescription>
          </div>
          <div className="flex flex-col md:items-end gap-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">{job.duration}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">{job.location}</span>
            </div>
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
        <p className="text-card-foreground leading-relaxed">{job.description}</p>

        <div className="border border-primary rounded-lg p-4">
          <h4 className="font-semibold text-card-foreground mb-2">Key Achievements:</h4>
          <div className="max-h-32 overflow-y-auto pr-2">
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              {job.achievements.map((achievement, index) => (
                <li key={index}>{achievement}</li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-card-foreground mb-2">Technologies:</h4>
          <div className="flex flex-wrap gap-2">
            {job.technologies.map((tech) => (
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
