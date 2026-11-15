"use client";

import { Ellipsis, Undo2 } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import {
  BOTTOM_WASH,
  DeckPile,
  EnergyZone,
  Fab,
  MotionButton,
  Pile,
  PrizeRings,
  Slot,
  TOP_WASH,
} from "@/components/board/parts";
import { cn } from "@/lib/utils";

function NarrowBar({
  tag,
  isTop,
  points,
}: {
  tag: string;
  isTop: boolean;
  points: number;
}) {
  return (
    <div
      className={cn(
        "flex h-10 shrink-0 items-center px-5",
        isTop ? cn("justify-end", TOP_WASH) : cn("justify-start", BOTTOM_WASH),
      )}
    >
      {isTop ? (
        <PrizeRings
          className="gap-1.5"
          ringClassName="size-3.5 border-2"
          filled={points}
          filledClassName="border-opponent bg-opponent"
        />
      ) : null}
      <span
        className={cn(
          "font-two text-[0.8125rem] font-extrabold",
          isTop ? "ml-3 text-opponent" : "mr-3 text-self",
        )}
      >
        {tag}
      </span>
      {isTop ? null : (
        <PrizeRings
          className="gap-1.5"
          ringClassName="size-3.5 border-2"
          filled={points}
          filledClassName="border-self bg-self"
        />
      )}
    </div>
  );
}

function NarrowStartButton({
  onStart,
  label,
  disabled,
}: {
  onStart: () => void;
  label: string;
  disabled?: boolean;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <span className="relative box-border flex h-10 w-36 items-stretch rounded-full bg-[linear-gradient(90deg,#7894ED,#3AE4EF)] p-px shadow-[0_0_8px_rgba(58,228,239,0.35)]">
      <motion.span
        aria-hidden
        className="pointer-events-none absolute -inset-1 rounded-full bg-[linear-gradient(90deg,#7894ED,#3AE4EF)] blur-[6px]"
        animate={
          reduceMotion
            ? { opacity: 0.55 }
            : { opacity: [0.35, 0.85, 0.35], scale: [1, 1.06, 1] }
        }
        transition={
          reduceMotion
            ? undefined
            : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
        }
      />
      <MotionButton
        onClick={onStart}
        disabled={disabled}
        whileTap={reduceMotion || disabled ? undefined : { scale: 0.96 }}
        className="relative block h-full w-full rounded-full bg-white px-0 py-0 text-[0.875rem] leading-none font-medium text-[#A7A7A7] hover:bg-white"
      >
        {label}
      </MotionButton>
    </span>
  );
}

function BenchRow() {
  return (
    <div className="flex w-full items-center justify-center gap-1.5">
      {Array.from({ length: 3 }, (_, bench) => (
        <Slot
          key={bench}
          label="Bench"
          className="aspect-[5/7] h-[min(12dvh,28vw)] rounded-lg border-[#2F2F35] text-[0.6875rem]"
        />
      ))}
    </div>
  );
}

export function NarrowBoard({
  onStart,
  onReset,
  onFlipCoin,
  startLabel,
  startDisabled,
  deckCounts,
  points,
}: {
  onStart: () => void;
  onReset: () => void;
  onFlipCoin: () => void;
  startLabel: string;
  startDisabled?: boolean;
  deckCounts: Record<"p1" | "p2", number>;
  points: Record<"p1" | "p2", number>;
}) {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      <NarrowBar isTop tag="Player 2" points={points.p2} />
      <div className="mx-auto flex min-h-0 w-full max-w-[34rem] flex-1 gap-2 px-2 py-2">
        <div className="flex w-14 shrink-0 flex-col justify-between">
          <div className="flex flex-col items-center gap-1.5">
            <EnergyZone className="size-9 border" />
            <Pile
              label="Discard"
              className="aspect-[5/7] w-full rounded-lg"
              labelClassName="bottom-1 text-[0.625rem]"
            />
            <DeckPile
              count={deckCounts.p2}
              className="aspect-[5/7] w-full rounded-lg"
              badgeClassName="rounded px-1 py-0.5 text-[10px]"
            />
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <Slot
              label="Stadium"
              className="aspect-[5/7] w-full rounded-lg border-[#2F2F35] text-[0.625rem]"
            />
            <Fab
              label="Flip coin"
              onClick={onFlipCoin}
              className="size-10 rounded-xl [&_svg]:size-[1.125rem]"
            >
              <Ellipsis />
            </Fab>
            <Fab
              label="Restart"
              onClick={onReset}
              className="size-10 rounded-xl [&_svg]:size-[1.125rem]"
            >
              <Undo2 />
            </Fab>
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col items-center justify-between">
          <BenchRow />
          <div className="flex aspect-[5/7] h-[min(20dvh,40vw)] items-center justify-center rounded-xl border border-opponent/65 bg-slot text-[0.6875rem] text-muted">
            Active
          </div>
          <div className="relative flex w-full items-center justify-center">
            <span className="absolute inset-x-0 top-1/2 h-px bg-[linear-gradient(90deg,#000,#2F5FA7_50%,#000)]" />
            <NarrowStartButton
              onStart={onStart}
              label={startLabel}
              disabled={startDisabled}
            />
          </div>
          <div className="flex aspect-[5/7] h-[min(20dvh,40vw)] items-center justify-center rounded-xl border border-self/50 bg-slot text-[0.6875rem] text-muted">
            Active
          </div>
          <BenchRow />
        </div>

        <div className="flex w-14 shrink-0 flex-col justify-between">
          <div className="flex flex-col items-center gap-1.5">
            <Slot
              label="Stadium"
              className="aspect-[5/7] w-full rounded-lg border-[#2F2F35] text-[0.625rem]"
            />
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <DeckPile
              count={deckCounts.p1}
              className="aspect-[5/7] w-full rounded-lg"
              badgeClassName="rounded px-1 py-0.5 text-[10px]"
            />
            <Pile
              label="Discard"
              className="aspect-[5/7] w-full rounded-lg"
              labelClassName="bottom-1 text-[0.625rem]"
            />
            <EnergyZone className="size-9 border" />
          </div>
        </div>
      </div>
      <NarrowBar tag="Player 1" isTop={false} points={points.p1} />
    </div>
  );
}
