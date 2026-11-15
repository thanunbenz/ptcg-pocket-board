"use client";

import { Leaf, X } from "lucide-react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";

function EnergyOrb() {
  return (
    <span className="grid size-[1.35rem] shrink-0 place-items-center rounded-full bg-[#0F3A12] text-[#6EE86E] ring-2 ring-[#57D65A]">
      <Leaf className="size-3.5" />
    </span>
  );
}

export function CardActions({
  x,
  y,
  active,
  statusCount,
  hasBench,
  onClose,
  onAbility,
  onMove,
  onRetreat,
  onStatus,
}: {
  x: number;
  y: number;
  active: boolean;
  statusCount: number;
  hasBench: boolean;
  onClose: () => void;
  onAbility: () => void;
  onMove: (damage: number) => void;
  onRetreat: () => void;
  onStatus: () => void;
}) {
  return (
    <div className="fixed inset-0 z-30" onClick={onClose}>
      <motion.div
        className="absolute max-h-[calc(100dvh-1rem)] w-[min(12.6rem,86vw)] overflow-y-auto rounded-[1.1rem] border border-white/70 bg-[#08080A]/95 p-3 shadow-[0_18px_50px_rgba(0,0,0,0.6)]"
        style={{ left: x, top: y }}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.16, ease: "easeOut" }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <span className="text-[0.78rem] font-medium tracking-[0.16em] text-white/85">
            NAME
          </span>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="grid size-6 place-items-center rounded-md border border-white/60 text-white/80 transition-colors hover:bg-white/10"
          >
            <X className="size-3" />
          </button>
        </div>

        <button
          type="button"
          onClick={onAbility}
          className="mt-3 flex w-full items-center gap-2 rounded-full border border-[#B23B3B]/70 bg-[#2A0D10] px-2 py-1.5 text-left"
        >
          <span className="rounded-full bg-[#521418] px-3 py-1 text-[0.58rem] font-bold tracking-wide text-[#FF6B6B] uppercase">
            Ability
          </span>
          <span className="truncate text-[0.78rem] text-white/90">
            Name of ability
          </span>
        </button>

        <button
          type="button"
          onClick={() => onMove(100)}
          className="mt-2 flex w-full items-center gap-2.5 rounded-full border border-white/55 bg-black px-3 py-2"
        >
          <EnergyOrb />
          <span className="flex-1 text-left text-[0.8rem] text-white/90">
            Move Name
          </span>
          <span className="text-[0.8rem] text-white/90">100</span>
        </button>
        <button
          type="button"
          onClick={() => onMove(0)}
          className="mt-2 flex w-full items-center gap-2.5 rounded-full border border-white/55 bg-black px-3 py-2"
        >
          <EnergyOrb />
          <span className="flex-1 text-left text-[0.8rem] text-white/90">
            Move Name
          </span>
        </button>

        {active ? (
          <>
            <button
              type="button"
              onClick={onRetreat}
              disabled={!hasBench}
              className={cn(
                "mt-2 flex w-full items-center gap-2.5 rounded-full border border-white/55 bg-black px-3 py-2",
                !hasBench && "opacity-40",
              )}
            >
              <EnergyOrb />
              <span className="flex-1 text-left text-[0.8rem] text-white/90">
                Retreat
              </span>
            </button>
            <button
              type="button"
              onClick={onStatus}
              className="mt-2 flex w-full items-center justify-between rounded-full border border-white/25 px-3 py-1.5 text-[0.72rem] text-white/70 transition-colors hover:bg-white/10"
            >
              <span>Status</span>
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[0.62rem] text-white/80">
                {statusCount}
              </span>
            </button>
          </>
        ) : null}
      </motion.div>
    </div>
  );
}
