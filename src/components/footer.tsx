"use client"

import { Button } from "@/components/ui/button"
import { ArrowUp } from "lucide-react"
import { ModeToggle } from "./mode-toggle"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <footer className="bg-primary py-8 mt-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-center justify-between">
          <Button
            variant="secondary"
            size="icon"
            onClick={scrollToTop}
            className="bg-background/10 hover:bg-background/20 text-primary-foreground"
          >
            <ArrowUp className="h-4 w-4" />
            <span className="sr-only">Scroll to top</span>
          </Button>

          <p className="text-primary-foreground text-sm">© {currentYear} All rights reserved</p>

          <div className="[&_button]:border-primary-foreground/20 [&_button]:text-primary-foreground [&_button]:hover:bg-background/10">
            <ModeToggle />
          </div>
        </div>
      </div>
    </footer>
  )
}
