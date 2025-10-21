"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export function AboutDialogLink({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) {
  return (
    <a
      href={href}
      className="text-foreground underline decoration-wavy decoration-1 decoration-accent-foreground font-regular underline-offset-2 ease-in-out hover:decoration-foreground transition-all"
    >
      {children}
    </a>
  );
}

export function AboutDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem
          className="flex items-center gap-2 cursor-pointer px-2 py-1.5"
          onSelect={(e) => {
            e.preventDefault();
            setOpen(true);
          }}
        >
          <Info className="size-4 text-secondary-foreground" />
          <span className="text-sm text-secondary-foreground">About</span>
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="max-w-xs md:max-w-md rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-normal  text-secondary-foreground font-newsreader italic">
            About.
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-base text-secondary-foreground">
            Built with care, using{" "}
            <AboutDialogLink href="https://nextjs.org/">
              Next.js
            </AboutDialogLink>
            ,{" "}
            <AboutDialogLink href="https://tailwindcss.com/">
              Tailwind CSS
            </AboutDialogLink>
            ,{" "}
            <AboutDialogLink href="https://ui.shadcn.com/">
              ShadCN
            </AboutDialogLink>
            , and{" "}
            <AboutDialogLink href="https://motion.dev/">Motion</AboutDialogLink>{" "}
            for responsive interactions and animations.{" "}
            <AboutDialogLink href="https://payloadcms.com/">
              Payload CMS
            </AboutDialogLink>{" "}
            integration for content management.
          </p>
          <p className="text-base text-secondary-foreground">
            This site uses{" "}
            <AboutDialogLink href="https://fonts.google.com/specimen/Inter+Tight">
              Inter Tight
            </AboutDialogLink>{" "}
            and{" "}
            <AboutDialogLink href="https://fonts.google.com/specimen/Newsreader">
              Newsreader
            </AboutDialogLink>{" "}
            for a clean, modern look.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
