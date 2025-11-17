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
      `${CMS_URL}/api/projects?where[_status][equals]=published&limit=100&sort=-publishedAt&depth=1`,
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
        next: { revalidate: 60 }, // Revalidate every 60 seconds for ISR
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
 * Get the full URL for a media item, with optional size variant
 */
export function getMediaUrl(
  media: Media | string,
  size?: "thumbnail" | "square" | "small" | "medium" | "large" | "xlarge"
): string {
  if (typeof media === "string") {
    // If it's just an ID, construct the URL
    return `${CMS_URL}/api/media/file/${media}`;
  }

  // PRIORITY 1: If the URL is already absolute (Cloudinary or external), return it directly
  if (media.url && media.url.startsWith("http")) {
    return media.url;
  }

  // PRIORITY 2: Try to use size variant if requested (for images)
  if (size && media[`sizes_${size}_url` as keyof Media]) {
    const sizeUrl = media[`sizes_${size}_url` as keyof Media];
    if (typeof sizeUrl === "string" && sizeUrl) {
      if (sizeUrl.startsWith("http")) {
        return sizeUrl;
      }
      return `${CMS_URL}${sizeUrl}`;
    }
  }

  // PRIORITY 3: If it starts with /api, /media, or is a relative path, prepend the CMS URL
  if (media.url) {
    return `${CMS_URL}${media.url}`;
  }

  // PRIORITY 4: Fallback to filename (for legacy media)
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
