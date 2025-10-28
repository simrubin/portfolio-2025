"use client";

import { motion } from "motion/react";
import React from "react";

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

  // Add more awards here as needed
];

export function CommendationsSection() {
  return (
    <section className="flex flex-col items-start justify-center py-10 w-full max-w-2xl">
      <motion.h2
        className="text-lg font-newsreader italic text-secondary-foreground my-4"
        initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        Commendations.
      </motion.h2>

      <motion.div
        className="flex flex-col w-full"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              delay: 0.2,
              staggerChildren: 0.1,
            },
          },
        }}
      >
        {awards.map((award, index) => (
          <motion.div
            key={index}
            className="mb-4"
            variants={{
              hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
              visible: { opacity: 1, y: 0, filter: "blur(0px)" },
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="flex gap-2">
              <h3 className="text-base text-foreground mb-1">{award.title}</h3>
              <p className="text-base text-accent-foreground">{award.year}</p>
            </div>
            <p className="text-base text-secondary-foreground">
              {award.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
