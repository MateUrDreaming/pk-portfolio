import { ExperienceShowcase } from "@/features/portfolio/components/experience/experience-showcase"
import { getServerSession } from "@/lib/get-session"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Experience",
  description: "Work experience and projects showcase"
}

export default async function ExperiencePage() {
  // Get the current session to check user role
  const session = await getServerSession()
  const user = session?.user

  return (
    <ExperienceShowcase user={user} />
  )
}