"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

export function PointGain({
  side,
  points,
  onClose,
}: {
  side: "p1" | "p2";
  points: number;
  onClose: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const [leaving, setLeaving] = useState(false);
  const closeRef = useRef(onClose);

  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const leaveTimer = window.setTimeout(
      () => setLeaving(true),
      reduceMotion ? 500 : 1600,
    );
    const closeTimer = window.setTimeout(
      () => closeRef.current(),
      reduceMotion ? 750 : 1900,
    );
    return () => {
      window.clearTimeout(leaveTimer);
      window.clearTimeout(closeTimer);
    };
  }, [reduceMotion]);

  return (
    <motion.div
      className="fixed inset-0 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: leaving ? 0 : 1 }}
      transition={{ duration: leaving ? 0.25 : 0.15 }}
      onClick={() => closeRef.current()}
    >
      <div className="absolute inset-x-0 top-[38.5%] h-[20.6dvh] overflow-hidden">
        <motion.div
          className={cn(
            "relative flex h-full w-full items-center bg-self",
            side === "p2" && "bg-opponent",
          )}
          initial={reduceMotion ? false : { x: "-100%" }}
          animate={{ x: 0 }}
          transition={{ duration: 0.32, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <span className="ml-[6.5%] text-[9dvh] leading-none font-light tracking-[0.02em] text-white">
            PLAYER {side === "p1" ? 1 : 2}
          </span>
          <div className="absolute left-[56.8%] flex -translate-x-1/2 items-center gap-[3.2dvh]">
            {[0, 1, 2].map((ring) => (
              <motion.span
                key={ring}
                initial={reduceMotion ? false : { opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: 0.15 + ring * 0.07 }}
                className={cn(
                  "size-[12.5dvh] rounded-full bg-[#D9D9D9]",
                  ring < points && "bg-white",
                )}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
