"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, Building, Code, Plus } from "lucide-react"
import { AddExperienceDialog } from "./add-experience-dialog"

interface ExperienceFilterBarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  searchTerm: string
  setSearchTerm: (term: string) => void
  isUser: boolean
}

export function ExperienceFilterBar({
  activeTab,
  setActiveTab,
  searchTerm,
  setSearchTerm,
  isUser,
}: ExperienceFilterBarProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-8 shadow-sm">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <Select value={activeTab} onValueChange={setActiveTab}>
          <SelectTrigger className="w-[180px]">
            <SelectValue>
              <div className="flex items-center gap-2">
                {activeTab === "work" ? (
                  <>
                    <Building className="h-4 w-4" />
                    Work Experience
                  </>
                ) : (
                  <>
                    <Code className="h-4 w-4" />
                    Projects
                  </>
                )}
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
          </SelectContent>
        </Select>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder={`Search ${activeTab === "work" ? "work experience" : "projects"}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {isUser && (
          <AddExperienceDialog
            activeTab={activeTab}
            isOpen={isAddDialogOpen}
            setIsOpen={setIsAddDialogOpen}
            trigger={
              <Button size="icon" className="h-10 w-10">
                <Plus className="h-4 w-4" />
              </Button>
            }
          />
        )}
      </div>
    </div>
  )
}
