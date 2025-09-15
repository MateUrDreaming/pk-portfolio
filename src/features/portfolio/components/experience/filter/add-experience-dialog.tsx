"use client"

import type { ReactNode } from "react"
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

interface AddExperienceDialogProps {
  activeTab: string
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  trigger: ReactNode
}

export function AddExperienceDialog({ activeTab, isOpen, setIsOpen, trigger }: AddExperienceDialogProps) {
  const handleAddWork = (formData: FormData) => {
    // Handle adding new work experience
    console.log("Adding work experience:", Object.fromEntries(formData))
    setIsOpen(false)
  }

  const handleAddProject = (formData: FormData) => {
    // Handle adding new project
    console.log("Adding project:", Object.fromEntries(formData))
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New {activeTab === "work" ? "Work Experience" : "Project"}</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new {activeTab === "work" ? "work experience" : "project"} to your showcase.
          </DialogDescription>
        </DialogHeader>

        {activeTab === "work" ? (
          <form action={handleAddWork} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Job Title</Label>
                <Input id="title" name="title" placeholder="Senior Software Engineer" required />
              </div>
              <div>
                <Label htmlFor="company">Company</Label>
                <Input id="company" name="company" placeholder="Tech Corp" required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location">Location</Label>
                <Input id="location" name="location" placeholder="San Francisco, CA" />
              </div>
              <div>
                <Label htmlFor="duration">Duration</Label>
                <Input id="duration" name="duration" placeholder="2022 - Present" required />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe your role and responsibilities..."
                required
              />
            </div>
            <div>
              <Label htmlFor="technologies">Technologies (comma-separated)</Label>
              <Input id="technologies" name="technologies" placeholder="React, Node.js, AWS, TypeScript" />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Experience</Button>
            </div>
          </form>
        ) : (
          <form action={handleAddProject} className="space-y-4">
            <div>
              <Label htmlFor="projectTitle">Project Title</Label>
              <Input id="projectTitle" name="title" placeholder="E-commerce Platform" required />
            </div>
            <div>
              <Label htmlFor="projectDescription">Description</Label>
              <Textarea id="projectDescription" name="description" placeholder="Describe your project..." required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="githubUrl">GitHub URL</Label>
                <Input id="githubUrl" name="githubUrl" placeholder="https://github.com/username/project" />
              </div>
              <div>
                <Label htmlFor="liveUrl">Live URL</Label>
                <Input id="liveUrl" name="liveUrl" placeholder="https://project-demo.com" />
              </div>
            </div>
            <div>
              <Label htmlFor="projectTechnologies">Technologies (comma-separated)</Label>
              <Input id="projectTechnologies" name="technologies" placeholder="Next.js, Stripe, Prisma, PostgreSQL" />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Project</Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
