import { notFound } from "next/navigation";
import { ProjectDetail } from "@/components/project-detail";
import { ProjectTableOfContents } from "@/components/project-table-of-contents";
import {
  AnimatedBackButtonSection,
  AnimatedBackButtonSectionMobile,
} from "@/components/animated-back-button-section";
import { getProjectBySlug, getAllProjectSlugs } from "@/lib/payload";
import type { Metadata } from "next";
import GradualBlur from "@/components/ui/GradualBlur";

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static params for all projects (ISR)
export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs();

  return slugs.map((slug) => ({
    slug: slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: `${project.title} | Portfolio`,
    description: `Project: ${project.title} - ${project.year}`,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen py-30 px-4 md:px-8">
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
      <div className="relative max-w-6xl mx-auto lg:flex lg:gap-8 xl:gap-12">
        {/* Sticky Back Button - Left Side (Desktop) */}
        <div className="hidden lg:block flex-shrink-0">
          <AnimatedBackButtonSection />
        </div>

        {/* Project Content - Centered */}
        <div className="flex-1 max-w-xs md:max-w-2xl mx-auto">
          {/* Mobile Back Button - Top */}
          <AnimatedBackButtonSectionMobile />

          <ProjectDetail project={project} />
        </div>

        {/* Table of Contents - Right Side (Desktop) */}
        {project.sections && project.sections.length > 0 && (
          <div className="hidden xl:block flex-shrink-0">
            <div className="sticky top-24">
              <ProjectTableOfContents sections={project.sections} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Enable ISR
export const revalidate = 60; // Revalidate every 60 seconds
