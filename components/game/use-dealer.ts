"use client";

import { useRef, useState } from "react";

export type CardId = string;
export type Offsets = Record<CardId, { x: number; y: number }>;
export type Side = "p1" | "p2";
export type DepartingCard = {
  id: CardId;
  x: number;
  y: number;
  w: number;
  h: number;
  rotate: number;
  dx: number;
  dy: number;
  scale: number;
};

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
  const [mulliganing, setMulliganing] = useState(false);
  const [shuffleSide, setShuffleSide] = useState<Side | null>(null);
  const [departing, setDeparting] = useState<Record<Side, DepartingCard[]>>({
    p1: [],
    p2: [],
  });
  const generation = useRef(0);
  const nextCard = useRef(0);

  const draw = (side: Side, index: number) => {
    const deck = refs[side].deck.current;
    const hand = refs[side].hand.current;
    if (!deck || !hand) return;
    const deckBox = deck.getBoundingClientRect();
    const handBox = hand.getBoundingClientRect();
    const probe = hand.querySelector<HTMLElement>("[data-card]");
    const cardWidth =
      probe?.offsetWidth ??
      Math.min(window.innerWidth * 0.045, window.innerHeight * 0.08);
    const cardHeight = probe?.offsetHeight ?? cardWidth * 1.4;
    const overlap = Math.min(window.innerWidth * 0.019, window.innerHeight * 0.034);
    const rowWidth = (index + 1) * cardWidth - index * overlap;
    const slotX =
      handBox.x +
      handBox.width / 2 -
      rowWidth / 2 +
      index * (cardWidth - overlap) +
      cardWidth / 2;
    const slotY = handBox.y + handBox.height - cardHeight / 2;
    const id = `${side}-${nextCard.current++}`;
    setOffsets((current) => ({
      ...current,
      [id]: {
        x: deckBox.x + deckBox.width / 2 - slotX,
        y: deckBox.y + deckBox.height / 2 - slotY,
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
        draw(side, round);
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
    setMulliganing(false);
    setShuffleSide(null);
    setDeparting({ p1: [], p2: [] });
  };

  const drawCard = (side: Side) => {
    if (dealing || mulliganing || deckCounts[side] <= 0) return;
    draw(side, hands[side].length);
  };

  const mulligan = async (side: Side) => {
    if (dealing || mulliganing) return;
    const runId = generation.current + 1;
    generation.current = runId;
    setMulliganing(true);

    const ids = hands[side];
    const deck = refs[side].deck.current;
    const departingCards: DepartingCard[] = [];
    if (deck && ids.length > 0) {
      const deckBox = deck.getBoundingClientRect();
      for (const id of ids) {
        const card = document.querySelector<HTMLElement>(
          `[data-card="${id}"]`,
        );
        if (!card) continue;
        const cardBox = card.getBoundingClientRect();
        const cardWidth = card.offsetWidth;
        const cardHeight = card.offsetHeight;
        const centerX = cardBox.x + cardBox.width / 2;
        const centerY = cardBox.y + cardBox.height / 2;
        departingCards.push({
          id,
          x: centerX - cardWidth / 2,
          y: centerY - cardHeight / 2,
          w: cardWidth,
          h: cardHeight,
          rotate: Number(card.getAttribute("data-fan") ?? 0),
          dx: deckBox.x + deckBox.width / 2 - centerX,
          dy: deckBox.y + deckBox.height / 2 - centerY,
          scale: deckBox.width / cardWidth,
        });
      }
    }
    setDeparting((current) => ({ ...current, [side]: departingCards }));

    await sleep(40);
    if (generation.current !== runId) return;
    setHands((current) => ({ ...current, [side]: [] }));
    setTimeout(() => {
      if (generation.current === runId) {
        setDeparting((current) => ({ ...current, [side]: [] }));
      }
    }, 900);

    ids.forEach((_, cardIndex) => {
      setTimeout(() => {
        if (generation.current !== runId) return;
        setDeckCounts((current) => ({
          ...current,
          [side]: Math.min(START_DECK, current[side] + 1),
        }));
      }, 450 + cardIndex * 60);
    });

    await sleep(900);
    if (generation.current !== runId) return;
    setShuffleSide(side);

    await sleep(1300);
    if (generation.current !== runId) return;
    setShuffleSide(null);

    for (let round = 0; round < 5; round++) {
      if (generation.current !== runId) return;
      draw(side, round);
      await sleep(200);
    }
    if (generation.current !== runId) return;
    setMulliganing(false);
  };

  const playCard = (side: Side, id: CardId) => {
    setHands((current) => ({
      ...current,
      [side]: current[side].filter((card) => card !== id),
    }));
  };

  return {
    deckCounts,
    hands,
    offsets,
    dealing,
    mulliganing,
    shuffleSide,
    departing,
    deal,
    cancel,
    drawCard,
    mulligan,
    playCard,
  };
}
