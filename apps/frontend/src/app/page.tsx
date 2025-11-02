import { HeroSection } from "@/components/hero-section";
import { RightNowSection } from "@/components/right-now-section";
import { ReachMeSection } from "@/components/reach-me-section";
import { ProjectsSection } from "@/components/projects-section";
import { ExperienceCommendationsSection } from "@/components/experience-commendations-section";
import GradualBlur from "@/components/ui/GradualBlur";

export default async function Home() {
  return (
    <>
      <GradualBlur
        position="top"
        height="5rem"
        strength={1.25}
        zIndex={900}
        opacity={1}
        target="page"
        divCount={4}
        curve="ease-in-out"
      />
      <div className="flex flex-col items-center justify-center max-w-xs md:max-w-5xl mx-auto min-h-screen py-20 md:py-40">
        <HeroSection />
        <ProjectsSection />
        <RightNowSection />
        <ExperienceCommendationsSection />
        <ReachMeSection />
      </div>
    </>
  );
}

// Enable ISR for the home page
export const revalidate = 60;
