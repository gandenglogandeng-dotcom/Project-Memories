"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";

interface StatsCounterProps {
  value: number;
  label: string;
}

function Counter({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { duration: 1400, bounce: 0 });

  useEffect(() => {
    if (inView) motionValue.set(value);
  }, [inView, value, motionValue]);

  useEffect(() => {
    return spring.on("change", (latest) => {
      if (ref.current) ref.current.textContent = Math.round(latest).toLocaleString("id-ID");
    });
  }, [spring]);

  return <span ref={ref}>0</span>;
}

export default function StatsCounter({ value, label }: StatsCounterProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-start"
    >
      <p className="font-display text-4xl font-semibold text-pine md:text-5xl">
        <Counter value={value} />
        <span className="text-clay">+</span>
      </p>
      <p className="mt-1 text-sm text-ink-soft">{label}</p>
    </motion.div>
  );
}
