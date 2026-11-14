"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

type CoinState = { heads: boolean; boardH: number; shown: boolean };

const FLIP_MS = 1500;
const REMOVE_MS = 3400;

export function CoinToss({
  boardRef,
  onResult,
}: {
  boardRef?: React.RefObject<HTMLElement | null>;
  onResult?: (heads: boolean) => void;
}) {
  const reduceMotion = useReducedMotion();
  const [coin, setCoin] = useState<CoinState | null>(null);
  const [result, setResult] = useState<boolean | null>(null);
  const onResultRef = useRef(onResult);

  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);

  useEffect(() => {
    const heads = Math.random() < 0.5;
    const boardH = boardRef?.current?.clientHeight ?? window.innerHeight;
    setCoin({ heads, boardH, shown: false });
    const showTimer = setTimeout(
      () => setCoin((current) => (current ? { ...current, shown: true } : current)),
      reduceMotion ? 250 : FLIP_MS,
    );
    const clearTimer = setTimeout(
      () => {
        setCoin(null);
        setResult(heads);
        onResultRef.current?.(heads);
      },
      reduceMotion ? 2400 : REMOVE_MS,
    );
    return () => {
      clearTimeout(showTimer);
      clearTimeout(clearTimer);
    };
  }, [boardRef, reduceMotion]);

  const shownHeads = coin?.shown ? coin.heads : result;

  return (
    <motion.div
      data-coin-toss
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-[min(3vw,5dvh)] bg-black/55 backdrop-blur-[3px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="relative flex size-[min(10vw,18dvh)] items-center justify-center [perspective:1400px]">
        <AnimatePresence>
          {coin ? (
            <motion.div
              key={`coin-${coin.heads}-${coin.boardH}`}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                className="relative size-full [transform-style:preserve-3d]"
                initial={{ rotateX: 0, y: 0, scale: 1 }}
                animate={
                  reduceMotion
                    ? { rotateX: coin.heads ? 0 : 180 }
                    : {
                        y: [0, -coin.boardH * 0.3, 0],
                        scale: [1, 1.6, 1],
                        rotateX: coin.heads ? 1440 : 1620,
                      }
                }
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : {
                        duration: 1.5,
                        y: { duration: 1.5, times: [0, 0.5, 1], ease: ["easeOut", "easeIn"] },
                        scale: {
                          duration: 1.5,
                          times: [0, 0.5, 1],
                          ease: ["easeOut", "easeIn"],
                        },
                        rotateX: { duration: 1.5, ease: [0.2, 0.75, 0.35, 1] },
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
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {shownHeads !== null ? (
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-[min(1.1vw,2dvh)] tracking-[0.18em] text-white/80 uppercase">
            Going First
          </p>
          <p
            className={cn(
              "mt-[min(0.6vw,1dvh)] text-[min(3.2vw,6dvh)] leading-none font-black",
              shownHeads ? "text-self" : "text-opponent",
            )}
          >
            {shownHeads ? "Player 1" : "Player 2"}
          </p>
        </motion.div>
      ) : null}
    </motion.div>
  );
}
