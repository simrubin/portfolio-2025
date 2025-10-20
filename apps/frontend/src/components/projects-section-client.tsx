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
import { getMediaUrl } from "@/lib/payload";
import type { Project } from "@/types/payload";
import { useAnimation } from "@/providers/animation-provider";

interface ProjectsSectionClientProps {
  projects: Project[];
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
        <ScrollArea className="w-full md:h-[270px]">
          <div className="flex gap-4 py-4 px-2">
            {projects.map((project) => {
              const heroImage =
                typeof project.heroImage === "string"
                  ? null
                  : project.heroImage;

              return (
                <Tooltip key={project.id}>
                  <TooltipTrigger asChild>
                    <Link href={`/projects/${project.slug}`}>
                      <div className="relative w-[200px] h-[120px] md:w-[350px] md:h-[220px] shrink-0 rounded-2xl overflow-hidden bg-muted cursor-pointer transition-transform shadow-md transform ease-in-out hover:scale-102 hover:shadow-lg">
                        {heroImage && (
                          <Image
                            src={getMediaUrl(heroImage)}
                            alt={heroImage.alt || project.title}
                            fill
                            className="object-cover"
                            sizes="400px"
                          />
                        )}
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
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        {/* Left gradient fade */}
        <div className="absolute left-0 top-0 bottom-0 w-5 h-36 md:h-65 bg-gradient-to-r from-background to-transparent pointer-events-none" />

        {/* Right gradient fade */}
        <div className="absolute right-0 top-0 bottom-0 w-5 h-36 md:h-65 bg-gradient-to-l from-background to-transparent pointer-events-none" />
      </motion.div>
    </section>
  );
}
