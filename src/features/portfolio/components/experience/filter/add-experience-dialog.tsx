"use client"

import type { ReactNode } from "react"
import { useState, useEffect, useRef } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, Plus, ChevronDown, ChevronUp } from "lucide-react"

interface AddExperienceDialogProps {
  activeTab: string
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  trigger: ReactNode
}

export function AddExperienceDialog({ activeTab, isOpen, setIsOpen, trigger }: AddExperienceDialogProps) {
  const [achievements, setAchievements] = useState<string[]>([])
  const [isAchievementsExpanded, setIsAchievementsExpanded] = useState(true)
  const workFormRef = useRef<HTMLFormElement>(null)
  const projectFormRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (isOpen) {
      setAchievements([])
      setIsAchievementsExpanded(true)
      if (workFormRef.current) {
        workFormRef.current.reset()
      }
      if (projectFormRef.current) {
        projectFormRef.current.reset()
      }
    }
  }, [isOpen])

  const handleAddWork = (formData: FormData) => {
    console.log("Adding work experience:", Object.fromEntries(formData))
    console.log("Achievements:", achievements)
    setIsOpen(false)
    setAchievements([])
  }

  const handleAddProject = (formData: FormData) => {
    console.log("Adding project:", Object.fromEntries(formData))
    console.log("Key Features:", achievements)
    setIsOpen(false)
    setAchievements([])
  }

  const addAchievement = () => {
    setAchievements([...achievements, ""])
  }

  const updateAchievement = (index: number, value: string) => {
    const updated = [...achievements]
    updated[index] = value
    setAchievements(updated)
  }

  const removeAchievement = (index: number) => {
    setAchievements(achievements.filter((_, i) => i !== index))
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="pb-4">
          <DialogTitle>Add New {activeTab === "work" ? "Work Experience" : "Project"}</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new {activeTab === "work" ? "work experience" : "project"} to your showcase.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
          {activeTab === "work" ? (
            <form ref={workFormRef} action={handleAddWork} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="title">Job Title</Label>
                  <Input id="title" name="title" placeholder="Senior Software Engineer" required className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" name="company" placeholder="Tech Corp" required className="mt-2" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" name="location" placeholder="San Francisco, CA" className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="duration">Duration</Label>
                  <Input id="duration" name="duration" placeholder="2022 - Present" required className="mt-2" />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe your role and responsibilities..."
                  required
                  className="mt-2 min-h-[100px]"
                />
              </div>
              <div>
                <Label htmlFor="technologies">Technologies (comma-separated)</Label>
                <Input
                  id="technologies"
                  name="technologies"
                  placeholder="React, Node.js, AWS, TypeScript"
                  className="mt-2"
                />
              </div>

              <div>
                <div className="border rounded-md">
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full flex items-center justify-between p-4 h-auto"
                    onClick={() => setIsAchievementsExpanded(!isAchievementsExpanded)}
                  >
                    <div className="flex items-center gap-2">
                      <Label className="text-base font-medium">Key Achievements</Label>
                      {achievements.length > 0 && (
                        <span className="text-sm text-muted-foreground">({achievements.length} added)</span>
                      )}
                    </div>
                    {isAchievementsExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>

                  {isAchievementsExpanded && (
                    <div className="border-t p-4 space-y-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addAchievement}
                        className="w-full bg-transparent"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Achievement
                      </Button>

                      {achievements.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No achievements added yet. Click "Add Achievement" to get started.
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {achievements.map((achievement, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Input
                                value={achievement}
                                onChange={(e) => updateAchievement(index, e.target.value)}
                                placeholder="Describe a key achievement..."
                                className="flex-1"
                              />
                              <Button type="button" variant="ghost" size="sm" onClick={() => removeAchievement(index)}>
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Experience</Button>
              </div>
            </form>
          ) : (
            <form ref={projectFormRef} action={handleAddProject} className="space-y-6">
              <div>
                <Label htmlFor="projectTitle">Project Title</Label>
                <Input id="projectTitle" name="title" placeholder="E-commerce Platform" required className="mt-2" />
              </div>
              <div>
                <Label htmlFor="projectDescription">Description</Label>
                <Textarea
                  id="projectDescription"
                  name="description"
                  placeholder="Describe your project..."
                  required
                  className="mt-2 min-h-[100px]"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="githubUrl">GitHub URL</Label>
                  <Input
                    id="githubUrl"
                    name="githubUrl"
                    placeholder="https://github.com/username/project"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="liveUrl">Live URL</Label>
                  <Input id="liveUrl" name="liveUrl" placeholder="https://project-demo.com" className="mt-2" />
                </div>
              </div>
              <div>
                <Label htmlFor="projectTechnologies">Technologies (comma-separated)</Label>
                <Input
                  id="projectTechnologies"
                  name="technologies"
                  placeholder="Next.js, Stripe, Prisma, PostgreSQL"
                  className="mt-2"
                />
              </div>

              <div>
                <div className="border rounded-md">
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full flex items-center justify-between p-4 h-auto"
                    onClick={() => setIsAchievementsExpanded(!isAchievementsExpanded)}
                  >
                    <div className="flex items-center gap-2">
                      <Label className="text-base font-medium">Key Features</Label>
                      {achievements.length > 0 && (
                        <span className="text-sm text-muted-foreground">({achievements.length} added)</span>
                      )}
                    </div>
                    {isAchievementsExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>

                  {isAchievementsExpanded && (
                    <div className="border-t p-4 space-y-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addAchievement}
                        className="w-full bg-transparent"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Feature
                      </Button>

                      {achievements.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No features added yet. Click "Add Feature" to get started.
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {achievements.map((feature, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Input
                                value={feature}
                                onChange={(e) => updateAchievement(index, e.target.value)}
                                placeholder="Describe a key feature..."
                                className="flex-1"
                              />
                              <Button type="button" variant="ghost" size="sm" onClick={() => removeAchievement(index)}>
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Project</Button>
              </div>
            </form>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
