"use client";

import React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import type { ProjectResponse, ProjectSection, Media } from "@/types/payload";
import { getMediaUrl, isVideo, isImage } from "@/lib/payload";
import { ImageZoom } from "@/components/kibo-ui/image-zoom";

interface ProjectDetailProps {
  project: ProjectResponse;
}

export function ProjectDetail({ project }: ProjectDetailProps) {
  // Add safety checks for mobile
  if (!project || !project.title) {
    return null;
  }

  return (
    <div className="w-full max-w-xs md:max-w-2xl mx-auto">
      {/* Project Title and Date */}
      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <h1 className="text-base text-foreground mb-1">{project.title}</h1>
        {project.publishedAt && (
          <p className="text-base text-secondary-foreground">
            {`${String(new Date(project.publishedAt).getMonth() + 1).padStart(2, "0")}.${new Date(project.publishedAt).getFullYear()}`}
          </p>
        )}
      </motion.div>

      {/* Hero Image */}
      {project.heroImage && typeof project.heroImage !== "string" && (
        <motion.div
          className="relative w-full h-[200px] md:h-[400px] rounded-xl shadow-sm overflow-hidden mb-8"
          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeInOut" }}
        >
          <ImageZoom className="relative w-full h-full">
            <Image
              src={getMediaUrl(project.heroImage)}
              alt={project.heroImage.alt || project.title}
              fill
              className="object-cover rounded-xl"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            />
          </ImageZoom>
        </motion.div>
      )}

      {/* Content Sections */}
      {project.sections &&
        Array.isArray(project.sections) &&
        project.sections.length > 0 && (
          <div className="space-y-16">
            {project.sections.map((section, index) => {
              // Safety check for each section
              if (!section || !section.sectionTitle) return null;

              return (
                <ProjectSectionComponent
                  key={section.id || `section-${index}`}
                  section={section}
                  index={index}
                />
              );
            })}
          </div>
        )}
    </div>
  );
}

interface ProjectSectionComponentProps {
  section: ProjectSection;
  index: number;
}

function ProjectSectionComponent({
  section,
  index,
}: ProjectSectionComponentProps) {
  // Safety checks
  if (!section || !section.sectionTitle) {
    return null;
  }

  const sectionId = generateSectionId(section.sectionTitle);

  return (
    <motion.section
      id={sectionId}
      className="space-y-6 scroll-mt-24"
      initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeInOut" }}
    >
      {/* Section Title */}
      <h2 className="text-lg font-newsreader italic text-secondary-foreground my-2">
        {section.sectionTitle}
      </h2>

      {/* Rich Text Content */}
      {section.textBody && (
        <div className="prose prose-lg dark:prose-invert max-w-none text-secondary-foreground ">
          <RichTextRenderer content={section.textBody} />
        </div>
      )}

      {/* Media Gallery */}
      {section.media &&
        Array.isArray(section.media) &&
        section.media.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {section.media.map((mediaItem, mediaIndex) => {
              if (!mediaItem) return null;

              const media =
                typeof mediaItem.mediaItem === "string"
                  ? null
                  : mediaItem.mediaItem;

              if (!media) return null;

              return (
                <MediaItem
                  key={mediaItem.id || `media-${mediaIndex}`}
                  media={media}
                  caption={mediaItem.caption}
                />
              );
            })}
          </div>
        )}
    </motion.section>
  );
}

interface MediaItemProps {
  media: Media;
  caption?: string;
}

function MediaItem({ media, caption }: MediaItemProps) {
  return (
    <div className="space-y-2">
      {isVideo(media) ? (
        <video
          src={getMediaUrl(media)}
          controls
          className="w-full rounded-lg"
          preload="metadata"
        >
          Your browser does not support the video tag.
        </video>
      ) : isImage(media) ? (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted">
          <ImageZoom className="relative w-full h-full">
            <Image
              src={getMediaUrl(media)}
              alt={media.alt || caption || "Project media"}
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </ImageZoom>
        </div>
      ) : null}

      {caption && (
        <p className="text-sm text-accent-foreground italic">{caption}</p>
      )}
    </div>
  );
}

interface RichTextRendererProps {
  content: any;
}

function RichTextRenderer({ content }: RichTextRendererProps) {
  // Enhanced safety checks
  if (!content || typeof content !== "object") {
    return null;
  }

  if (!content.root || typeof content.root !== "object") {
    return null;
  }

  // SIMPLIFIED VERSION - Only extract text, no formatting
  const extractText = (node: any): string => {
    if (!node || typeof node !== "object") return "";

    if (node.type === "text" && typeof node.text === "string") {
      return node.text;
    }

    if (node.children && Array.isArray(node.children)) {
      return node.children.map(extractText).join(" ");
    }

    return "";
  };

  const textContent = extractText(content.root);

  return <p>{textContent}</p>;
}

// Helper function to generate section IDs from titles
export function generateSectionId(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
