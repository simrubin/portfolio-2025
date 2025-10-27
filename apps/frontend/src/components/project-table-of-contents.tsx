"use client";

import React, { useEffect, useState } from "react";
import type { ProjectSection } from "@/types/payload";
import { generateSectionId } from "./project-detail";

interface ProjectTOCProps {
  sections: ProjectSection[];
}

export function ProjectTableOfContents({ sections }: ProjectTOCProps) {
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: 0,
      }
    );

    // Observe all sections
    sections.forEach((section) => {
      const sectionId = generateSectionId(section.sectionTitle);
      const element = document.getElementById(sectionId);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [sections]);

  const handleClick = (sectionTitle: string) => {
    const sectionId = generateSectionId(sectionTitle);
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100; // Offset for fixed header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <nav className="w-52">
      <div className="space-y-1">
        <h3 className="text-lg font-newsreader italic text-secondary-foreground mb-4">
          On this page
        </h3>
        <ul className="space-y-5 ">
          {sections.map((section, index) => {
            const sectionId = generateSectionId(section.sectionTitle);
            const isActive = activeSection === sectionId;

            return (
              <li key={section.id || index}>
                <button
                  onClick={() => handleClick(section.sectionTitle)}
                  className={`block w-full text-left pl-4 text-base transition-all duration-200 relative ${
                    isActive
                      ? "text-foreground font-medium"
                      : "text-accent-foreground hover:text-foreground"
                  }`}
                >
                  {isActive && (
                    <span className="absolute -left-[4px] top-1/2 -translate-y-1/2 size-1.5 rounded-full bg-foreground" />
                  )}
                  {section.sectionTitle}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
