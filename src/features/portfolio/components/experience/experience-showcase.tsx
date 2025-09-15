"use client"

import { useState } from "react"
import { ExperienceHeader } from "./header/experience-header"
import { ExperienceFilterBar } from "./filter/experience-filter-bar"
import { ExperienceContent } from "./content/experience-content"
import { workExperience, projects } from "./temp/experience-data"

export function ExperienceShowcase() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("work")
  const [isUser, setIsUser] = useState(true) // Set to true to simulate logged-in user

  return (
    <section className="min-h-svh bg-background pt-20 md:pt-32">
      <div className="mx-auto max-w-6xl px-4">
        <ExperienceHeader />

        <ExperienceFilterBar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          isUser={isUser}
        />

        <ExperienceContent
          activeTab={activeTab}
          searchTerm={searchTerm}
          workExperience={workExperience}
          projects={projects}
        />
      </div>
    </section>
  )
}
