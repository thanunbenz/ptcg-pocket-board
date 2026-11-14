"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { DeckList } from "@/components/pick-deck/deck-list";
import { MatchPreview } from "@/components/pick-deck/match-preview";

const DEFAULT_DECKS = {
  opponent: "Deck Name",
  player: "Dragonair Mega Reyquaza Ex",
};

type PickDeckView = "match" | "decks";
type DeckOwner = keyof typeof DEFAULT_DECKS;

const FADE = { duration: 0.18 };

export function PickDeckDialog({ onClose }: { onClose: () => void }) {
  const [view, setView] = useState<PickDeckView>("match");
  const [decks, setDecks] = useState(DEFAULT_DECKS);
  const [pickingFor, setPickingFor] = useState<DeckOwner>("player");

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={FADE}
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/55 backdrop-blur-[3px]"
      />

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Pick a deck"
        className="relative flex max-h-[92dvh] max-w-[92vw] flex-col overflow-hidden rounded-3xl border border-white/30 bg-surface backdrop-blur-md"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={FADE}
      >
        <AnimatePresence mode="wait" initial={false}>
          {view === "match" ? (
            <motion.div
              key="match"
              className="flex w-[min(92vw,370px)] min-h-0 flex-col short:w-[min(92vw,620px)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
            >
              <MatchPreview
                opponentDeck={decks.opponent}
                playerDeck={decks.player}
                onPickDeck={(owner) => {
                  setPickingFor(owner);
                  setView("decks");
                }}
                onSwapDecks={() => {
                  setDecks((current) => ({
                    opponent: current.player,
                    player: current.opponent,
                  }));
                }}
                onStart={onClose}
                onCancel={onClose}
              />
            </motion.div>
          ) : (
            <motion.div
              key="decks"
              className="flex w-[min(92vw,570px)] min-h-0 flex-col"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
            >
              <DeckList
                title={pickingFor === "opponent" ? "Player 2's Deck" : "Player 1's Deck"}
                onSelect={(name) => {
                  setDecks((current) => ({ ...current, [pickingFor]: name }));
                  setView("match");
                }}
                onCancel={() => setView("match")}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
