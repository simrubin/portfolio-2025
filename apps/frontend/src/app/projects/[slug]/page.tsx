import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Undo2Icon } from "lucide-react";
import { ProjectDetail } from "@/components/project-detail";
import { getProjectBySlug, getAllProjectSlugs } from "@/lib/payload";
import type { Metadata } from "next";

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
    <div className="min-h-screen py-20 px-4 md:px-8">
      {/* Back Button */}
      <div className="max-w-4xl mx-auto mb-8">
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 font-newsreader italic text-secondary-foreground hover:text-foreground transition-colors"
        >
          <Undo2Icon className="w-4 h-4" />
          <span>Projects</span>
        </Link>
      </div>

      {/* Project Content */}
      <ProjectDetail project={project} />
    </div>
  );
}

// Enable ISR
export const revalidate = 60; // Revalidate every 60 seconds
