"use client";

import { motion } from "motion/react";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import GradualBlur from "@/components/ui/GradualBlur";
import { getMediaUrl } from "@/lib/payload";
import type { Project } from "@/types/payload";
import { useAnimation } from "@/providers/animation-provider";
import UseAnimations from "react-useanimations";
import arrowUp from "react-useanimations/lib/arrowUp";
import { CategoryPills } from "@/components/category-pills";
import type { Category } from "@/types/payload";

interface ProjectsSectionClientProps {
  projects: Project[];
}

// Helper function to shorten category names for compact display
function shortenCategoryName(title: string): string {
  const shorteningMap: Record<string, string> = {
    "Software Development": "Soft Dev",
    "Embedded Systems": "Emb Sys",
    "Industrial Design": "Ind Des",
  };
  return shorteningMap[title] || title;
}

// Create shortened versions of categories for compact display
function getShortenedCategories(
  categories?: (Category | string)[]
): (Category | string)[] | undefined {
  if (!categories) return undefined;

  return categories.map((category) => {
    if (typeof category === "string") return category;
    return {
      ...category,
      title: shortenCategoryName(category.title),
    };
  });
}

export function ProjectsSectionClient({
  projects,
}: ProjectsSectionClientProps) {
  const { hasPlayedInitialAnimation } = useAnimation();

  const staticState = { opacity: 1, y: 0, filter: "blur(0px)" };
  const animatedInitial = { opacity: 0, y: 40, filter: "blur(10px)" };

  return (
    <section
      id="projects"
      className="flex flex-col items-start justify-center py-8 w-full max-w-2xl"
    >
      <div className="flex justify-between items-center w-full pr-5">
        <motion.h2
          className="text-lg font-newsreader italic text-secondary-foreground my-2"
          initial={hasPlayedInitialAnimation ? staticState : animatedInitial}
          animate={staticState}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: hasPlayedInitialAnimation ? 0 : 0.5,
            ease: "easeOut",
            delay: hasPlayedInitialAnimation ? 0 : 1.9,
          }}
        >
          Projects.
        </motion.h2>
        <motion.h3
          className="text-sm text-secondary-foreground my-2"
          initial={hasPlayedInitialAnimation ? staticState : animatedInitial}
          animate={staticState}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: hasPlayedInitialAnimation ? 0 : 0.5,
            ease: "easeOut",
            delay: hasPlayedInitialAnimation ? 0 : 1.9,
          }}
        >
          <span className="inline-flex items-center">
            Scroll for more{" "}
            <span className="ml-2 rotate-90">
              <UseAnimations
                animation={arrowUp}
                size={20}
                strokeColor="var(--secondary-foreground)"
              />
            </span>
          </span>
        </motion.h3>
      </div>
      <motion.div
        className="relative w-full mt-2"
        initial={hasPlayedInitialAnimation ? staticState : animatedInitial}
        animate={staticState}
        viewport={{ once: true, amount: 0.3 }}
        transition={{
          duration: hasPlayedInitialAnimation ? 0 : 0.5,
          ease: "easeOut",
          delay: hasPlayedInitialAnimation ? 0 : 2.0,
        }}
      >
        <ScrollArea className="w-full -mx-4 md:h-[270px]">
          <div className="flex gap-4 py-4 px-4">
            {projects.map((project) => {
              const heroImage =
                typeof project.heroImage === "string"
                  ? null
                  : project.heroImage;

              return (
                <Tooltip key={project.id}>
                  <TooltipTrigger asChild>
                    <Link href={`/projects/${project.slug}`}>
                      <div className="relative w-[260px] h-[156px] md:w-[350px] md:h-[220px] shrink-0 rounded-2xl overflow-hidden bg-muted cursor-pointer transition-all shadow-md transform ease-in-out hover:scale-102 hover:shadow-lg">
                        {heroImage && (
                          <Image
                            src={getMediaUrl(heroImage)}
                            alt={heroImage.alt || project.title}
                            fill
                            className="object-cover"
                            sizes="400px"
                          />
                        )}
                        {/* Category Pills */}
                        <CategoryPills
                          categories={getShortenedCategories(
                            project.categories
                          )}
                          variant="overlay"
                          className="absolute bottom-2 left-2 gap-1 md:gap-1.5 "
                        />
                      </div>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="font-medium bg-muted-foreground"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-foreground">
                        {project.title}
                      </span>
                      <span className="text-sm text-secondary-foreground">
                        {project.year}
                      </span>
                    </div>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" className="z-[9999]" />
        </ScrollArea>
      </motion.div>
    </section>
  );
}
