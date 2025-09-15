"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet"
import { MenuIcon, UserIcon, LogOutIcon, ShieldIcon } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { ModeToggle } from "@/components/mode-toggle"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"
import Image from "next/image"
import type { User } from "@/lib/auth"
import parinKasabia from "@/assets/parinkasabia.png"

interface NavLink {
  href: string
  label: string
  authRequired?: boolean
}

interface MobileNavProps {
  navLinks: NavLink[]
  user: User | null | undefined
}

export function MobileNav({ navLinks, user }: MobileNavProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && open) {
        setOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [open])

  const isActiveLink = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
  }

  async function handleSignOut() {
    const { error } = await authClient.signOut()
    if (error) {
      toast.error(error.message || "Something went wrong")
    } else {
      toast.success("Successful Signout")
      router.push("/sign-in")
    }
    setOpen(false)
  }

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTitle className="hidden">Navigation Menu</SheetTitle>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon">
            <MenuIcon className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px] py-10">
          <SheetHeader className="flex items-center justify-center">
            <SheetDescription className="hidden">Navigation menu</SheetDescription>
          </SheetHeader>

          <div className="flex flex-col gap-6 p-6">
            {/* Navigation Links */}
            <div className="flex items-center justify-center flex-row gap-2">
                <Link href="/" className="flex items-center gap-2 font-semibold text-lg md:text-xl flex-col">
                    <div className="w-12 h-12 rounded-full border border-muted flex items-center justify-center bg-muted">
                        < Image src={ parinKasabia } alt = " Parin Kasabia logo " width = { 128 } height = { 128 } className = " rounded-full border border-muted " />
                    </div>
                    <span className="inline">portfolio</span>
                </Link>
            </div>
            {user ? (
              <div className="flex flex-col gap-3 pt-3 border-t">
                {/* User Info */}
                <div className="flex items-center justify-center gap-3 px-3 py-2">
                  {user.image ? (
                    <Image
                      src={user.image || "/placeholder.svg"}
                      alt={user.name}
                      width={32}
                      height={32}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <UserIcon className="w-4 h-4" />
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{user.name}</span>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                  </div>
                </div>

                {/* User Actions */}
                <div className="flex flex-row gap-2 items-center justify-center">
                  <Button variant="ghost" size="sm" asChild className="justify-start">
                    <Link href="/profile" onClick={() => setOpen(false)}>
                      <UserIcon className="w-4 h-4 mr-2" />
                    </Link>
                  </Button>

                  {user.role === "admin" && (
                    <Button variant="ghost" size="sm" asChild className="justify-start">
                      <Link href="/admin" onClick={() => setOpen(false)}>
                        <ShieldIcon className="w-4 h-4 mr-2" />
                      </Link>
                    </Button>
                  )}

                  <Button variant="ghost" size="sm" onClick={handleSignOut} className="justify-start">
                    <LogOutIcon className="w-4 h-4 mr-2" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-3 border-t">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/sign-in" onClick={() => setOpen(false)}>
                    Sign In
                  </Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/sign-up" onClick={() => setOpen(false)}>
                    Sign Up
                  </Link>
                </Button>
              </div>
            )}

            <nav className="flex flex-col space-y-3 border-t pt-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`text-sm font-medium transition-colors hover:text-foreground py-2 px-3 rounded-md ${
                    isActiveLink(link.href) ? "text-foreground bg-primary" : "text-muted-foreground hover:bg-primary/50 dark:hover:bg-primary/20"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
