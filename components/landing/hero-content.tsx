"use client";

import { motion, useReducedMotion } from "framer-motion";

export function MotionWrapper({
  children,
  delay = 0,
  x = 0,
  y = 0,
  float = false,
}: any) {
  const shouldReduceMotion = useReducedMotion();

  // Disable animations if user prefers reduced motion
  const animateProps = shouldReduceMotion
    ? { opacity: 1, x: 0, y: 0 }
    : { opacity: 1, x: 0, y: float ? [0, -20, 0] : 0 };

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x, y }}
      animate={animateProps}
      transition={{
        duration: float ? 4 : 0.8,
        delay: delay,
        ease: "easeOut",
        y: float
          ? { duration: 4, repeat: Infinity, ease: "easeInOut" }
          : undefined,
      }}
    >
      {children}
    </motion.div>
  );
}
