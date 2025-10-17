"use client";

import { TypingAnimation } from "@/components/ui/typing-animation";
import { motion } from "motion/react";

export function HeroSection() {
  return (
    <section className="flex flex-col items-start justify-center py-10 w-full max-w-2xl">
      <TypingAnimation
        className="text-2xl font-newsreader italic text-foreground"
        delay={150}
      >
        Simeon Rubin
      </TypingAnimation>
      <div className="flex flex-wrap gap-x-2 ">
        <motion.span
          className="text-2xl font-newsreader text-secondary-foreground"
          initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 1.4 }}
        >
          Developer.
        </motion.span>
        <motion.span
          className="text-2xl font-newsreader text-secondary-foreground"
          initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 1.5 }}
        >
          Design Engineer.
        </motion.span>
        <motion.span
          className="text-2xl font-newsreader text-secondary-foreground"
          initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 1.6 }}
        >
          Industrial Designer.
        </motion.span>
      </div>
      <motion.p
        className="text-secondary-foreground leading-[1.75] mt-4"
        initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 1.8 }}
      >
        I build experiences and products across hardware and software, guided by
        the belief that tech should be built with craft, compassion and just the
        right amount of fun.{" "}
      </motion.p>
    </section>
  );
}
