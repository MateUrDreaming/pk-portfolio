"use client"

import { ModeToggle } from "@/components/mode-toggle"
import { UserDropdown } from "@/components/user-dropdown"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { UserIcon } from "lucide-react"
import Link from "next/link"
import { MobileNav } from "./mobile-nav"
import Image from "next/image"
import parinKasabia from "@/assets/parinkasabia.png"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard", authRequired: true },
  { href: "/experience", label: "Experience" },
  { href: "/contact", label: "Contact" },
]

export function Navbar() {
  // Use the useSession hook from better-auth
  const { data: session, isPending } = authClient.useSession()
  const user = session?.user

  // Filter navigation links based on auth status
  const filteredNavLinks = navLinks.filter((link) => !link.authRequired || (link.authRequired && user))

  return (
    <header className="absolute top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg md:text-xl">
          <div className="w-8 h-8 rounded-full border border-muted flex items-center justify-center bg-muted">
            < Image src = { parinKasabia } alt = " Parin Kasabia logo " width = { 32 } height = { 32 } className = " rounded-full border border-muted " />
          </div>
          <span className="hidden sm:inline">portfolio</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {filteredNavLinks.map((link) => (
            <NavLink key={link.href} href={link.href} label={link.label} />
          ))}
        </nav>

        {/* Right side - Actions */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <ModeToggle />
            {!isPending &&
              (user ? (
                <UserDropdown user={user} />
              ) : (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" asChild>
                    <Link href="/sign-in">Sign In</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/sign-up">Sign Up</Link>
                  </Button>
                </div>
              ))}
          </div>

          {/* Mobile Navigation - only show on mobile */}
          <div className="md:hidden">
            <MobileNav navLinks={filteredNavLinks} user={user} />
          </div>
        </div>
      </div>
    </header>
  )
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
      {label}
    </Link>
  )
}
