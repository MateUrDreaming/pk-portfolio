import betterAuthLogo from "@/assets/better_auth_logo.png";
import parinKasabia from "@/assets/parinkasabia.png";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { FaLinkedin, FaGithub  } from "react-icons/fa";
import { SiReaddotcv } from "react-icons/si";
import HeroCarousel from "./Hero/HeroCarousel";

const Hero = () => {
  return (
    <section className="min-h-svh bg-background pt-20 md:pt-32">
      <div className="mx-auto max-w-6xl px-4">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left side - Blurb */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground text-balance">
              Kia ora, welcome to my portfolio!
              <br></br>
              <span className="text-primary">I&apos;m Parin Kasabia.</span> 
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground text-pretty leading-relaxed">
              Recent graduate from the University of Auckland aspiring to become a DevOps engineeer who is passionate about automation and building robust systems. 
            </p>
            <div className="flex flex-row items-centre justify-center gap-4">
                <Button asChild size="lg">
                    <Link href="https://www.linkedin.com/in/parinkasabia/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                        <FaLinkedin className="size-5" /> LinkedIn
                    </Link>
                </Button>
                <Button asChild size="lg">
                    <Link href="/file/cv.pdf" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                        <SiReaddotcv className="size-5" /> Resume 
                    </Link>
                </Button>
                <Button asChild size="lg">
                    <Link href="https://github.com/MateUrDreaming" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                        <FaGithub className="size-5" /> Github 
                    </Link>
                </Button>
            </div>
          </div>

          {/* Right side - YouTube Video Skeleton */}
          <div className="w-full">
            <div className="aspect-video w-full">
              <Skeleton className="w-full h-full rounded-lg" />
            </div>
            <div className="mt-4 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        </div>
        {/* Carousel Section */}
        <div className="mt-12 space-y-5">
          <h2 className="text-2xl md:text-4xl font-bold text-foreground text-center">Kind words from colleagues</h2>
          {/* Testimonial Carousel Component */}
          <HeroCarousel />
        </div>
      </div>
    </section>
  )
}

export default Hero