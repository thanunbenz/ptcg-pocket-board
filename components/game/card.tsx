"use client";

import Image from "next/image";
import { motion } from "motion/react";

export type CardSide = "p1" | "p2";

export const CARD_FRONTS = [
  "/cards/mega-dragonite.webp",
  "/cards/abandoned-station.webp",
  "/cards/giratina.webp",
  "/cards/dragonair.png",
];

export function Card({
  index,
  total,
  side,
  offset,
  frontSrc,
}: {
  index: number;
  total: number;
  side: CardSide;
  offset: { x: number; y: number };
  frontSrc: string;
}) {
  const ours = side === "p1";
  const direction = ours ? 1 : -1;
  const k = index - (total - 1) / 2;

  return (
    <motion.div
      className="relative aspect-[5/7] w-[min(4.5vw,8dvh)] shrink-0 [transform-style:preserve-3d]"
      initial={{ x: offset.x, y: offset.y, rotate: 0, rotateY: 0, zIndex: 20 }}
      animate={{
        x: 0,
        y: Math.abs(k) * 4 * direction,
        rotate: direction * k * 7,
        rotateY: ours ? 180 : 0,
        transitionEnd: { zIndex: 0 },
      }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{
        transformPerspective: 900,
        originX: 0.5,
        originY: ours ? 1.6 : -0.6,
      }}
    >
      <Image
        src="/pick-deck/card-back.png"
        alt=""
        width={745}
        height={1040}
        className="absolute inset-0 h-full w-full rounded-md object-cover [backface-visibility:hidden]"
      />
      <Image
        src={frontSrc}
        alt=""
        width={400}
        height={560}
        className="absolute inset-0 h-full w-full rounded-md object-cover [backface-visibility:hidden] [transform:rotateY(180deg)]"
      />
    </motion.div>
  );
}
