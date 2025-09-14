import betterAuthLogo from "@/assets/better_auth_logo.png";
import parinKasabia from "@/assets/parinkasabia.png";
import { Button } from "@/components/ui/button";
import Hero from "@/features/portfolio/components/Hero";
import Skills from "@/features/portfolio/components/Skills";


export default function Home() {
  return (
    <main> 
      <Hero />
      <Skills />
    </main>
  );
}
