"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";

export const STATUS_OPTIONS = [
  { id: "poison", label: "Poisoned" },
  { id: "sleep", label: "Asleep" },
  { id: "paralyze", label: "Paralyzed" },
  { id: "confuse", label: "Confused" },
  { id: "burn", label: "Burned" },
  { id: "shield", label: "Shield" },
] as const;

export type StatusId = (typeof STATUS_OPTIONS)[number]["id"];

export function StatusPopup({
  selected,
  onToggle,
  onClose,
}: {
  selected: StatusId[];
  onToggle: (status: StatusId) => void;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-40 grid place-items-center bg-black/45 p-6 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <motion.div
        className="w-[min(34rem,92vw)] rounded-2xl border border-white/30 bg-[#0B0B0E]/95 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Status</h2>
          <button
            type="button"
            aria-label="Close status"
            onClick={onClose}
            className="grid size-7 place-items-center rounded-md border border-white/20 text-white/80 transition-colors hover:bg-white/10"
          >
            <X className="size-3.5" />
          </button>
        </div>
        <div className="mt-4 grid grid-cols-6 gap-2">
          {STATUS_OPTIONS.map((option) => {
            const on = selected.includes(option.id);
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => onToggle(option.id)}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-xl p-1.5 transition-all",
                  on
                    ? "bg-white/10 ring-1 ring-white/70"
                    : "opacity-45 hover:opacity-80",
                )}
              >
                <Image
                  src={`/status/${option.id}.png`}
                  alt=""
                  width={105}
                  height={105}
                  className="size-9"
                />
                <span className="text-[0.6rem] text-white/80">
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
