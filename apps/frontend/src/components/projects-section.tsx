import React from "react";
import { getAllProjects } from "@/lib/payload";
import { ProjectsSectionClient } from "./projects-section-client";

export async function ProjectsSection() {
  const projects = await getAllProjects();

  if (!projects || projects.length === 0) {
    return null; // Don't show section if no projects
  }

  return <ProjectsSectionClient projects={projects} />;
}
