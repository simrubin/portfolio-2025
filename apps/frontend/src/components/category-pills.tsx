import React from "react";
import type { Category } from "@/types/payload";

interface CategoryPillsProps {
  categories?: (Category | string)[];
  variant?: "overlay" | "default";
  className?: string;
}

export function CategoryPills({
  categories,
  variant = "default",
  className = "",
}: CategoryPillsProps) {
  if (!categories || categories.length === 0) {
    return null;
  }

  const variantStyles = {
    overlay: "bg-background/60 text-secondary-foreground backdrop-blur-sm",
    default: "bg-muted-foreground text-secondary-foreground",
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {categories.map((category) => {
        const cat = typeof category === "string" ? null : category;
        if (!cat) return null;
        return (
          <span
            key={cat.id}
            className={`text-xs px-2 py-1 md:px-3 md:py-1.5 rounded-full font-regular tracking-wide ${variantStyles[variant]}`}
          >
            {cat.title}
          </span>
        );
      })}
    </div>
  );
}
