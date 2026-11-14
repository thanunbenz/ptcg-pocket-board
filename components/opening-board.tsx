"use client";

import { useRef, useState } from "react";
import { AnimatePresence } from "motion/react";

import { NarrowBoard } from "@/components/board/narrow-board";
import { WideBoard } from "@/components/board/wide-board";
import { CoinToss } from "@/components/pick-deck/coin-toss";
import { PickDeckDialog } from "@/components/pick-deck/pick-deck-dialog";
import { VsIntro } from "@/components/pick-deck/vs-intro";

export function OpeningBoard() {
  const boardRef = useRef<HTMLDivElement>(null);
  const [isPickDeckOpen, setPickDeckOpen] = useState(false);
  const [isIntroOpen, setIntroOpen] = useState(false);
  const [isCoinOpen, setCoinOpen] = useState(false);
  const [firstPlayer, setFirstPlayer] = useState<"p1" | "p2" | null>(null);

  return (
    <div
      ref={boardRef}
      data-first-player={firstPlayer ?? undefined}
      className="h-dvh overflow-hidden bg-[radial-gradient(circle_at_50%_42%,#15151B_0%,#0B0B0F_55%,#050506_100%)] [--bar:clamp(2.25rem,4dvh,2.75rem)]"
    >
      <div className="hidden h-full flex-col landscape:flex">
        <WideBoard onStart={() => setPickDeckOpen(true)} />
      </div>
      <div className="hidden h-full portrait:flex">
        <NarrowBoard onStart={() => setPickDeckOpen(true)} />
      </div>

      <AnimatePresence>
        {isPickDeckOpen ? (
          <PickDeckDialog
            onClose={() => setPickDeckOpen(false)}
            onStart={() => {
              setPickDeckOpen(false);
              setIntroOpen(true);
            }}
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {isIntroOpen ? (
          <VsIntro
            key="vs-intro"
            onClose={() => {
              setIntroOpen(false);
              setCoinOpen(true);
            }}
            p1={{ name: "Player 1" }}
            p2={{ name: "Player 2" }}
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {isCoinOpen ? (
          <CoinToss
            key="coin-toss"
            boardRef={boardRef}
            onResult={(heads) => {
              setFirstPlayer(heads ? "p1" : "p2");
              window.setTimeout(() => setCoinOpen(false), 900);
            }}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
