"use client";

import { useRef, useState } from "react";

export type CardId = string;
export type Offsets = Record<CardId, { x: number; y: number }>;
export type Side = "p1" | "p2";

type SideRefs = {
  deck: React.RefObject<HTMLDivElement | null>;
  hand: React.RefObject<HTMLDivElement | null>;
};

const START_DECK = 20;
const ROUNDS = 5;
const STEP_MS = 200;
const END_MS = 700;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function useDealer(refs: Record<Side, SideRefs>) {
  const [deckCounts, setDeckCounts] = useState<Record<Side, number>>({
    p1: START_DECK,
    p2: START_DECK,
  });
  const [hands, setHands] = useState<Record<Side, CardId[]>>({ p1: [], p2: [] });
  const [offsets, setOffsets] = useState<Offsets>({});
  const [dealing, setDealing] = useState(false);
  const generation = useRef(0);
  const nextCard = useRef(0);

  const draw = (side: Side) => {
    const deck = refs[side].deck.current;
    const hand = refs[side].hand.current;
    if (!deck || !hand) return;
    const deckBox = deck.getBoundingClientRect();
    const handBox = hand.getBoundingClientRect();
    const id = `${side}-${nextCard.current++}`;
    setOffsets((current) => ({
      ...current,
      [id]: {
        x: deckBox.x + deckBox.width / 2 - (handBox.x + handBox.width / 2),
        y: deckBox.y + deckBox.height / 2 - (handBox.y + handBox.height / 2),
      },
    }));
    setHands((current) => ({ ...current, [side]: [...current[side], id] }));
    setDeckCounts((current) => ({
      ...current,
      [side]: Math.max(0, current[side] - 1),
    }));
  };

  const deal = async () => {
    const runId = generation.current + 1;
    generation.current = runId;
    nextCard.current = 0;
    setDealing(true);
    setHands({ p1: [], p2: [] });
    setOffsets({});
    setDeckCounts({ p1: START_DECK, p2: START_DECK });
    await sleep(50);

    for (let round = 0; round < ROUNDS; round++) {
      for (const side of ["p1", "p2"] as const) {
        if (generation.current !== runId) return;
        draw(side);
        await sleep(STEP_MS);
        if (generation.current !== runId) return;
      }
    }

    await sleep(END_MS);
    if (generation.current !== runId) return;
    setDealing(false);
  };

  const cancel = () => {
    generation.current += 1;
    setDealing(false);
  };

  return { deckCounts, hands, offsets, dealing, deal, cancel };
}
