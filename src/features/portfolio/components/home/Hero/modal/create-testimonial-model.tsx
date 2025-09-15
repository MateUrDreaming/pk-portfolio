"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquarePlus } from "lucide-react"
import { useTestimonials, CreateTestimonialData } from "@/features/portfolio/hooks/use-testimonials"

interface CreateTestimonialModalProps {
  trigger?: React.ReactNode
}

export function CreateTestimonialModal({ trigger }: CreateTestimonialModalProps) {
  const { createTestimonial, loading } = useTestimonials()
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<CreateTestimonialData>({
    name: "",
    role: "",
    company: "",
    content: "",
    avatar: "",
    isUserSubmitted: true,
    order: 0,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const result = await createTestimonial({
      ...formData,
      isUserSubmitted: true, // Always true for user submissions
      // Don't include proofUrl for user submissions
    })
    
    if (result) {
      resetForm()
      setOpen(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      role: "",
      company: "",
      content: "",
      avatar: "",
      isUserSubmitted: true,
      order: 0,
    })
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetForm()
    }
    setOpen(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="gap-2">
            <MessageSquarePlus className="h-4 w-4" />
            Leave a Testimonial
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submit a Testimonial</DialogTitle>
          <DialogDescription>
            Share your experience working with Parin. Your testimonial will be reviewed before being published.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., John Smith"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Your Role *</Label>
              <Input
                id="role"
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                placeholder="e.g., Senior Developer"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Company *</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
              placeholder="e.g., Tech Solutions Inc."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Your Testimonial *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Share your experience working with Parin..."
              rows={5}
              required
              className="resize-none"
            />
            <div className="text-xs text-muted-foreground text-right">
              {formData.content.length}/500 characters
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="avatar">Profile Picture URL (Optional)</Label>
            <Input
              id="avatar"
              value={formData.avatar}
              onChange={(e) => setFormData(prev => ({ ...prev, avatar: e.target.value }))}
              placeholder="https://example.com/your-photo.jpg"
              type="url"
            />
            <div className="text-xs text-muted-foreground">
              You can upload your photo to a service like Imgur or use your LinkedIn profile picture URL
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <MessageSquarePlus className="h-4 w-4 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium mb-1">Review Process</p>
                <p>Your testimonial will be reviewed before being published on the website. This helps ensure quality and authenticity. You'll be notified once it's approved.</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || formData.content.length > 500}>
              {loading ? "Submitting..." : "Submit Testimonial"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}