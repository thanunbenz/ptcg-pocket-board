"use client";

import { Copy, Ellipsis, Undo2 } from "lucide-react";
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
import { Hand } from "@/components/game/hand";
import type { CardId, Offsets } from "@/components/game/use-dealer";

const WIDE_CARD =
  "absolute h-[6.71875cqw] w-[4.7917cqw] rounded-[0.5208cqw] border-[0.0521cqw] border-[#2F2F35] text-[0.8854cqw]";
const WIDE_ACTIVE =
  "absolute flex h-[9.0625cqw] w-[6.5104cqw] items-center justify-center rounded-[0.625cqw] border-[0.0521cqw] bg-slot text-[0.8854cqw] text-muted";
const WIDE_PILE =
  "absolute h-[6.71875cqw] w-[4.7917cqw] rounded-[0.5208cqw]";
const WIDE_PILE_LABEL = "bottom-[0.3646cqw] text-[0.7292cqw]";

const BENCH_LEFT = ["left-[41.875cqw]", "left-[47.6042cqw]", "left-[53.3333cqw]"];

function WideBar({
  tag,
  isTop,
  handCount,
}: {
  tag: string;
  isTop: boolean;
  handCount: number;
}) {
  return (
    <div
      className={cn(
        "relative flex h-[var(--bar)] w-full shrink-0 items-center",
        isTop ? TOP_WASH : BOTTOM_WASH,
      )}
    >
      <div
        className={cn(
          "absolute top-1/2 flex -translate-y-1/2 items-center",
          isTop ? "left-[61.7%]" : "left-[30.4%]",
        )}
      >
        {isTop ? (
          <PrizeRings
            className="gap-1.5"
            ringClassName="size-[1.125rem] border-2"
          />
        ) : null}
        <span
          className={cn(
            "font-two text-[0.9375rem] font-extrabold",
            isTop ? "ml-5 text-opponent" : "text-self",
          )}
        >
          {tag}
        </span>
        {isTop ? null : (
          <PrizeRings
            className="ml-7 gap-1.5"
            ringClassName="size-[1.125rem] border-2"
          />
        )}
      </div>

      <div
        className={cn(
          "absolute top-1/2 -translate-y-1/2",
          isTop ? "left-[36.2%]" : "left-[61.8%]",
        )}
      >
        <span className="flex items-center gap-1 rounded-full border border-white/30 bg-black/60 px-2.5  text-[0.6875rem] font-semibold text-white">
          <Copy className="size-2" />
          {handCount}
        </span>
      </div>
    </div>
  );
}

function WideStartButton({
  onStart,
  disabled,
}: {
  onStart: () => void;
  disabled?: boolean;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <span className="absolute left-[58.1771cqw] top-[27.9167cqw] box-border flex h-[1.71875cqw] w-[7.5cqw] items-stretch rounded-full bg-[linear-gradient(90deg,#7894ED,#3AE4EF)] p-[0.1042cqw] shadow-[0_0_0.2604cqw_rgba(58,228,239,0.35)]">
      <motion.span
        aria-hidden
        className="pointer-events-none absolute -inset-[0.15cqw] rounded-full bg-[linear-gradient(90deg,#7894ED,#3AE4EF)] blur-[0.25cqw]"
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
        className="relative m-0 box-border block h-full min-h-0 w-full rounded-full bg-white px-0 py-0 text-[0.78125cqw] leading-none font-medium text-[#A7A7A7] hover:bg-white"
      >
        Start
      </MotionButton>
    </span>
  );
}

export function WideBoard({
  onStart,
  startDisabled,
  deckCounts,
  hands,
  offsets,
  deckP1Ref,
  deckP2Ref,
  handP1Ref,
  handP2Ref,
}: {
  onStart: () => void;
  startDisabled?: boolean;
  deckCounts: Record<"p1" | "p2", number>;
  hands: Record<"p1" | "p2", CardId[]>;
  offsets: Offsets;
  deckP1Ref: React.RefObject<HTMLDivElement | null>;
  deckP2Ref: React.RefObject<HTMLDivElement | null>;
  handP1Ref: React.RefObject<HTMLDivElement | null>;
  handP2Ref: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div className="relative flex h-full w-full flex-col">
      <WideBar isTop tag="Player 2" handCount={hands.p2.length} />
      <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden">
        <div
          data-stage
          className="@container relative aspect-[1920/1116] w-[calc((100dvh-2*var(--bar))*2.2275)] shrink-0"
        >
          <EnergyZone className="absolute left-[34.8438cqw] top-[10.3542cqw] size-[2.3958cqw] border-[0.0521cqw]" />
          <Pile
            label="Discard"
            className={cn(WIDE_PILE, "left-[32.4479cqw] top-[13.2188cqw]")}
            labelClassName={WIDE_PILE_LABEL}
          />
          <DeckPile
            ref={deckP2Ref}
            count={deckCounts.p2}
            className={cn(WIDE_PILE, "left-[32.4479cqw] top-[20.4063cqw]")}
            badgeClassName="rounded-[0.15cqw] px-[0.3cqw] py-[0.1cqw] text-[0.55cqw]"
          />
          <Slot
            label="Stadium"
            className={cn(WIDE_CARD, "left-[62.7604cqw] top-[20.1459cqw]")}
          />
          {BENCH_LEFT.map((left) => (
            <Slot
              key={left}
              label="Bench"
              className={cn(WIDE_CARD, left, "top-[10.4167cqw]")}
            />
          ))}
          <div
            className={cn(
              WIDE_ACTIVE,
              "left-[46.7708cqw] top-[18.0729cqw] border-opponent/65",
            )}
          >
            Active
          </div>

          <div className="absolute left-0 top-[28.75cqw] h-[0.0521cqw] w-full bg-[linear-gradient(90deg,#000,#2F5FA7_50%,#000)]" />
          <WideStartButton onStart={onStart} disabled={startDisabled} />

          <Slot
            label="Stadium"
            className={cn(WIDE_CARD, "left-[32.4479cqw] top-[30.0104cqw]")}
          />
          <Fab
            label="More options"
            className="absolute left-[33.75cqw] top-[41.25cqw] size-[2.2917cqw] rounded-[0.625cqw] [&_svg]:size-[0.7292cqw]"
          >
            <Ellipsis />
          </Fab>
          <Fab
            label="Undo"
            className="absolute left-[33.75cqw] top-[43.9583cqw] size-[2.2917cqw] rounded-[0.625cqw] [&_svg]:size-[0.7292cqw]"
          >
            <Undo2 />
          </Fab>

          <div
            className={cn(
              WIDE_ACTIVE,
              "left-[46.7708cqw] top-[30.3646cqw] border-self/50",
            )}
          >
            Active
          </div>

          {BENCH_LEFT.map((left) => (
            <Slot
              key={left}
              label="Bench"
              className={cn(WIDE_CARD, left, "top-[40.3646cqw]")}
            />
          ))}

          <DeckPile
            ref={deckP1Ref}
            count={deckCounts.p1}
            className={cn(WIDE_PILE, "left-[62.7604cqw] top-[30.375cqw]")}
            badgeClassName="rounded-[0.15cqw] px-[0.3cqw] py-[0.1cqw] text-[0.55cqw]"
          />
          <Pile
            label="Discard"
            className={cn(WIDE_PILE, "left-[62.7604cqw] top-[37.8229cqw]")}
            labelClassName={WIDE_PILE_LABEL}
          />
          <EnergyZone className="absolute left-[62.7604cqw] top-[45.3229cqw] size-[2.3958cqw] border-[0.0521cqw]" />
        </div>
      </div>
      <WideBar tag="Player 1" isTop={false} handCount={hands.p1.length} />
      <Hand
        side="p2"
        cards={hands.p2}
        offsets={offsets}
        handRef={handP2Ref}
        className="top-[0.5dvh]"
      />
      <Hand
        side="p1"
        cards={hands.p1}
        offsets={offsets}
        handRef={handP1Ref}
        className="bottom-[1dvh]"
      />
    </div>
  );
}
