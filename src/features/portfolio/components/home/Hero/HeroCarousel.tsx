"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Testimonial {
  id: number
  name: string
  role: string
  company: string
  content: string
  avatar: string
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Senior DevOps Engineer",
    company: "TechCorp",
    content:
      "Parin's understanding of automation and CI/CD pipelines is impressive. His fresh perspective and eagerness to learn make him a valuable team member.",
    avatar: "/globe.svg",
  },
  {
    id: 2,
    name: "Michael Rodriguez",
    role: "Cloud Architect",
    company: "CloudSolutions",
    content:
      "Working with Parin on infrastructure projects has been great. His attention to detail and systematic approach to problem-solving stand out.",
    avatar: "/globe.svg",
  },
  {
    id: 3,
    name: "Emily Watson",
    role: "Team Lead",
    company: "StartupXYZ",
    content:
      "Parin brings excellent technical skills and a collaborative spirit. His passion for DevOps and continuous learning is evident in everything he does.",
    avatar: "/globe.svg",
  },
]


const HeroCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null)

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
  }

  const truncateText = (text: string, maxLength = 150) => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength).trim() + "..."
  }

  const handleTestimonialClick = () => {
    setSelectedTestimonial(testimonials[currentIndex])
  }

  useEffect(() => {
    const interval = setInterval(nextTestimonial, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <div className="relative w-full max-w-6xl mx-auto">
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <Button
                variant="ghost"
                size="icon"
                onClick={prevTestimonial}
                className="h-10 w-10 rounded-full bg-background/80 hover:bg-background"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>

              <div className="flex-1 mx-8">
                <blockquote
                  className="text-lg md:text-xl text-center text-foreground/90 leading-relaxed mb-6 cursor-pointer hover:text-foreground transition-colors"
                  onClick={handleTestimonialClick}
                  title="Click to read full testimonial"
                >
                  "{truncateText(testimonials[currentIndex].content)}"
                </blockquote>

                <div className="flex items-center justify-center gap-4">
                  <img
                    src={testimonials[currentIndex].avatar || "/placeholder.svg"}
                    alt={testimonials[currentIndex].name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="text-center">
                    <div className="font-semibold text-foreground">{testimonials[currentIndex].name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonials[currentIndex].role} <br></br> @ {testimonials[currentIndex].company}
                    </div>
                  </div>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={nextTestimonial}
                className="h-10 w-10 rounded-full bg-background/80 hover:bg-background"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex justify-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? "bg-primary" : "bg-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!selectedTestimonial} onOpenChange={() => setSelectedTestimonial(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Testimonial from {selectedTestimonial?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <blockquote className="text-lg text-foreground/90 leading-relaxed italic">
              "{selectedTestimonial?.content}"
            </blockquote>
            <div className="flex items-center gap-4 pt-4 border-t">
              <img
                src={selectedTestimonial?.avatar || "/globe.svg"}
                alt={selectedTestimonial?.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <div className="font-semibold text-foreground text-lg">{selectedTestimonial?.name}</div>
                <div className="text-muted-foreground">
                  {selectedTestimonial?.role} <br></br> @ {selectedTestimonial?.company}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default HeroCarousel