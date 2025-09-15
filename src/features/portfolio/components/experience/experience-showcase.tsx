"use client"

import { useState, useCallback } from "react"
import { ExperienceHeader } from "./header/experience-header"
import { ExperienceFilterBar } from "./filter/experience-filter-bar"
import { ExperienceContent } from "./content/experience-content"
import { useWorkExperience } from "@/features/portfolio/hooks/use-work-experience"
import { useProjects } from "@/features/portfolio/hooks/use-projects"
import { User } from "@/lib/auth"

interface ExperienceShowcaseProps {
  user?: User | null // Pass the user from your auth session
}

export function ExperienceShowcase({ user }: ExperienceShowcaseProps) {
  // Check if user is admin
  const isAdmin = user?.role === "admin"
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("work")
  
  // Use the hooks at this level
  const { 
    workExperience, 
    loading: workLoading, 
    fetchWorkExperience 
  } = useWorkExperience()
  
  const { 
    projects, 
    loading: projectsLoading, 
    fetchProjects 
  } = useProjects()

  // Combined loading state
  const loading = workLoading || projectsLoading

  // Master refresh function that refreshes all data
  const handleDataRefresh = useCallback(async () => {
    try {
      // Refresh both work experience and projects
      await Promise.all([
        fetchWorkExperience(),
        fetchProjects()
      ])
    } catch (error) {
      console.error('Error refreshing data:', error)
    }
  }, [fetchWorkExperience, fetchProjects])

  return (
    <section className="min-h-svh bg-background pt-20 md:pt-32">
      <div className="mx-auto max-w-6xl px-4">
        <ExperienceHeader />

        <ExperienceFilterBar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          isAdmin={isAdmin}
          onDataChange={handleDataRefresh}
        />

        <ExperienceContent
          activeTab={activeTab}
          searchTerm={searchTerm}
          workExperience={workExperience}
          projects={projects}
          loading={loading}
          isAdmin={isAdmin}
          onDataChange={handleDataRefresh}
        />
      </div>
    </section>
  )
}