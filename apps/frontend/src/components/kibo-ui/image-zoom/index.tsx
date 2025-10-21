"use client";

import Zoom, {
  type ControlledProps,
  type UncontrolledProps,
} from "react-medium-image-zoom";
import { cn } from "@/lib/utils";

export type ImageZoomProps = UncontrolledProps & {
  isZoomed?: ControlledProps["isZoomed"];
  onZoomChange?: ControlledProps["onZoomChange"];
  className?: string;
  backdropClassName?: string;
};

export const ImageZoom = ({
  className,
  backdropClassName,
  ...props
}: ImageZoomProps) => (
  <div
    className={cn(
      "relative",
      "[&_[data-rmiz-ghost]]:pointer-events-none [&_[data-rmiz-ghost]]:absolute",
      "[&_[data-rmiz-btn-zoom]]:hidden",
      "[&_[data-rmiz-btn-unzoom]]:hidden",
      '[&_[data-rmiz-content="found"]_img]:cursor-zoom-in',
      '[&_[data-rmiz-content="found"]_svg]:cursor-zoom-in',
      '[&_[data-rmiz-content="found"]_[role="img"]]:cursor-zoom-in',
      '[&_[data-rmiz-content="found"]_[data-zoom]]:cursor-zoom-in',
      className
    )}
  >
    <Zoom
      classDialog={cn(
        "[&::backdrop]:hidden",
        "[&[open]]:fixed [&[open]]:m-0 [&[open]]:h-dvh [&[open]]:max-h-none [&[open]]:w-dvw [&[open]]:max-w-none [&[open]]:overflow-hidden [&[open]]:border-0 [&[open]]:bg-transparent [&[open]]:p-0",
        "[&_[data-rmiz-modal-overlay]]:absolute [&_[data-rmiz-modal-overlay]]:inset-0 [&_[data-rmiz-modal-overlay]]:transition-all [&_[data-rmiz-modal-overlay]]:ease-in-out [&_[data-rmiz-modal-overlay]]:duration-300",
        '[&_[data-rmiz-modal-overlay="hidden"]]:bg-transparent',
        '[&_[data-rmiz-modal-overlay="visible"]]:backdrop-blur-md [&_[data-rmiz-modal-overlay="visible"]]:bg-white/40',
        'dark:[&_[data-rmiz-modal-overlay="visible"]]:!bg-black/70',
        "[&_[data-rmiz-modal-content]]:relative [&_[data-rmiz-modal-content]]:size-full",
        "[&_[data-rmiz-modal-img]]:absolute [&_[data-rmiz-modal-img]]:origin-top-left [&_[data-rmiz-modal-img]]:cursor-zoom-out [&_[data-rmiz-modal-img]]:transition-transform [&_[data-rmiz-modal-img]]:ease-in-out [&_[data-rmiz-modal-img]]:duration-300 [&_[data-rmiz-modal-img]]:rounded-2xl",
        "motion-reduce:[&_[data-rmiz-modal-img]]:transition-none motion-reduce:[&_[data-rmiz-modal-overlay]]:transition-none",
        backdropClassName
      )}
      {...props}
    />
  </div>
);
