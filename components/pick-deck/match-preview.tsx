"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

import { ArrowLeftRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DeckOwner = "opponent" | "player";

function DeckPanel({
  label,
  deckName,
  caption,
  tone,
  onPickDeck,
  action,
  className,
  faded,
}: {
  label: string;
  deckName: string;
  caption: string;
  tone: DeckOwner;
  onPickDeck: () => void;
  action?: React.ReactNode;
  className?: string;
  faded?: boolean;
}) {
  const isOpponent = tone === "opponent";
  const reduceMotion = useReducedMotion();

  return (
    <div
      className={cn(
        "relative rounded-2xl border bg-white/[0.03] px-4 pt-3 pb-4 text-center short:pt-2 short:pb-3",
        isOpponent ? "border-opponent" : "border-self",
        className,
      )}
    >
      {action ? <div className="absolute top-2 right-2">{action}</div> : null}
      <p
        className={cn(
          "text-sm font-bold",
          isOpponent ? "text-opponent" : "text-self",
        )}
      >
        {label}
      </p>
      <motion.div
        animate={{ opacity: faded ? 0 : 1 }}
        transition={{ duration: 0.15 }}
      >
        <motion.button
          type="button"
          onClick={onPickDeck}
          aria-label={`Choose ${label}'s deck`}
          whileHover={reduceMotion ? undefined : { scale: 1.03 }}
          whileTap={reduceMotion ? undefined : { scale: 0.99 }}
          transition={{ duration: 0.15 }}
          className="mx-auto mt-2 block cursor-pointer overflow-hidden rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <Image
            src="/pick-deck/card-back.png"
            alt=""
            width={94}
            height={132}
            className="h-[min(132px,calc((88dvh_-_381px)/2))] w-auto aspect-[5/7] rounded-md object-cover short:h-[min(104px,calc(88dvh_-_204px))]"
          />
        </motion.button>
        <p className="mt-2 truncate text-[15px] font-bold text-white short:mt-1">
          {deckName}
        </p>
        <p className="mt-1 text-[11px] tracking-[0.12em] text-muted uppercase short:mt-0.5">
          {caption}
        </p>
      </motion.div>
    </div>
  );
}

export function MatchPreview({
  opponentDeck,
  playerDeck,
  onPickDeck,
  onSwapDecks,
  onStart,
  onCancel,
}: {
  opponentDeck: string;
  playerDeck: string;
  onPickDeck: (owner: DeckOwner) => void;
  onSwapDecks: () => void;
  onStart: () => void;
  onCancel: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const [isSwapping, setIsSwapping] = useState(false);
  const swapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (swapTimer.current) clearTimeout(swapTimer.current);
    },
    [],
  );

  const handleSwap = () => {
    if (isSwapping) return;
    if (reduceMotion) {
      onSwapDecks();
      return;
    }
    setIsSwapping(true);
    swapTimer.current = setTimeout(() => {
      onSwapDecks();
      setIsSwapping(false);
    }, 160);
  };

  return (
    <div className="w-full p-4">
      <div className="flex flex-col short:flex-row short:items-center short:gap-3">
        <DeckPanel
          className="short:flex-1"
          faded={isSwapping}
          label="Player 2"
          deckName={opponentDeck}
          caption="Opponent deck"
          tone="opponent"
          onPickDeck={() => onPickDeck("opponent")}
          action={
            <button
              type="button"
              onClick={handleSwap}
              aria-label="Swap decks"
              className="grid size-7 cursor-pointer place-items-center rounded-full border border-opponent/50 bg-opponent/15 text-opponent transition-colors hover:bg-opponent/25 focus-visible:ring-2 focus-visible:ring-opponent focus-visible:outline-none"
            >
              <ArrowLeftRight className="size-3.5" />
            </button>
          }
        />

        <p className="py-2 text-center text-xl text-white short:py-0">VS</p>

        <DeckPanel
          className="short:flex-1"
          faded={isSwapping}
          label="Player 1"
          deckName={playerDeck}
          caption="Your active deck"
          tone="player"
          onPickDeck={() => onPickDeck("player")}
        />
      </div>
      <Button
        onClick={onStart}
        className="mt-4 h-9 w-full rounded-full bg-white text-sm font-bold text-black uppercase hover:bg-neutral-200 short:mt-2"
      >
        Start
      </Button>
      <button
        type="button"
        onClick={onCancel}
        className="mt-3 w-full cursor-pointer text-center text-sm text-muted transition-colors hover:text-white short:mt-1"
      >
        Cancel
      </button>
    </div>
  );
}
