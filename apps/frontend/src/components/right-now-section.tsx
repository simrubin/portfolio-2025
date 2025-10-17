"use client";

import { motion } from "motion/react";

export function RightNowSection() {
  return (
    <section className="flex flex-col items-start justify-center py-10 w-full max-w-2xl">
      <motion.h2
        className="text-lg font-newsreader italic text-secondary-foreground my-4"
        initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 2.1 }}
      >
        Right Now.
      </motion.h2>

      <motion.p
        className="text-secondary-foreground leading-[1.75]"
        initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 2.2 }}
      >
        I'm currently in between roles, taking time to explore new technologies
        and refine my skills across design and development. This period has
        given me space to learn, experiment, and focus on building projects that
        challenge my creativity and technical thinking.
      </motion.p>
    </section>
  );
}
