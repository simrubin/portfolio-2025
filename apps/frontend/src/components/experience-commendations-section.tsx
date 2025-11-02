"use client";

import { motion } from "motion/react";
import React, { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const experiences = [
  {
    left: {
      company: "Maincode",
      role: "Software Engineer Intern",
      year: "2025",
      description:
        "Rebuilt and redesigned Maincode's primary website in Next.js with a modern design system. Shaped the Matilda brand identity and built a motion-rich component library and frontend demo for the Matilda LLM.",
    },
    right: {
      company: "EY",
      role: "Software Engineer Intern",
      year: "2025",
      description:
        "Built and delivered an interactive experience with PhaserJS and ReactJS, maximizing user engagement. Designed responsive data visualization components and managed client data in Drupal CMS.",
    },
  },
  {
    left: {
      company: "Sensilab",
      role: "Research Assistant",
      year: "2024-25",
      description:
        "Engineered and tested the internal assembly of an AI-powered device for custom model training research. Developed Python scripts to train on-device AI using OpenAI API and custom GPT models.",
    },
    right: {
      company: "Digital Fabrication Lab",
      role: "Technical Assistant",
      year: "2023-24",
      description:
        "Managed FDM 3D printing operations and evaluated print feasibility for students and staff. Optimized print support structures using Bambu Slicer, improving print success rates across the faculty.",
    },
  },
];

const awards = [
  {
    title: "Finalist",
    description: "Victorian Premier's Design Awards",
    year: "2025",
  },
  {
    title: "Shortlisted",
    description: "Global Creative Graduate Showcase 2025 | Arts Thread",
    year: "2025",
  },
  {
    title: "Scholarship",
    description: "Industry Based Learning Scholarship | Monash University",
    year: "2025",
  },
  {
    title: "Scholarship",
    description:
      "Industrial Design Summer Scholarship 2025 | Monash University",
    year: "2025",
  },
  {
    title: "Outstanding Project",
    description: "Creative Interactions and Solutions | Monash University",
    year: "2024",
  },
];

export function ExperienceCommendationsSection() {
  const [isOpen, setIsOpen] = useState<string | undefined>(undefined);

  return (
    <section className="flex flex-col items-start justify-center py-8 w-full max-w-2xl">
      <motion.h2
        className="text-lg font-newsreader italic text-secondary-foreground my-4"
        initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        Experience.
      </motion.h2>
      <motion.p
        className="text-base text-secondary-foreground leading-relaxed mb-4"
        initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        I've built impactful products across a range of domains. At Maincode, I
        designed and developed the Matilda demo interface, helping
        increase recognition for Australia’s first foundational model. At EY, I delivered
        a production ready React experience that strengthened brand and client
        engagement. I also contributed to on device AI research at Sensilab and
        improved fabrication workflows at Monash. Recognised in the Victorian
        Premier’s Design Awards, Global Graduate Showcase, and by Monash
        University.
      </motion.p>

      <motion.div
        className="w-full"
        initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
      >
        <Accordion
          type="single"
          collapsible
          className="w-full"
          value={isOpen}
          onValueChange={(value) => setIsOpen(value)}
        >
          <AccordionItem value="details">
            <AccordionTrigger
              className="text-base font-normal text-foreground !p-0 !m-0 [&[data-state=open]>svg]:rotate-180"
              showChevron={false}
            >
              <span>View Details.</span>
              <ChevronDownIcon className="text-accent-foreground size-4 shrink-0 transition-transform duration-200" />
            </AccordionTrigger>
            <AccordionContent className="!overflow-visible">
              <div className="flex flex-col gap-12 w-full pt-4 overflow-visible">
                {/* Experience Section */}
                <motion.div
                  className="flex flex-col gap-8 md:gap-12 w-full overflow-visible"
                  initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                  animate={
                    isOpen === "details"
                      ? { opacity: 1, y: 0, filter: "blur(0px)" }
                      : { opacity: 0, y: 40, filter: "blur(10px)" }
                  }
                  transition={
                    isOpen === "details"
                      ? { duration: 0.5, ease: "easeOut", delay: 0.1 }
                      : { duration: 0.15, ease: "easeIn" }
                  }
                >
                  <div className="flex flex-col gap-8 md:gap-12 w-full overflow-visible mt-6">
                    {experiences.map((exp, index) => (
                      <motion.div
                        key={index}
                        className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 overflow-visible"
                        initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                        animate={
                          isOpen === "details"
                            ? { opacity: 1, y: 0, filter: "blur(0px)" }
                            : { opacity: 0, y: 40, filter: "blur(10px)" }
                        }
                        transition={
                          isOpen === "details"
                            ? {
                                duration: 0.5,
                                ease: "easeOut",
                                delay: 0.2 + index * 0.15,
                              }
                            : { duration: 0.15, ease: "easeIn" }
                        }
                      >
                        {/* Left column */}
                        <div className="flex flex-col">
                          <h3 className="text-base text-foreground">
                            {exp.left.company}
                          </h3>
                          <div className="flex justify-between items-baseline mb-2">
                            <p className="text-base text-secondary-foreground">
                              {exp.left.role}
                            </p>
                            <p className="text-base text-accent-foreground ml-4">
                              {exp.left.year}
                            </p>
                          </div>
                          <p className="text-base text-secondary-foreground leading-relaxed">
                            {exp.left.description}
                          </p>
                        </div>

                        {/* Right column */}
                        <div className="flex flex-col">
                          <h3 className="text-base text-foreground">
                            {exp.right.company}
                          </h3>
                          <div className="flex justify-between items-baseline mb-2">
                            <p className="text-base text-secondary-foreground">
                              {exp.right.role}
                            </p>
                            <p className="text-base text-accent-foreground ml-4">
                              {exp.right.year}
                            </p>
                          </div>
                          <p className="text-base text-secondary-foreground leading-relaxed">
                            {exp.right.description}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Commendations Section */}
                <motion.div
                  className="flex flex-col w-full overflow-visible"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.1,
                        delayChildren: 0.2,
                      },
                    },
                  }}
                >
                  <div className="flex flex-col w-full overflow-visible">
                    {awards.map((award, index) => (
                      <motion.div
                        key={index}
                        className="mb-4 overflow-visible"
                        variants={{
                          hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
                          visible: { opacity: 1, y: 0, filter: "blur(0px)" },
                        }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      >
                        <div className="flex gap-2">
                          <h3 className="text-base text-foreground mb-1">
                            {award.title}
                          </h3>
                          <p className="text-base text-accent-foreground">
                            {award.year}
                          </p>
                        </div>
                        <p className="text-base text-secondary-foreground">
                          {award.description}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </motion.div>
    </section>
  );
}
