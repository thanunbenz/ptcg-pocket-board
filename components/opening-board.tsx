"use client";

import { useRef, useState } from "react";
import { AnimatePresence } from "motion/react";

import { NarrowBoard } from "@/components/board/narrow-board";
import { WideBoard } from "@/components/board/wide-board";
import { CoinPopup } from "@/components/game/coin-popup";
import { EndBattle } from "@/components/game/end-battle";
import { PointGain } from "@/components/game/point-gain";
import { TurnChange } from "@/components/game/turn-change";
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
  const [currentTurn, setCurrentTurn] = useState<"p1" | "p2" | null>(null);
  const [turnTarget, setTurnTarget] = useState<"p1" | "p2" | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [coinPopupOpen, setCoinPopupOpen] = useState(false);
  const [boardKey, setBoardKey] = useState(0);
  const [points, setPoints] = useState<Record<"p1" | "p2", number>>({
    p1: 0,
    p2: 0,
  });
  const [turnNumber, setTurnNumber] = useState(1);
  const [pointGain, setPointGain] = useState<{
    side: "p1" | "p2";
    points: number;
  } | null>(null);
  const [battleEnd, setBattleEnd] = useState(false);

  const dealer = useDealer({
    p1: { deck: deckP1Ref, hand: handP1Ref },
    p2: { deck: deckP2Ref, hand: handP2Ref },
  });

  const openPicker = () => {
    dealer.cancel();
    setGameStarted(false);
    setCurrentTurn(null);
    setTurnTarget(null);
    setCoinPopupOpen(false);
    setPoints({ p1: 0, p2: 0 });
    setTurnNumber(1);
    setPointGain(null);
    setBattleEnd(false);
    setPickDeckOpen(true);
  };

  const handleStart = () => {
    if (!gameStarted) {
      openPicker();
      return;
    }
    if (dealer.dealing || dealer.mulliganing || turnTarget) return;
    setTurnTarget(currentTurn === "p2" ? "p1" : "p2");
  };

  const gainPoint = () => {
    const side = currentTurn ?? "p1";
    const next = Math.min(3, points[side] + 1);
    setPoints((current) => ({ ...current, [side]: next }));
    setPointGain({ side, points: next });
  };

  const statusLabel =
    gameStarted && currentTurn
      ? `Player ${currentTurn === "p1" ? 1 : 2} turn`
      : "Game not started";

  return (
    <div
      ref={boardRef}
      data-first-player={firstPlayer ?? undefined}
      className="h-dvh overflow-hidden bg-[radial-gradient(circle_at_50%_42%,#15151B_0%,#0B0B0F_55%,#050506_100%)] [--bar:clamp(2.25rem,4dvh,2.75rem)]"
    >
      <div className="hidden h-full flex-col landscape:flex">
        <WideBoard
          key={boardKey}
          onStart={handleStart}
          onReset={openPicker}
          startLabel={gameStarted ? "End Turn" : "Start"}
          statusLabel={statusLabel}
          startDisabled={dealer.dealing || dealer.mulliganing || !!turnTarget}
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
          onFlipCoin={() => setCoinPopupOpen(true)}
          points={points}
          busy={dealer.dealing || dealer.mulliganing}
        />
      </div>
      <div className="hidden h-full portrait:flex">
        <NarrowBoard
          onStart={handleStart}
          onReset={openPicker}
          onFlipCoin={() => setCoinPopupOpen(true)}
          startLabel={gameStarted ? "End Turn" : "Start"}
          startDisabled={dealer.dealing || dealer.mulliganing || !!turnTarget}
          deckCounts={dealer.deckCounts}
          points={points}
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
              const turn = heads ? "p1" : "p2";
              setFirstPlayer(turn);
              setCurrentTurn(turn);
              window.setTimeout(() => setCoinOpen(false), 700);
              window.setTimeout(() => {
                void dealer.deal();
                setGameStarted(true);
                setBoardKey((current) => current + 1);
                setPoints({ p1: 0, p2: 0 });
                setTurnNumber(1);
              }, 1100);
            }}
          />
        ) : null}
      </AnimatePresence>

      {turnTarget ? (
        <TurnChange
          side={turnTarget}
          onSwitch={() => {
            setCurrentTurn(turnTarget);
            setTurnNumber((current) => current + 1);
          }}
          onClose={() => setTurnTarget(null)}
        />
      ) : null}

      {coinPopupOpen ? (
        <CoinPopup onClose={() => setCoinPopupOpen(false)} />
      ) : null}

      {gameStarted && !battleEnd ? (
        <div className="fixed top-3 left-3 z-30 flex items-center gap-1.5">
          <button
            type="button"
            onClick={gainPoint}
            className="rounded-full border border-white/15 bg-black/55 px-3 py-1.5 text-[0.62rem] font-semibold tracking-[0.08em] text-white/70 uppercase backdrop-blur-sm transition-colors hover:bg-white/10 hover:text-white"
          >
            Get point
          </button>
          <button
            type="button"
            onClick={() => setBattleEnd(true)}
            className="rounded-full border border-white/15 bg-black/55 px-3 py-1.5 text-[0.62rem] font-semibold tracking-[0.08em] text-white/70 uppercase backdrop-blur-sm transition-colors hover:border-opponent/50 hover:text-opponent"
          >
            End battle
          </button>
        </div>
      ) : null}

      {pointGain ? (
        <PointGain
          side={pointGain.side}
          points={pointGain.points}
          onClose={() => setPointGain(null)}
        />
      ) : null}

      {battleEnd ? (
        <EndBattle
          p1={points.p1}
          p2={points.p2}
          turns={turnNumber}
          onPlayAgain={openPicker}
          onCancel={() => setBattleEnd(false)}
        />
      ) : null}
    </div>
  );
}
