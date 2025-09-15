"use client";

import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="bg-primary py-8 mt-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={scrollToTop}
            className="bg-background text-foreground hover:text-primary-foreground/80 hover:bg-primary-foreground/10 border border-primary-foreground/20"
          >
            <ArrowUp className="h-4 w-4" />
            <span className="sr-only">Scroll to top</span>
          </Button>

          <p className="text-primary-foreground text-sm">
            © {currentYear} All rights reserved
          </p>

          <div className="flex flex-row items-centre justify-center gap-4">
            <Button 
                asChild 
                size="lg"
                variant={"ghost"}
                className="bg-background text-foreground hover:text-primary-foreground/80 hover:bg-primary-foreground/10 border border-primary-foreground/20"
            >
              <Link
                href="https://www.linkedin.com/in/parinkasabia/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <FaLinkedin className="size-5" /> LinkedIn
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant={"ghost"}
              className="bg-background text-foreground hover:text-primary-foreground/80 hover:bg-primary-foreground/10 border border-primary-foreground/20"
            >
              <Link
                href="https://github.com/MateUrDreaming"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <FaGithub className="size-5" /> Github
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
