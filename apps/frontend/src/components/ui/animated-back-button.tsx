import React from "react";
import { Button } from "./button";
import { ArrowLeft } from "lucide-react";

interface AnimatedBackButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
}

function AnimatedBackButton({
  children,
  href,
  onClick,
  className = "",
}: AnimatedBackButtonProps) {
  const content = (
    <>
      <ArrowLeft className="size-5 rotate-45 transition-all ease-out group-hover:-translate-x-1 group-hover:rotate-0 text-accent-foreground group-hover:text-foreground" />
      <span className="transition-colors group-hover:text-background">
        {children}
      </span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className={`
          group flex h-auto w-fit items-center justify-center !p-0 !m-0 gap-2 bg-transparent
          whitespace-nowrap
          text-md font-semibold tracking-tight text-secondary-foreground 
          transition-colors 
          focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring 
          [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0
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
        group flex h-auto w-fit items-center justify-center !p-0 !m-0 gap-2 bg-transparent
        whitespace-nowrap
        text-sm tracking-tight
        transition-colors text-secondary-foreground
        hover:bg-transparent
        hover:text-foreground 
        focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring 
        disabled:pointer-events-none disabled:opacity-50 
        [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0
        ${className}
      `
        .trim()
        .replace(/\s+/g, " ")}
    >
      {content}
    </Button>
  );
}

export default AnimatedBackButton;
