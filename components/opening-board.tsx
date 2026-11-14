"use client";

import { useState } from "react";
import { AnimatePresence } from "motion/react";

import { NarrowBoard } from "@/components/board/narrow-board";
import { WideBoard } from "@/components/board/wide-board";
import { PickDeckDialog } from "@/components/pick-deck/pick-deck-dialog";

export function OpeningBoard() {
  const [isPickDeckOpen, setPickDeckOpen] = useState(false);

  return (
    <div className="h-dvh overflow-hidden bg-[radial-gradient(circle_at_50%_42%,#15151B_0%,#0B0B0F_55%,#050506_100%)] [--bar:clamp(2.25rem,4dvh,2.75rem)]">
      <div className="hidden h-full flex-col landscape:flex">
        <WideBoard onStart={() => setPickDeckOpen(true)} />
      </div>
      <div className="hidden h-full portrait:flex">
        <NarrowBoard onStart={() => setPickDeckOpen(true)} />
      </div>

      <AnimatePresence>
        {isPickDeckOpen ? (
          <PickDeckDialog onClose={() => setPickDeckOpen(false)} />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
