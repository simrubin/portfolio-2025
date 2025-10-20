"use client";

import { motion } from "motion/react";
import Link from "next/link";
import AnimatedBackButton from "@/components/ui/animated-back-button";

export function AnimatedBackButtonSection() {
  return (
    <motion.div
      className="sticky top-24"
      initial={{ opacity: 0, x: -20, filter: "blur(10px)" }}
      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <AnimatedBackButton>
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-newsreader italic text-secondary-foreground text-lg hover:text-foreground transition-colors"
        >
          Home
        </Link>
      </AnimatedBackButton>
    </motion.div>
  );
}

export function AnimatedBackButtonSectionMobile() {
  return (
    <motion.div
      className="lg:hidden mb-10"
      initial={{ opacity: 0, x: -20, filter: "blur(10px)" }}
      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <AnimatedBackButton>
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-newsreader italic text-secondary-foreground hover:text-foreground transition-colors"
        >
          Home
        </Link>
      </AnimatedBackButton>
    </motion.div>
  );
}
