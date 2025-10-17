"use client";

import { motion, useInView } from "motion/react";
import { useRef, useEffect, useState } from "react";

export function RightNowSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [shouldUseDelay, setShouldUseDelay] = useState(true);
  const mountTimeRef = useRef(Date.now());

  useEffect(() => {
    // If element comes into view more than 300ms after mount, it was scrolled to
    if (isInView) {
      const timeSinceMount = Date.now() - mountTimeRef.current;
      if (timeSinceMount > 300) {
        setShouldUseDelay(false);
      }
    }
  }, [isInView]);

  // Use delay only if element was initially in view, otherwise animate instantly
  const headingDelay = shouldUseDelay ? 2.1 : 0;
  const paragraphDelay = shouldUseDelay ? 2.2 : 0;

  return (
    <section
      ref={ref}
      className="flex flex-col items-start justify-center py-10 w-full max-w-2xl"
    >
      <motion.h2
        className="text-lg font-newsreader italic text-secondary-foreground my-4"
        initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: headingDelay }}
      >
        Right Now.
      </motion.h2>

      <motion.p
        className="text-secondary-foreground leading-[1.75]"
        initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: paragraphDelay }}
      >
        I'm currently in between roles, taking time to explore new technologies
        and refine my skills across design and development. This period has
        given me space to learn, experiment, and focus on building projects that
        challenge my creativity and technical thinking.
      </motion.p>
    </section>
  );
}
