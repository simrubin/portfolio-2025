"use client";

import { TypingAnimation } from "@/components/ui/typing-animation";
import { motion } from "motion/react";
import { useAnimation } from "@/providers/animation-provider";
import { useEffect } from "react";

export function HeroSection() {
  const { hasPlayedInitialAnimation, markAnimationAsPlayed } = useAnimation();

  useEffect(() => {
    if (!hasPlayedInitialAnimation) {
      // Mark animations as played after the longest animation completes (2s delay + 0.5s duration)
      const timer = setTimeout(() => {
        markAnimationAsPlayed();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [hasPlayedInitialAnimation, markAnimationAsPlayed]);

  const staticState = { opacity: 1, y: 0, filter: "blur(0px)" };
  const animatedInitial = { opacity: 0, y: 40, filter: "blur(10px)" };

  return (
    <section className="flex flex-col items-start justify-center py-10 w-full max-w-2xl">
      <TypingAnimation
        className="text-2xl font-newsreader italic text-foreground"
        delay={hasPlayedInitialAnimation ? 0 : 150}
        skipAnimation={hasPlayedInitialAnimation}
      >
        Simeon Rubin.
      </TypingAnimation>
      <div className="flex flex-wrap gap-x-2 ">
        <motion.span
          className="text-2xl font-newsreader text-secondary-foreground"
          initial={hasPlayedInitialAnimation ? staticState : animatedInitial}
          animate={staticState}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: hasPlayedInitialAnimation ? 0 : 0.5,
            ease: "easeOut",
            delay: hasPlayedInitialAnimation ? 0 : 1.4,
          }}
        >
          Software Developer.
        </motion.span>
        <motion.span
          className="text-2xl font-newsreader text-secondary-foreground"
          initial={hasPlayedInitialAnimation ? staticState : animatedInitial}
          animate={staticState}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: hasPlayedInitialAnimation ? 0 : 0.5,
            ease: "easeOut",
            delay: hasPlayedInitialAnimation ? 0 : 1.5,
          }}
        >
          Design Engineer.
        </motion.span>
        <motion.span
          className="text-2xl font-newsreader text-secondary-foreground"
          initial={hasPlayedInitialAnimation ? staticState : animatedInitial}
          animate={staticState}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: hasPlayedInitialAnimation ? 0 : 0.5,
            ease: "easeOut",
            delay: hasPlayedInitialAnimation ? 0 : 1.6,
          }}
        >
          Industrial Designer.
        </motion.span>
      </div>
      <motion.p
        className="text-secondary-foreground leading-[1.75] mt-4"
        initial={hasPlayedInitialAnimation ? staticState : animatedInitial}
        animate={staticState}
        viewport={{ once: true, amount: 0.3 }}
        transition={{
          duration: hasPlayedInitialAnimation ? 0 : 0.5,
          ease: "easeOut",
          delay: hasPlayedInitialAnimation ? 0 : 1.8,
        }}
      >
        I design and build experiences across hardware and software, guided by
        the belief that tech should be built with craft, empathy and just the
        right amount of fun.{" "}
      </motion.p>
    </section>
  );
}
