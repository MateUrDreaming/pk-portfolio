"use client"

import { useMemo } from "react"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { WorkExperienceCard } from "./work-experience-card"
import { ProjectCard } from "./project-card"
import { EducationCard } from "./education-card"
import { Skeleton } from "@/components/ui/skeleton"
import { WorkExperience } from "@/features/portfolio/hooks/use-work-experience"
import { Project } from "@/features/portfolio/hooks/use-projects"
import { Education } from "@/features/portfolio/hooks/use-education"

interface ExperienceContentProps {
  activeTab: string
  searchTerm: string
  workExperience: WorkExperience[]
  projects: Project[]
  education: Education[]
  loading: boolean
  isAdmin: boolean
  onDataChange?: () => void 
}

export function ExperienceContent({ 
  activeTab, 
  searchTerm, 
  workExperience, 
  projects, 
  education,
  loading,
  isAdmin,
  onDataChange
}: ExperienceContentProps) {
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

  const filteredEducation = useMemo(() => {
    return education.filter(
      (item) =>
        item.degree.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.field.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.coursework.some((course: string) => course.toLowerCase().includes(searchTerm.toLowerCase())),
    )
  }, [searchTerm, education])

  if (loading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-48 w-full" />
        ))}
      </div>
    )
  }

  return (
    <Tabs value={activeTab} className="w-full">
      <TabsContent value="work" className="space-y-6">
        {filteredWork.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              {searchTerm ? "No work experience found matching your search." : "No work experience added yet."}
            </p>
          </div>
        ) : (
          filteredWork.map((job) => (
            <WorkExperienceCard 
              key={job.id} 
              job={job} 
              isAdmin={isAdmin}
              onDataChange={onDataChange}
            />
          ))
        )}
      </TabsContent>

      <TabsContent value="projects" className="space-y-6">
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              {searchTerm ? "No projects found matching your search." : "No projects added yet."}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {filteredProjects.map((project) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                isAdmin={isAdmin}
                onDataChange={onDataChange}
              />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="education" className="space-y-6">
        {filteredEducation.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              {searchTerm ? "No education found matching your search." : "No education added yet."}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {filteredEducation.map((edu) => (
              <EducationCard 
                key={edu.id} 
                education={edu} 
                isAdmin={isAdmin}
                onDataChange={onDataChange}
              />
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  )
}