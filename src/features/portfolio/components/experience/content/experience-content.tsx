"use client"

import { useMemo } from "react"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { WorkExperienceCard } from "./work-experience-card"
import { ProjectCard } from "./project-card"

interface ExperienceContentProps {
  activeTab: string
  searchTerm: string
  workExperience: any[]
  projects: any[]
}

export function ExperienceContent({ activeTab, searchTerm, workExperience, projects }: ExperienceContentProps) {
  const filteredWork = useMemo(() => {
    return workExperience.filter(
      (item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.technologies.some((tech: string) => tech.toLowerCase().includes(searchTerm.toLowerCase())),
    )
  }, [searchTerm, workExperience])

  const filteredProjects = useMemo(() => {
    return projects.filter(
      (item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.technologies.some((tech: string) => tech.toLowerCase().includes(searchTerm.toLowerCase())),
    )
  }, [searchTerm, projects])

  return (
    <Tabs value={activeTab} className="w-full">
      <TabsContent value="work" className="space-y-6">
        {filteredWork.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No work experience found matching your search.</p>
          </div>
        ) : (
          filteredWork.map((job) => <WorkExperienceCard key={job.id} job={job} />)
        )}
      </TabsContent>

      <TabsContent value="projects" className="space-y-6">
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No projects found matching your search.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  )
}
