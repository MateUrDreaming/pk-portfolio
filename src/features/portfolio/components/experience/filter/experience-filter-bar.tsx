"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, Building, Code, GraduationCap, Plus } from "lucide-react"
import { AddWorkExperienceModal } from "@/features/portfolio/components/experience/filter/modals/add-experience-modal"
import { AddProjectModal } from "@/features/portfolio/components/experience/filter/modals/add-project-modal"
import { AddEducationModal } from "@/features/portfolio/components/experience/filter/modals/add-education-modal"
import { useWorkExperience } from "@/features/portfolio/hooks/use-work-experience"
import { useProjects } from "@/features/portfolio/hooks/use-projects"
import { useEducation } from "@/features/portfolio/hooks/use-education"

interface ExperienceFilterBarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  searchTerm: string
  setSearchTerm: (term: string) => void
  isAdmin: boolean
  onDataChange?: () => void 
}

export function ExperienceFilterBar({
  activeTab,
  setActiveTab,
  searchTerm,
  setSearchTerm,
  isAdmin,
  onDataChange,
}: ExperienceFilterBarProps) {
  const { fetchWorkExperience } = useWorkExperience()
  const { fetchProjects } = useProjects()
  const { fetchEducation } = useEducation()
  const [isAddWorkModalOpen, setIsAddWorkModalOpen] = useState(false)
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false)
  const [isAddEducationModalOpen, setIsAddEducationModalOpen] = useState(false)

  const handleAddClick = () => {
    if (activeTab === "work") {
      setIsAddWorkModalOpen(true)
    } else if (activeTab === "projects") {
      setIsAddProjectModalOpen(true)
    } else if (activeTab === "education") {
      setIsAddEducationModalOpen(true)
    }
  }

  const handleWorkExperienceSuccess = async () => {
    if (onDataChange) {
      onDataChange()
    } else {
      // Fallback to direct refresh
      await fetchWorkExperience()
    }
  }

  const handleProjectSuccess = async () => {
    if (onDataChange) {
      onDataChange()
    } else {
      await fetchProjects()
    }
  }

  const handleEducationSuccess = async () => {
    if (onDataChange) {
      onDataChange()
    } else {
      await fetchEducation()
    }
  }

  const getTabIcon = () => {
    switch (activeTab) {
      case "work":
        return <Building className="h-4 w-4" />
      case "projects":
        return <Code className="h-4 w-4" />
      case "education":
        return <GraduationCap className="h-4 w-4" />
      default:
        return <Building className="h-4 w-4" />
    }
  }

  const getTabLabel = () => {
    switch (activeTab) {
      case "work":
        return "Work Experience"
      case "projects":
        return "Projects"
      case "education":
        return "Education"
      default:
        return "Work Experience"
    }
  }

  const getSearchPlaceholder = () => {
    switch (activeTab) {
      case "work":
        return "Search work experience..."
      case "projects":
        return "Search projects..."
      case "education":
        return "Search education..."
      default:
        return "Search..."
    }
  }

  return (
    <>
      <div className="bg-card border border-border rounded-lg p-4 mb-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <Select value={activeTab} onValueChange={setActiveTab}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue>
                <div className="flex items-center gap-2">
                  {getTabIcon()}
                  {getTabLabel()}
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="work">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Work Experience
                </div>
              </SelectItem>
              <SelectItem value="projects">
                <div className="flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  Projects
                </div>
              </SelectItem>
              <SelectItem value="education">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  Education
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          <div className="relative w-full md:flex-1 md:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder={getSearchPlaceholder()}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {isAdmin && (
            <Button onClick={handleAddClick} size="icon" className="h-10 w-10 shrink-0">
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <AddWorkExperienceModal
        open={isAddWorkModalOpen}
        onOpenChange={setIsAddWorkModalOpen}
        onSuccess={handleWorkExperienceSuccess}
      />

      <AddProjectModal
        open={isAddProjectModalOpen}
        onOpenChange={setIsAddProjectModalOpen}
        onSuccess={handleProjectSuccess}
      />

      <AddEducationModal
        open={isAddEducationModalOpen}
        onOpenChange={setIsAddEducationModalOpen}
        onSuccess={handleEducationSuccess}
      />
    </>
  )
}