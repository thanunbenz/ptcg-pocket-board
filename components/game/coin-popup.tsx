"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

const FLIP_MS = 1400;
const CLOSE_MS = 3600;

export function CoinPopup({ onClose }: { onClose: () => void }) {
  const reduceMotion = useReducedMotion();
  const [heads] = useState(() => Math.random() < 0.5);
  const [shown, setShown] = useState(!!reduceMotion);
  const closeRef = useRef(onClose);

  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const showTimer = window.setTimeout(
      () => setShown(true),
      reduceMotion ? 150 : FLIP_MS,
    );
    const closeTimer = window.setTimeout(() => closeRef.current(), CLOSE_MS);
    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(closeTimer);
    };
  }, [reduceMotion]);

  return (
    <motion.div
      data-coin-popup
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-[min(2vw,3dvh)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={() => closeRef.current()}
    >
      <div className="relative flex size-[min(9vw,16dvh)] items-center justify-center [perspective:1400px]">
        <motion.div
          className="relative size-full [transform-style:preserve-3d]"
          initial={{ rotateX: 0, y: 0, scale: 1 }}
          animate={
            reduceMotion
              ? { rotateX: heads ? 0 : 180 }
              : {
                  y: [0, -160, 0],
                  scale: [1, 1.35, 1],
                  rotateX: heads ? 1440 : 1620,
                }
          }
          transition={
            reduceMotion
              ? { duration: 0 }
              : {
                  duration: 1.4,
                  y: {
                    duration: 1.4,
                    times: [0, 0.5, 1],
                    ease: ["easeOut", "easeIn"],
                  },
                  scale: {
                    duration: 1.4,
                    times: [0, 0.5, 1],
                    ease: ["easeOut", "easeIn"],
                  },
                  rotateX: { duration: 1.4, ease: [0.2, 0.75, 0.35, 1] },
                }
          }
        >
          <Image
            src="/coin/front.png"
            alt="Heads"
            width={512}
            height={512}
            className="absolute inset-0 size-full [backface-visibility:hidden]"
          />
          <Image
            src="/coin/back.png"
            alt="Tails"
            width={512}
            height={512}
            className="absolute inset-0 size-full [transform:rotateX(180deg)] [backface-visibility:hidden]"
          />
        </motion.div>
      </div>

      {shown ? (
        <motion.span
          className="rounded-full border border-white/70 bg-black/60 px-5 py-2 text-sm font-medium text-white"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          Coins: {heads ? "Head" : "Tail"}
        </motion.span>
      ) : null}
    </motion.div>
  );
}
