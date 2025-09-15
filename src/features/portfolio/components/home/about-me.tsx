"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

// Pepeha data with Māori and English translations
const pepehaLines = [
  {
    id: 1,
    maori: "Ko Weiti te awa",
    english: "Weiti River is my river",
    image: "/portfolio/pepeha/weiti.jpg"
  },
  {
    id: 2,
    maori: "Ko Kasba tōku tūrangawaewae",
    english: "Kasbapar is my ancestral place to stand",
    image: "/portfolio/pepeha/family.jpg",
  },
  {
    id: 3,
    maori: "Nō Tāmaki Makaurau ahau",
    english: "I am from Auckland",
    image: "/portfolio/pepeha/auckland.jpg",
  },
  {
    id: 4,
    maori: "Ko Stanmore Bay tōku kāinga",
    english: "Stanmore Bay is my home",
    image: "/portfolio/pepeha/stanmorebay.jpg",
  },
  {
    id: 5,
    maori: "Ko Parin Kasabia tōku ingoa",
    english: "Parin Kasabia is my name",
    image: "/portfolio/pepeha/parin.jpg",
  },
]

const AboutMe = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Auto-rotate carousel every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % pepehaLines.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const handleLineClick = (index: number) => {
    setCurrentIndex(index)
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + pepehaLines.length) % pepehaLines.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % pepehaLines.length)
  }

  return (
    <section className="min-h-vh bg-foreground/5 py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground text-balance mb-4">About Me</h2>
          <p className="text-lg md:text-xl text-muted-foreground text-pretty leading-relaxed max-w-3xl mx-auto">
            My pepeha connects me to the places and people that have shaped who I am. Click on any line to explore the
            significance of each connection.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left side - Carousel */}
          <div className="w-full">
            <div className="aspect-[3/2] w-full relative overflow-hidden rounded-lg bg-muted">
              <img
                src={pepehaLines[currentIndex].image || "/placeholder.svg"}
                alt={pepehaLines[currentIndex].english}
                className="w-full h-full object-cover transition-opacity duration-500"
              />

              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors duration-200"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors duration-200"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Carousel indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {pepehaLines.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleLineClick(index)}
                    className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                      index === currentIndex ? "bg-primary" : "bg-white/50"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right side - Pepeha */}
          <div className="space-y-6">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Tōku Pepeha</h3>

            <div className="space-y-2">
              {pepehaLines.map((line, index) => (
                <div
                  key={line.id}
                  onClick={() => handleLineClick(index)}
                  className={`p-3 rounded-lg cursor-pointer transition-all duration-300 border-2 ${
                    index === currentIndex
                      ? "border-primary text-foreground"
                      : "border-transparent hover:border-muted-foreground/20 hover:bg-muted/50 text-foreground"
                  }`}
                >
                  <div className="text-base md:text-lg font-semibold mb-0.5">{line.maori}</div>
                  <div className="text-xs md:text-sm text-muted-foreground">{line.english}</div>
                </div>
              ))}
            </div>

            
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutMe
