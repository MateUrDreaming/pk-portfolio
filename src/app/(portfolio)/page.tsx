import AboutMe from "@/features/portfolio/components/home/about-me";
import Hero from "@/features/portfolio/components/home/hero";
import Skills from "@/features/portfolio/components/home/skills";
import { getServerSession } from "@/lib/get-session";


export default async function Home() {
  const session = await getServerSession()
  const user = session?.user
  return (
    <main> 
      <Hero user={user} />
      <AboutMe />
      <Skills />
    </main>
  );
}


