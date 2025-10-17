"use client";

import { motion } from "motion/react";
import React from "react";
import AnimatedButton from "./ui/animated-button";
import Link from "next/link";

export function ReachMeSection() {
  return (
    <section className="flex flex-col items-start justify-center py-10 w-full max-w-2xl">
      <motion.h2
        className="text-lg font-newsreader italic text-secondary-foreground my-4"
        initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        Reach Me.
      </motion.h2>
      <motion.div
        className="flex flex-wrap gap-2 w-full"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        transition={{ staggerChildren: 0.1 }}
      >
        <motion.div
          className="text-secondary-foreground my-2"
          variants={{
            hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
            visible: { opacity: 1, y: 0, filter: "blur(0px)" },
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <AnimatedButton>
            <Link href="mailto:simrubin13@gmail.com">Email</Link>
          </AnimatedButton>
        </motion.div>
        <motion.div
          className="text-secondary-foreground my-2"
          variants={{
            hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
            visible: { opacity: 1, y: 0, filter: "blur(0px)" },
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <AnimatedButton>
            <Link
              href="https://www.linkedin.com/in/simeonrubin/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Linkedin
            </Link>
          </AnimatedButton>
        </motion.div>
        <motion.div
          className="text-secondary-foreground my-2"
          variants={{
            hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
            visible: { opacity: 1, y: 0, filter: "blur(0px)" },
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <AnimatedButton>
            <Link
              href="https://www.instagram.com/simrubindesigner/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </Link>
          </AnimatedButton>
        </motion.div>
        <motion.div
          className="text-secondary-foreground my-2"
          variants={{
            hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
            visible: { opacity: 1, y: 0, filter: "blur(0px)" },
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <AnimatedButton>
            <Link
              href="https://github.com/simirubin"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </Link>
          </AnimatedButton>
        </motion.div>
      </motion.div>
    </section>
  );
}
