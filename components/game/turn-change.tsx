"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

const BAND = {
  p1: "bg-[linear-gradient(90deg,#123058,#0A1627)]",
  p2: "bg-[linear-gradient(90deg,#150808,#361111)]",
};

export function TurnChange({
  side,
  onSwitch,
  onClose,
}: {
  side: "p1" | "p2";
  onSwitch: () => void;
  onClose: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const [leaving, setLeaving] = useState(false);
  const switchRef = useRef(onSwitch);
  const closeRef = useRef(onClose);

  useEffect(() => {
    switchRef.current = onSwitch;
  }, [onSwitch]);

  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const switchTimer = window.setTimeout(
      () => switchRef.current(),
      reduceMotion ? 150 : 700,
    );
    const leaveTimer = window.setTimeout(
      () => setLeaving(true),
      reduceMotion ? 950 : 1800,
    );
    const closeTimer = window.setTimeout(
      () => closeRef.current(),
      reduceMotion ? 1250 : 2300,
    );
    return () => {
      window.clearTimeout(switchTimer);
      window.clearTimeout(leaveTimer);
      window.clearTimeout(closeTimer);
    };
  }, [reduceMotion]);

  return (
    <motion.div
      data-turn-change={side}
      className="fixed inset-0 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: leaving ? 0 : 1 }}
      transition={{ duration: reduceMotion ? 0.15 : 0.2, delay: leaving ? 0.2 : 0 }}
    >
      <div className="absolute inset-0 bg-black/72 backdrop-blur-[2px]" />
      <div className="absolute top-[45%] left-1/2 h-[24.7dvh] w-[150vw] -translate-x-1/2 -translate-y-1/2 rotate-[-8deg]">
        <motion.div
          className={cn(
            "flex h-full w-full items-center justify-center border-2 border-white",
            BAND[side],
          )}
          initial={{ x: reduceMotion ? 0 : "-130vw" }}
          animate={{ x: leaving && !reduceMotion ? "130vw" : 0 }}
          transition={
            reduceMotion
              ? { duration: 0.15 }
              : leaving
                ? { duration: 0.45, ease: "easeIn" }
                : { type: "spring", stiffness: 150, damping: 24 }
          }
        >
          <span className="font-sans text-[8.5dvh] leading-none font-black tracking-[0.01em] text-white">
            PLAYER {side === "p1" ? 1 : 2} Turn
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}
