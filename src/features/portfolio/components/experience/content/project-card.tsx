import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Github, ExternalLink } from "lucide-react"

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
}

export function ProjectCard({ project }: ProjectCardProps) {
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
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-card-foreground leading-relaxed">{project.description}</p>

        <div>
          <h4 className="font-semibold text-card-foreground mb-2">Key Features:</h4>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            {project.highlights.map((highlight, index) => (
              <li key={index}>{highlight}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-card-foreground mb-2">Technologies:</h4>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <Badge key={tech} variant="secondary" className="bg-secondary text-secondary-foreground">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
