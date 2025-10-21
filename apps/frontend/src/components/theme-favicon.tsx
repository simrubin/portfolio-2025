"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

export function ThemeFavicon() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    // Get all favicon links
    const links = document.querySelectorAll("link[rel*='icon']");
    links.forEach((link) => link.remove());

    const isDark = resolvedTheme === "dark";
    const basePath = isDark ? "/favicons-dark" : "/favicons-light";

    // Add favicon links
    const addLink = (rel: string, href: string, sizes?: string) => {
      const link = document.createElement("link");
      link.rel = rel;
      link.href = href;
      if (sizes) link.setAttribute("sizes", sizes);
      document.head.appendChild(link);
    };

    // Add all favicon variations
    addLink("icon", `${basePath}/favicon.ico`);
    addLink("icon", `${basePath}/favicon-16x16.png`, "16x16");
    addLink("icon", `${basePath}/favicon-32x32.png`, "32x32");
    addLink("apple-touch-icon", `${basePath}/apple-touch-icon.png`, "180x180");
  }, [resolvedTheme]);

  return null;
}
