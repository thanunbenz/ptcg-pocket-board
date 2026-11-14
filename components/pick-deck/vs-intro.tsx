"use client";

import { useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

type IntroPlayer = {
  name: string;
  avatar?: string;
  tag?: "AI";
};

type VsIntroProps = {
  open?: boolean;
  onClose: () => void;
  p1: IntroPlayer;
  p2: IntroPlayer;
};

const INTRO_MS = 3800;

const SPARKS: { x: number; y: number; delay: number }[] = [
  { x: 9, y: 24, delay: 0.1 },
  { x: 22, y: 13, delay: 0.5 },
  { x: 34, y: 30, delay: 0.9 },
  { x: 45, y: 17, delay: 0.25 },
  { x: 58, y: 26, delay: 0.7 },
  { x: 71, y: 14, delay: 1.15 },
  { x: 84, y: 27, delay: 0.35 },
  { x: 93, y: 41, delay: 0.85 },
  { x: 13, y: 58, delay: 1.3 },
  { x: 26, y: 70, delay: 0.55 },
  { x: 40, y: 63, delay: 1.0 },
  { x: 55, y: 76, delay: 0.15 },
  { x: 68, y: 61, delay: 1.4 },
  { x: 80, y: 73, delay: 0.65 },
  { x: 90, y: 63, delay: 1.2 },
  { x: 50, y: 89, delay: 0.95 },
];

function SideAvatar({ tone }: { tone: "opponent" | "self" }) {
  return (
    <div
      className={cn(
        "rounded-full bg-white ring-[min(0.5vw,0.9dvh)]",
        "size-[min(9vw,15dvh)]",
        tone === "opponent" ? "ring-opponent" : "ring-self",
        tone === "opponent"
          ? "shadow-[0_0_min(4vw,7dvh)_rgba(255,90,90,0.25)]"
          : "shadow-[0_0_min(4vw,7dvh)_rgba(90,169,255,0.25)]",
      )}
    />
  );
}

function PlayerBlock({
  player,
  tone,
  delay,
  reduceMotion,
  avatarFirst,
}: {
  player: IntroPlayer;
  tone: "opponent" | "self";
  delay: number;
  reduceMotion: boolean | null;
  avatarFirst: boolean;
}) {
  const avatar = <SideAvatar tone={tone} />;
  const name = (
    <div className="text-center">
      <p className="text-[min(3.6vw,6dvh)] leading-none font-black tracking-wide text-white uppercase">
        {player.name}
      </p>
      {player.tag ? (
        <span
          className={cn(
            "mt-[min(0.8vw,1.4dvh)] inline-block rounded-full border px-[min(0.9vw,1.6dvh)] py-[min(0.2vw,0.4dvh)] text-[min(0.9vw,1.5dvh)] font-bold tracking-[0.2em] uppercase",
            tone === "opponent"
              ? "border-opponent/60 text-opponent"
              : "border-self/60 text-self",
          )}
        >
          {player.tag}
        </span>
      ) : null}
    </div>
  );

  return (
    <motion.div
      className="flex flex-col items-center gap-[min(1.6vw,2.6dvh)]"
      initial={{ opacity: 0, y: reduceMotion ? 0 : 26 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      {avatarFirst ? avatar : null}
      {name}
      {avatarFirst ? null : avatar}
    </motion.div>
  );
}

export function VsIntro({
  open = true,
  onClose,
  p1,
  p2,
}: VsIntroProps) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(onClose, INTRO_MS);
    return () => clearTimeout(timer);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <motion.div
      data-vs-intro
      className="fixed inset-0 z-[60] overflow-hidden bg-black/70"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="absolute inset-0"
        animate={
          reduceMotion
            ? undefined
            : {
              x: [0, -18, 14, -10, 7, -4, 0],
              rotate: [0, -0.9, 0.7, -0.4, 0.2, 0],
            }
        }
        transition={{ duration: 0.55, delay: 0.1, ease: "easeOut" }}
      >
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 h-[160vmax] w-[160vmax] -translate-x-1/2 -translate-y-1/2 rotate-[-10deg]">
            <motion.div
              className="absolute inset-x-0 top-0 h-[49%] bg-[linear-gradient(90deg,#140808,#3A1111)]"
              initial={{ opacity: 0, y: reduceMotion ? 0 : "-120%" }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: reduceMotion ? 0 : 0.6,
                delay: 0.05,
                ease: [0.16, 1, 0.3, 1],
              }}
            />
            <motion.div
              className="absolute inset-x-0 top-[51%] h-[49%] bg-[linear-gradient(90deg,#113059,#081220)]"
              initial={{ opacity: 0, y: reduceMotion ? 0 : "120%" }}
              animate={{ opacity: 1, y: 0 }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : {
                    type: "spring",
                    stiffness: 110,
                    damping: 17,
                    mass: 0.9,
                    delay: 0.1,
                  }
              }
            />
            <motion.div
              className="absolute inset-x-0 top-[49%] h-[2%] bg-white shadow-[0_0_min(1vw,2dvh)_rgba(255,255,255,0.45)]"
              initial={{ opacity: 0, scaleX: reduceMotion ? 1 : 0.4 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{
                delay: reduceMotion ? 0 : 0.8,
                duration: reduceMotion ? 0 : 0.2,
                ease: "easeOut",
              }}
            />

            <div className="absolute inset-0 flex rotate-[10deg] flex-col items-center justify-center gap-[min(2vw,3.4dvh)]">
              <PlayerBlock
                player={p2}
                tone="opponent"
                delay={1}
                reduceMotion={reduceMotion}
                avatarFirst
              />
              <motion.div
                className="rounded-full border border-white/25 bg-black/60 px-[min(1.8vw,3dvh)] py-[min(0.5vw,0.9dvh)] shadow-[0_0_min(2vw,3.5dvh)_rgba(0,0,0,0.65)] backdrop-blur-sm"
                initial={{ opacity: 0, y: reduceMotion ? 0 : 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.15, duration: 0.4 }}
              >
                <p className="text-[min(4.4vw,7dvh)] leading-none font-black text-white [text-shadow:0_0_min(1.4vw,2.4dvh)_rgba(0,0,0,0.85)]">
                  VS
                </p>
              </motion.div>
              <PlayerBlock
                player={p1}
                tone="self"
                delay={1.3}
                reduceMotion={reduceMotion}
                avatarFirst={false}
              />
            </div>
          </div>
        </div>

        {reduceMotion
          ? null
          : SPARKS.map((spark) => (
            <motion.span
              key={`${spark.x}-${spark.y}`}
              className="absolute size-[min(0.45vw,0.8dvh)] rounded-full bg-white shadow-[0_0_min(1vw,1.6dvh)_rgba(255,255,255,0.8)]"
              style={{ left: `${spark.x}%`, top: `${spark.y}%` }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                delay: spark.delay,
                ease: "easeInOut",
              }}
            />
          ))}
      </motion.div>

      {reduceMotion ? null : (
        <motion.div
          className="pointer-events-none absolute inset-0 bg-white"
          initial={{ opacity: 0.9 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        />
      )}
    </motion.div>
  );
}
