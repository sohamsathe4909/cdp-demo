"use client";

import React, { useEffect, useRef } from "react";
import { motion, useAnimation, useInView, useReducedMotion, useScroll, useTransform } from "motion/react";

type RevealProps = {
  children: React.ReactNode;
  /** Entrance delay in seconds */
  delay?: number;
  /** How far the element travels on entrance */
  y?: number;
  className?: string;
  /** once: the reveal only ever plays one way */
  viewMargin?: NonNullable<Parameters<typeof useInView>[1]>["margin"];
  /** Replays every time it scrolls back into view, and on hover */
  replay?: boolean;
};

/**
 * Scroll-in reveal used across the landing page — the same
 * fade + rise easing Dezerv uses on its section blocks.
 */
export function Reveal({
  children,
  delay = 0,
  y = 26,
  className,
  viewMargin = "-8% 0px -8% 0px",
  replay = false,
}: RevealProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const inView = useInView(ref, { margin: viewMargin });
  const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];
  const enter = { opacity: 1, y: 0, transition: { duration: 0.75, delay, ease } };
  const leave = { opacity: 0, y, transition: { duration: 0.3 } };

  /* Replay mode: leaving the viewport resets the block, so scrolling
     back through it plays the entrance all over again. */
  useEffect(() => {
    if (!replay) return;
    if (inView) {
      controls.start(enter);
    } else {
      controls.start(leave);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  if (reduced) return <div className={className}>{children}</div>;

  if (!replay) {
    return (
      <motion.div
        className={className}
        initial={{ opacity: 0, y }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: viewMargin }}
        transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={controls}
      onHoverStart={() => {
        /* Restart in place — no remount, so a pointer resting on the
           card can't retrigger itself into a loop. */
        controls.set({ opacity: 0, y });
        controls.start(enter);
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Hero entrance — plays once on mount instead of on scroll.
 */
export function FadeUp({
  children,
  delay = 0,
  y = 22,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Signature Dezerv effect: a paragraph whose words light up from
 * dim to bright as the block scrolls through the viewport.
 */
export function HighlightStatement({
  text,
  className,
  dim = 0.2,
}: {
  text: string;
  className?: string;
  dim?: number;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "end 0.55"],
  });
  const words = text.split(" ");

  if (reduced) {
    return (
      <p ref={ref} className={className}>
        {text}
      </p>
    );
  }

  return (
    <p ref={ref} className={className}>
      {words.map((word, index) => (
        <StatementWord
          key={`${word}-${index}`}
          word={word}
          progress={scrollYProgress}
          range={[index / words.length, (index + 1) / words.length]}
          dim={dim}
        />
      ))}
    </p>
  );
}

function StatementWord({
  word,
  progress,
  range,
  dim,
}: {
  word: string;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  range: [number, number];
  dim: number;
}) {
  const opacity = useTransform(progress, range, [dim, 1]);
  return (
    <motion.span style={{ opacity }} className="mr-[0.26em] inline-block">
      {word}
    </motion.span>
  );
}

/**
 * Continuous horizontal rail (learner videos, career cards).
 * The children are rendered twice so the loop is seamless.
 */
export function Marquee({
  children,
  duration = 58,
  className,
}: {
  children: React.ReactNode;
  duration?: number;
  className?: string;
}) {
  return (
    <div className={`cdp-marquee group/marquee relative overflow-hidden ${className ?? ""}`}>
      <div
        className="cdp-marquee__track"
        style={{ animationDuration: `${duration}s` }}
      >
        <div className="flex shrink-0 gap-5 pr-5">{children}</div>
        <div className="flex shrink-0 gap-5 pr-5" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
