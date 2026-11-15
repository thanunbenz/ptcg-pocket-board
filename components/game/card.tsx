"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";

export type CardSide = "p1" | "p2";

export const CARD_FRONTS = [
  "/cards/mega-dragonite.webp",
  "/cards/abandoned-station.webp",
  "/cards/giratina.webp",
  "/cards/dragonair.png",
];

export const CARD_HP = [240, 120, 150, 80];

export function Card({
  cardId,
  index,
  total,
  side,
  offset,
  frontSrc,
  interactive,
  selected,
  draggableCard,
  onClick,
  onDragEnd,
  onHoverStart,
  onHoverEnd,
}: {
  cardId?: string;
  index: number;
  total: number;
  side: CardSide;
  offset: { x: number; y: number };
  frontSrc: string;
  interactive?: boolean;
  selected?: boolean;
  draggableCard?: boolean;
  onClick?: () => void;
  onDragEnd?: (point: { x: number; y: number }) => void;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
}) {
  const ours = side === "p1";
  const direction = ours ? 1 : -1;
  const k = index - (total - 1) / 2;
  const [dragOffset, setDragOffset] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const dragEndRef = useRef(onDragEnd);

  useEffect(() => {
    dragEndRef.current = onDragEnd;
  }, [onDragEnd]);

  useEffect(() => {
    const handleMove = (event: PointerEvent) => {
      if (!dragStart.current) return;
      setDragOffset({
        x: event.clientX - dragStart.current.x,
        y: event.clientY - dragStart.current.y,
      });
    };
    const handleUp = (event: PointerEvent) => {
      if (!dragStart.current) return;
      dragStart.current = null;
      setDragOffset(null);
      dragEndRef.current?.({ x: event.clientX, y: event.clientY });
    };
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };
  }, []);

  const handlePointerDown = (event: React.PointerEvent) => {
    if (!draggableCard) return;
    dragStart.current = { x: event.clientX, y: event.clientY };
    setDragOffset({ x: 0, y: 0 });
  };

  return (
    <motion.div
      data-card={cardId}
      data-fan={direction * k * 7}
      onPointerDown={handlePointerDown}
      onClick={onClick}
      className={cn(
        "relative aspect-[5/7] w-[min(4.5vw,8dvh)] shrink-0 [transform-style:preserve-3d]",
        (interactive || draggableCard) && "cursor-grab",
        dragOffset && "cursor-grabbing",
        selected && "rounded-md ring-2 ring-white/80",
      )}
      initial={{ x: offset.x, y: offset.y, rotate: 0, rotateY: 0, zIndex: 20 }}
      animate={{
        x: dragOffset?.x ?? 0,
        y: (dragOffset?.y ?? 0) + Math.abs(k) * 4 * direction,
        rotate: dragOffset ? 0 : direction * k * 7,
        rotateY: ours ? 180 : 0,
        scale: dragOffset ? 1.06 : 1,
      }}
      transition={{
        x: dragOffset ? { duration: 0 } : { duration: 0.5, ease: "easeOut" },
        rotate: dragOffset
          ? { duration: 0 }
          : { duration: 0.5, ease: "easeOut" },
        rotateY: { duration: 0.5, ease: "easeOut" },
        y: dragOffset
          ? { duration: 0 }
          : { type: "spring", stiffness: 260, damping: 26, mass: 0.8 },
        scale: dragOffset
          ? { duration: 0 }
          : { type: "spring", stiffness: 260, damping: 26, mass: 0.8 },
        zIndex: { duration: 0 },
      }}
      whileHover={
        interactive && !dragOffset ? { y: -22, scale: 1.07 } : undefined
      }
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      style={{
        transformPerspective: 900,
        originX: 0.5,
        originY: ours ? 1.6 : -0.6,
        zIndex: dragOffset ? 40 : 0,
        pointerEvents: dragOffset ? "none" : undefined,
      }}
    >
      <div className="relative h-full w-full [transform-style:preserve-3d]">
        <Image
          src="/pick-deck/card-back.png"
          alt=""
          width={745}
          height={1040}
          draggable={false}
          className="absolute inset-0 h-full w-full rounded-md object-cover [backface-visibility:hidden]"
        />
        <Image
          src={frontSrc}
          alt=""
          width={400}
          height={560}
          draggable={false}
          className="absolute inset-0 h-full w-full rounded-md object-cover [backface-visibility:hidden] [transform:rotateY(180deg)]"
        />
      </div>
    </motion.div>
  );
}
