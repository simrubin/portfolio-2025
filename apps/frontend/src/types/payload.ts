// TypeScript types matching the Payload CMS schema

export interface Media {
  id: string;
  alt?: string;
  caption?: string;
  url: string;
  filename: string;
  mimeType: string;
  filesize: number;
  width?: number;
  height?: number;
  sizes?: {
    thumbnail?: ImageSize;
    square?: ImageSize;
    small?: ImageSize;
    medium?: ImageSize;
    large?: ImageSize;
    xlarge?: ImageSize;
    og?: ImageSize;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ImageSize {
  url: string;
  width: number;
  height: number;
  mimeType: string;
  filesize: number;
  filename: string;
}

export interface ProjectMediaItem {
  mediaItem: Media | string;
  caption?: string;
  id?: string;
}

export interface ProjectSection {
  sectionTitle: string;
  textBody: any; // Lexical rich text content
  media?: ProjectMediaItem[];
  id?: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  heroImage: Media | string;
  publishedAt: string;
  year: number;
  newlyAdded?: boolean;
  sections?: ProjectSection[];
  _status?: "draft" | "published";
  createdAt: string;
  updatedAt: string;
}

export interface ProjectsResponse {
  docs: Project[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

export interface ProjectResponse {
  id: string;
  title: string;
  slug: string;
  heroImage: Media;
  publishedAt: string;
  year: number;
  newlyAdded?: boolean;
  sections?: ProjectSection[];
  _status?: "draft" | "published";
  createdAt: string;
  updatedAt: string;
}
