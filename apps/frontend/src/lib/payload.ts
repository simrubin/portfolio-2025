import type {
  Project,
  ProjectsResponse,
  ProjectResponse,
  Media,
} from "@/types/payload";

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || "http://localhost:3000";

/**
 * Fetch all published projects from Payload CMS
 */
export async function getAllProjects(): Promise<Project[]> {
  try {
    const response = await fetch(
      `${CMS_URL}/api/projects?where[_status][equals]=published&limit=100&sort=-publishedAt`,
      {
        next: { revalidate: 60 }, // Revalidate every 60 seconds for ISR
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }

    const data: ProjectsResponse = await response.json();
    return data.docs;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

/**
 * Fetch a single project by slug
 */
export async function getProjectBySlug(
  slug: string
): Promise<ProjectResponse | null> {
  try {
    const response = await fetch(
      `${CMS_URL}/api/projects?where[slug][equals]=${slug}&depth=2`,
      {
        cache: 'no-store', // Disable caching temporarily to test mobile issue
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch project: ${response.statusText}`);
    }

    const data: ProjectsResponse = await response.json();

    if (data.docs.length === 0) {
      return null;
    }

    const project = data.docs[0];

    // Ensure heroImage is populated
    if (typeof project.heroImage === "string") {
      throw new Error("Hero image not populated");
    }

    return project as ProjectResponse;
  } catch (error) {
    console.error(`Error fetching project with slug "${slug}":`, error);
    return null;
  }
}

/**
 * Get the full URL for a media item
 */
export function getMediaUrl(media: Media | string): string {
  if (typeof media === "string") {
    // If it's just an ID, construct the URL
    return `${CMS_URL}/api/media/file/${media}`;
  }

  // If the URL is already absolute, return it
  if (media.url && media.url.startsWith("http")) {
    return media.url;
  }

  // If it starts with /api, /media, or is a relative path, prepend the CMS URL
  if (media.url) {
    return `${CMS_URL}${media.url}`;
  }

  // Fallback: use filename
  if (media.filename) {
    return `${CMS_URL}/media/${media.filename}`;
  }

  // Last resort: try to use the ID
  if (media.id) {
    return `${CMS_URL}/api/media/file/${media.id}`;
  }

  console.error("Unable to construct media URL", media);
  return "";
}

/**
 * Check if a media item is a video
 */
export function isVideo(media: Media): boolean {
  return media.mimeType?.startsWith("video/") || false;
}

/**
 * Check if a media item is an image
 */
export function isImage(media: Media): boolean {
  return media.mimeType?.startsWith("image/") || false;
}

/**
 * Get all project slugs for static generation
 */
export async function getAllProjectSlugs(): Promise<string[]> {
  try {
    const response = await fetch(
      `${CMS_URL}/api/projects?where[_status][equals]=published&limit=100&select[slug]=true`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch project slugs: ${response.statusText}`);
    }

    const data: ProjectsResponse = await response.json();
    return data.docs.map((project) => project.slug);
  } catch (error) {
    console.error("Error fetching project slugs:", error);
    return [];
  }
}
