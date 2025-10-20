"use client";

import React, { createContext, useContext, useState } from "react";

interface AnimationContextType {
  hasPlayedInitialAnimation: boolean;
  markAnimationAsPlayed: () => void;
}

const AnimationContext = createContext<AnimationContextType>({
  hasPlayedInitialAnimation: false,
  markAnimationAsPlayed: () => {},
});

export function useAnimation() {
  return useContext(AnimationContext);
}

export function AnimationProvider({ children }: { children: React.ReactNode }) {
  const [hasPlayedInitialAnimation, setHasPlayedInitialAnimation] =
    useState(false);

  const markAnimationAsPlayed = () => {
    setHasPlayedInitialAnimation(true);
  };

  return (
    <AnimationContext.Provider
      value={{ hasPlayedInitialAnimation, markAnimationAsPlayed }}
    >
      {children}
    </AnimationContext.Provider>
  );
}
