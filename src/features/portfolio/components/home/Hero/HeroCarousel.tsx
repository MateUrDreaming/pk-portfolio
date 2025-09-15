"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { useTestimonials, Testimonial } from "@/features/portfolio/hooks/use-testimonials"
import { User } from "@/lib/auth"

interface HeroCarouselProps {
  user?: User | null // Pass user for admin features
}

const HeroCarousel = ({ user }: HeroCarouselProps) => {
  const { testimonials, loading, fetchApprovedTestimonials } = useTestimonials()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null)
  const isAdmin = user?.role === "admin"

  // Auto-rotate carousel every 5 seconds, but only if we have testimonials
  useEffect(() => {
    if (testimonials.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [testimonials.length])

  // Fetch approved testimonials on mount
  useEffect(() => {
    fetchApprovedTestimonials()
  }, [fetchApprovedTestimonials])

  const nextTestimonial = () => {
    if (testimonials.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
    }
  }

  const prevTestimonial = () => {
    if (testimonials.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
    }
  }

  const truncateText = (text: string, maxLength = 150) => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength).trim() + "..."
  }

  const handleTestimonialClick = () => {
    if (testimonials.length > 0) {
      setSelectedTestimonial(testimonials[currentIndex])
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="relative w-full max-w-6xl mx-auto">
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="p-8">
            <div className="animate-pulse">
              <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // No testimonials state
  if (testimonials.length === 0) {
    return (
      <div className="relative w-full max-w-6xl mx-auto">
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="p-8">
            <div className="text-center text-muted-foreground">
              <p>No testimonials available at the moment.</p>
              {isAdmin && (
                <p className="text-sm mt-2">As an admin, you can add testimonials in the admin panel.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentTestimonial = testimonials[currentIndex]

  return (
    <>
      <div className="relative w-full max-w-6xl mx-auto">
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="icon"
                onClick={prevTestimonial}
                className="shrink-0"
                disabled={testimonials.length <= 1}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>

              <div className="flex-1 mx-6">
                <div 
                  className="text-center cursor-pointer space-y-4"
                  onClick={handleTestimonialClick}
                >
                  <blockquote className="text-lg md:text-xl italic text-foreground leading-relaxed">
                    "{truncateText(currentTestimonial.content)}"
                  </blockquote>
                  
                  <div className="flex items-center justify-center space-x-4">
                    {currentTestimonial.avatar && (
                      <img
                        src={currentTestimonial.avatar}
                        alt={currentTestimonial.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    )}
                    <div className="text-center">
                      <div className="font-semibold text-foreground">
                        {currentTestimonial.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {currentTestimonial.role} at {currentTestimonial.company}
                      </div>
                      {/* Admin-only indicators */}
                      {isAdmin && (
                        <div className="flex gap-1 justify-center mt-1">
                          {currentTestimonial.isUserSubmitted && (
                            <Badge variant="secondary" className="text-xs">
                              User Submitted
                            </Badge>
                          )}
                          {currentTestimonial.proofUrl && (
                            <Badge variant="outline" className="text-xs">
                              Verified
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={nextTestimonial}
                className="shrink-0"
                disabled={testimonials.length <= 1}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            {/* Carousel dots */}
            {testimonials.length > 1 && (
              <div className="flex justify-center space-x-2 mt-6">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentIndex 
                        ? "bg-primary" 
                        : "bg-muted-foreground/30"
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Testimonial Detail Modal */}
      <Dialog open={!!selectedTestimonial} onOpenChange={() => setSelectedTestimonial(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Testimonial from {selectedTestimonial?.name}</DialogTitle>
          </DialogHeader>
          
          {selectedTestimonial && (
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                {selectedTestimonial.avatar && (
                  <img
                    src={selectedTestimonial.avatar}
                    alt={selectedTestimonial.name}
                    className="w-16 h-16 rounded-full object-cover shrink-0"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{selectedTestimonial.name}</h3>
                  <p className="text-muted-foreground">
                    {selectedTestimonial.role} at {selectedTestimonial.company}
                  </p>
                  
                  {/* Admin info and proof link */}
                  {isAdmin && (
                    <div className="flex gap-2 mt-2">
                      {selectedTestimonial.isUserSubmitted && (
                        <Badge variant="secondary" className="text-xs">
                          User Submitted
                        </Badge>
                      )}
                      {selectedTestimonial.proofUrl && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          asChild
                          className="text-xs h-auto py-1 px-2"
                        >
                          <a 
                            href={selectedTestimonial.proofUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            View Proof
                          </a>
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              <blockquote className="text-base leading-relaxed border-l-4 border-primary pl-4 italic">
                "{selectedTestimonial.content}"
              </blockquote>
              
              {selectedTestimonial.isUserSubmitted && !isAdmin && (
                <div className="text-xs text-muted-foreground text-center">
                  This testimonial was submitted through our website
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default HeroCarousel