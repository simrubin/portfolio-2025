import React from "react";
import { Button } from "./button";
import { ArrowRight } from "lucide-react";

interface AnimatedButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
}

function AnimatedButton({
  children,
  href,
  onClick,
  className = "",
}: AnimatedButtonProps) {
  const content = (
    <>
      <span className="transition-colors group-hover:text-background">
        {children}
      </span>
      <ArrowRight className="size-4 -rotate-45 transition-all ease-out group-hover:ml-3 group-hover:rotate-0 text-foreground group-hover:text-background" />
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className={`
          group flex h-9 w-fit items-center justify-center gap-2 
          whitespace-nowrap rounded-lg bg-muted-foreground px-5 py-2 
          text-md font-semibold tracking-tight text-secondary-foreground 
          shadow-sm transition-colors 
          hover:bg-muted-foreground/90 
          focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring 
          disabled:pointer-events-none disabled:opacity-50 
          [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0
          ${className}
        `
          .trim()
          .replace(/\s+/g, " ")}
      >
        {content}
      </a>
    );
  }

  return (
    <Button
      onClick={onClick}
      className={`
        group flex h-6 w-fit items-center justify-center gap-2 
        whitespace-nowrap rounded-full px-5 py-2 
        text-sm  tracking-tight
        transition-colors bg-muted-foreground text-secondary-foreground
        hover:bg-secondary-foreground/90 
        focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring 
        disabled:pointer-events-none disabled:opacity-50 
        [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0
        ${className}
      `
        .trim()
        .replace(/\s+/g, " ")}
    >
      {content}
    </Button>
  );
}

export default AnimatedButton;
