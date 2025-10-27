"use client";

import { motion } from "motion/react";
import React from "react";

export function ExperienceSection() {
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

  return (
    <section className="flex flex-col items-start justify-center py-10 w-full max-w-2xl">
      <motion.h2
        className="text-lg font-newsreader italic text-secondary-foreground my-4"
        initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        Experience.
      </motion.h2>
      <motion.div
        className="flex flex-col gap-8 md:gap-12 w-full"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        transition={{ staggerChildren: 0.15 }}
      >
        {experiences.map((exp, index) => (
          <motion.div
            key={index}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16"
            variants={{
              hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
              visible: { opacity: 1, y: 0, filter: "blur(0px)" },
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {/* Left column */}
            <div className="flex flex-col">
              <h3 className="text-base text-foreground ">
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
              <h3 className="text-base text-foreground ">
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
      </motion.div>
    </section>
  );
}
