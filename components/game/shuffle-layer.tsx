"use client";

import Image from "next/image";
import { motion, type Easing } from "motion/react";

const CARD_COUNT = 8;
const THICK = 1.5;
const ROUND_MS = 600;

const TIMES = [0, 0.333, 0.336, 0.583, 0.833, 0.836, 1];
const EASE: Easing[] = [
  "easeIn",
  "easeInOut",
  "easeInOut",
  "easeOut",
  "easeOut",
  "easeInOut",
];

export function ShuffleLayer({
  x,
  y,
  width,
  height,
  dir,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  dir: "up" | "down";
}) {
  const direction = dir === "up" ? -1 : 1;

  return (
    <div
      className="pointer-events-none fixed z-50"
      style={{ left: x, top: y, width, height }}
    >
      {Array.from({ length: CARD_COUNT }, (_, index) => {
        const baseY = index * THICK;
        const pull = direction * height * 1.05;
        const delay = (index < 4 ? 0 : ROUND_MS) / 1000;

        return (
          <motion.div
            key={index}
            className="absolute inset-0"
            initial={{ y: baseY, zIndex: index }}
            animate={{
              y: [
                baseY,
                baseY + pull,
                baseY + pull,
                baseY + pull * 0.5,
                baseY,
                baseY,
                baseY,
              ],
              zIndex: [index, index, 200, 200, 200, index, index],
            }}
            transition={{
              duration: ROUND_MS / 1000,
              delay,
              times: TIMES,
              ease: EASE,
            }}
          >
            <Image
              src="/pick-deck/card-back.png"
              alt=""
              width={745}
              height={1040}
              className="absolute inset-0 h-full w-full rounded-md object-cover"
            />
          </motion.div>
        );
      })}
    </div>
  );
}
