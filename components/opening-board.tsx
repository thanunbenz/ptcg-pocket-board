"use client";

import { useRef, useState } from "react";
import { AnimatePresence } from "motion/react";

import { NarrowBoard } from "@/components/board/narrow-board";
import { WideBoard } from "@/components/board/wide-board";
import { useDealer } from "@/components/game/use-dealer";
import { CoinToss } from "@/components/pick-deck/coin-toss";
import { PickDeckDialog } from "@/components/pick-deck/pick-deck-dialog";
import { VsIntro } from "@/components/pick-deck/vs-intro";

export function OpeningBoard() {
  const boardRef = useRef<HTMLDivElement>(null);
  const deckP1Ref = useRef<HTMLDivElement>(null);
  const deckP2Ref = useRef<HTMLDivElement>(null);
  const handP1Ref = useRef<HTMLDivElement>(null);
  const handP2Ref = useRef<HTMLDivElement>(null);

  const [isPickDeckOpen, setPickDeckOpen] = useState(false);
  const [isIntroOpen, setIntroOpen] = useState(false);
  const [isCoinOpen, setCoinOpen] = useState(false);
  const [firstPlayer, setFirstPlayer] = useState<"p1" | "p2" | null>(null);

  const dealer = useDealer({
    p1: { deck: deckP1Ref, hand: handP1Ref },
    p2: { deck: deckP2Ref, hand: handP2Ref },
  });

  const openPicker = () => {
    dealer.cancel();
    setPickDeckOpen(true);
  };

  return (
    <div
      ref={boardRef}
      data-first-player={firstPlayer ?? undefined}
      className="h-dvh overflow-hidden bg-[radial-gradient(circle_at_50%_42%,#15151B_0%,#0B0B0F_55%,#050506_100%)] [--bar:clamp(2.25rem,4dvh,2.75rem)]"
    >
      <div className="hidden h-full flex-col landscape:flex">
        <WideBoard
          onStart={openPicker}
          startDisabled={dealer.dealing}
          deckCounts={dealer.deckCounts}
          hands={dealer.hands}
          offsets={dealer.offsets}
          deckP1Ref={deckP1Ref}
          deckP2Ref={deckP2Ref}
          handP1Ref={handP1Ref}
          handP2Ref={handP2Ref}
          onDrawCard={dealer.drawCard}
          onMulligan={dealer.mulligan}
          onPlayCard={dealer.playCard}
          shuffleSide={dealer.shuffleSide}
          departing={dealer.departing}
          busy={dealer.dealing || dealer.mulliganing}
        />
      </div>
      <div className="hidden h-full portrait:flex">
        <NarrowBoard
          onStart={openPicker}
          startDisabled={dealer.dealing}
          deckCounts={dealer.deckCounts}
        />
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
              window.setTimeout(() => setCoinOpen(false), 700);
              window.setTimeout(() => {
                void dealer.deal();
              }, 1100);
            }}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
