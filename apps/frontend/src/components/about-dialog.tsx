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
          <DialogTitle className="text-base font-normal  text-foreground">
            About
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-base text-secondary-foreground">
            Developed with Next.js, Tailwind CSS, ShadCN, and Motion.dev for
            smooth, responsive interactions. Payload CMS integration for content
            management.
          </p>
          <p className="text-base text-secondary-foreground">
            Uses Inter Tight and Newstead for a clean, modern look.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
