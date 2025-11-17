"use client";

import React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import type { ProjectResponse, ProjectSection, Media } from "@/types/payload";
import { getMediaUrl, isVideo, isImage } from "@/lib/payload";
import { ImageZoom } from "@/components/kibo-ui/image-zoom";
import { CategoryPills } from "@/components/category-pills";

interface ProjectDetailProps {
  project: ProjectResponse;
}

export function ProjectDetail({ project }: ProjectDetailProps) {
  return (
    <div className="w-full max-w-xs md:max-w-2xl mx-auto">
      {/* Project Title and Date */}
      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        {/* Category Pills */}
        <CategoryPills
          categories={project.categories}
          variant="default"
          className="mb-3"
        />
        <h1 className="text-base text-foreground mb-1">{project.title}</h1>
        <p className="text-base text-secondary-foreground">
          {`${String(new Date(project.publishedAt).getMonth() + 1).padStart(2, "0")}.${new Date(project.publishedAt).getFullYear()}`}
        </p>
      </motion.div>

      {/* Hero Image */}
      <motion.div
        className="relative w-full h-[200px] md:h-[400px] rounded-xl shadow-sm overflow-hidden mb-8"
        initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.5, delay: 0.1, ease: "easeInOut" }}
      >
        {/* Desktop: Show with ImageZoom, Mobile: Show without */}
        <div className="hidden md:block absolute inset-0">
          <ImageZoom className="relative w-full h-full">
            <Image
              src={getMediaUrl(project.heroImage)}
              alt={project.heroImage.alt || project.title}
              fill
              className="object-cover rounded-xl"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              quality={75}
            />
          </ImageZoom>
        </div>
        <div className="block md:hidden absolute inset-0">
          <Image
            src={getMediaUrl(project.heroImage)}
            alt={project.heroImage.alt || project.title}
            fill
            className="object-cover rounded-xl"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            quality={75}
          />
        </div>
      </motion.div>

      {/* Content Sections */}
      {project.sections && project.sections.length > 0 && (
        <div className="space-y-16">
          {project.sections.map((section, index) => (
            <ProjectSectionComponent
              key={section.id || index}
              section={section}
              index={index}
            />
          ))}
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
      <div className="prose prose-lg dark:prose-invert max-w-none text-secondary-foreground ">
        <RichTextRenderer content={section.textBody} />
      </div>

      {/* Media Gallery */}
      {section.media && section.media.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mt-8">
          {section.media.map((mediaItem, mediaIndex) => {
            const media =
              typeof mediaItem.mediaItem === "string"
                ? null
                : mediaItem.mediaItem;

            if (!media) return null;

            return (
              <MediaItem
                key={mediaItem.id || mediaIndex}
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
  try {
    const mediaUrl = getMediaUrl(media);

    return (
      <div className="space-y-2">
        {isVideo(media) ? (
          <video
            src={mediaUrl}
            controls
            className="w-full rounded-lg"
            preload="auto"
            autoPlay={true}
            muted={true}
            loop={true}
          >
            Your browser does not support the video tag.
          </video>
        ) : isImage(media) ? (
          <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted">
            {/* Desktop: Show with ImageZoom */}
            <div className="hidden md:block absolute inset-0">
              <ImageZoom className="relative w-full h-full">
                <Image
                  src={getMediaUrl(media, "medium")}
                  alt={media.alt || caption || "Project media"}
                  fill
                  className="object-cover rounded-lg"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  loading="lazy"
                  quality={75}
                  onError={(e) => {
                    console.error(
                      "Image failed to load, falling back to original:",
                      mediaUrl,
                      media
                    );
                    const originalUrl = getMediaUrl(media);
                    e.currentTarget.src = originalUrl;
                  }}
                />
              </ImageZoom>
            </div>
            {/* Mobile: Show without ImageZoom */}
            <div className="block md:hidden absolute inset-0">
              <Image
                src={getMediaUrl(media, "medium")}
                alt={media.alt || caption || "Project media"}
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 100vw, 50vw"
                loading="lazy"
                quality={75}
                onError={(e) => {
                  console.error(
                    "Image failed to load, falling back to original:",
                    mediaUrl,
                    media
                  );
                  const originalUrl = getMediaUrl(media);
                  e.currentTarget.src = originalUrl;
                }}
              />
            </div>
          </div>
        ) : null}

        {caption && (
          <p className="text-sm text-accent-foreground italic">{caption}</p>
        )}
      </div>
    );
  } catch (error) {
    console.error("Error rendering media item:", error, media);
    return <div className="text-red-500">Error loading media</div>;
  }
}

interface RichTextRendererProps {
  content: any;
}

function RichTextRenderer({ content }: RichTextRendererProps) {
  if (!content || !content.root) {
    return null;
  }

  const renderNode = (node: any): React.ReactNode => {
    if (!node) return null;

    // Handle text nodes
    if (node.type === "text") {
      const text = node.text;

      // Return empty string for empty text nodes instead of null
      if (!text) return "";

      // Apply formatting - fixed to avoid nested React element issues
      let formattedText: React.ReactNode = text;

      if (node.format) {
        if (node.format & 4) formattedText = <u>{formattedText}</u>; // Underline
        if (node.format & 2) formattedText = <em>{formattedText}</em>; // Italic
        if (node.format & 1) formattedText = <strong>{formattedText}</strong>; // Bold
      }

      return formattedText;
    }

    // Handle element nodes
    const children = node.children?.map((child: any, index: number) => (
      <React.Fragment key={index}>{renderNode(child)}</React.Fragment>
    ));

    switch (node.type) {
      case "paragraph":
        // Render empty paragraphs to preserve spacing
        return <p>{children && children.length > 0 ? children : <br />}</p>;
      case "heading":
        const HeadingTag = `h${node.tag}` as keyof React.JSX.IntrinsicElements;
        return React.createElement(HeadingTag, {}, children);
      case "list":
        return node.listType === "bullet" ? (
          <ul>{children}</ul>
        ) : (
          <ol>{children}</ol>
        );
      case "listitem":
        return <li>{children}</li>;
      case "quote":
        return <blockquote>{children}</blockquote>;
      case "link":
        return (
          <a
            href={node.fields?.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground underline decoration-wavy decoration-1 decoration-accent-foreground font-regular underline-offset-2 ease-in-out hover:decoration-foreground transition-all"
          >
            {children}
          </a>
        );
      case "linebreak":
        return <br />;
      default:
        return <>{children}</>;
    }
  };

  return <>{renderNode(content.root)}</>;
}

// Helper function to generate section IDs from titles
export function generateSectionId(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
