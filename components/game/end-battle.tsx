"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

import { CARD_FRONTS } from "@/components/game/card";

function ResultDeck({ side }: { side: "p1" | "p2" }) {
  return (
    <motion.div
      className="flex flex-col items-center gap-[min(2vw,3dvh)]"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.15 }}
    >
      <Image
        src={CARD_FRONTS[2]}
        alt=""
        width={400}
        height={560}
        className="h-[min(32dvh,20vw)] w-auto rounded-lg"
      />
      <span className="text-[min(2.2vw,3.6dvh)] text-white/70">
        Player {side === "p1" ? 1 : 2}
      </span>
    </motion.div>
  );
}

export function EndBattle({
  p1,
  p2,
  turns,
  onPlayAgain,
  onCancel,
}: {
  p1: number;
  p2: number;
  turns: number;
  onPlayAgain: () => void;
  onCancel: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const result = p1 > p2 ? "VICTORY" : p1 < p2 ? "DEFEAT" : "DRAW";
  const lineTone =
    result === "VICTORY"
      ? "bg-[#45E575]"
      : result === "DEFEAT"
        ? "bg-[#FF5A5A]"
        : "bg-muted";

  return (
    <motion.div
      className="fixed inset-0 z-50 overflow-y-auto bg-[#0D0D16]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mx-auto flex min-h-full w-full max-w-[80rem] flex-col items-center justify-center px-6 pt-8 pb-12">
        <motion.h1
          className="text-center text-[min(7vw,9dvh)] leading-none font-light tracking-[0.06em] text-white"
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {result}
        </motion.h1>
        <motion.span
          className={`mt-3 block h-[0.35rem] w-[min(18rem,42vw)] ${lineTone}`}
          initial={reduceMotion ? false : { scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.35, delay: 0.1 }}
        />

        <div className="mt-10 flex w-full items-center justify-center gap-[min(6vw,8dvh)]">
          <ResultDeck side="p1" />
          <div className="flex flex-col items-center">
            <span className="text-[min(6vw,9dvh)] leading-none font-light text-white">
              {p1} - {p2}
            </span>
            <span className="mt-3 text-[min(1.6vw,2.6dvh)] text-white/40">
              {turns} turn
            </span>
          </div>
          <ResultDeck side="p2" />
        </div>

        <div className="mt-12 flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={onPlayAgain}
            className="rounded-full bg-white px-12 py-2.5 text-[min(2vw,2.8dvh)] font-semibold text-black transition-transform active:scale-95"
          >
            Play again
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="text-[min(1.8vw,2.4dvh)] text-white/40 transition-colors hover:text-white/70"
          >
            cancel
          </button>
        </div>
      </div>
    </motion.div>
  );
}
