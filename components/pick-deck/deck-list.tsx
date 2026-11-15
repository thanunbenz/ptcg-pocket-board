"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

type DeckTab = "yours" | "top";

const YOUR_DECKS = [
  { id: "y1", name: "Lucario ex" },
  { id: "y2", name: "Altaria ex" },
  { id: "y3", name: "Butterfree" },
  { id: "y4", name: "Vespiquen" },
  { id: "y5", name: "Suicune ex" },
  { id: "y6", name: "Blaziken" },
];

const TOP_DECKS = [
  { id: "t1", name: "Mega Lucario" },
  { id: "t2", name: "Mega Altaria" },
  { id: "t3", name: "Sceptile" },
  { id: "t4", name: "Shuckle ex" },
  { id: "t5", name: "Baxcalibur" },
  { id: "t6", name: "Mega Absol" },
  { id: "t7", name: "Hydreigon" },
  { id: "t8", name: "Weezing ex" },
  { id: "t9", name: "Mega Blaziken" },
  { id: "t10", name: "Magnezone" },
  { id: "t11", name: "Manectric" },
  { id: "t12", name: "Hoopa ex" },
  { id: "t13", name: "Espeon" },
  { id: "t14", name: "Miraidon ex" },
  { id: "t15", name: "Heliolisk" },
  { id: "t16", name: "Suicune ex" },
  { id: "t17", name: "Butterfree" },
  { id: "t18", name: "Vespiquen ex" },
  { id: "t19", name: "Professor Sada" },
  { id: "t20", name: "Professor Turo" },
];

const TABS: { id: DeckTab; label: string; decks: typeof YOUR_DECKS }[] = [
  { id: "yours", label: "Your Decks", decks: YOUR_DECKS },
  { id: "top", label: "Top Decks", decks: TOP_DECKS },
];

export function DeckList({
  title,
  onSelect,
  onCancel,
}: {
  title: string;
  onSelect: (name: string) => void;
  onCancel: () => void;
}) {
  const [tab, setTab] = useState<DeckTab>("yours");
  const reduceMotion = useReducedMotion();
  const decks = TABS.find((entry) => entry.id === tab)?.decks ?? YOUR_DECKS;

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col p-5 short:p-3">
      <h2 className="text-center text-lg font-bold text-white short:text-base">
        {title}
      </h2>

      <div className="mt-4 flex gap-6 border-b border-white/10 short:mt-2">
        {TABS.map((entry) => (
          <button
            key={entry.id}
            type="button"
            onClick={() => setTab(entry.id)}
            className={cn(
              "relative cursor-pointer pb-2 text-[15px] font-bold transition-colors short:pb-1.5",
              tab === entry.id ? "text-white" : "text-muted hover:text-white",
            )}
          >
            {entry.label}
            {tab === entry.id ? (
              <motion.span
                layoutId="deck-tab-indicator"
                className="absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full bg-white"
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 420, damping: 32 }
                }
              />
            ) : null}
          </button>
        ))}
      </div>

      <div className="mt-4 max-h-[35.25rem] min-h-0 flex-1 overflow-y-auto [scrollbar-gutter:stable] short:mt-2 min-[560px]:max-h-[17.25rem] min-[560px]:short:max-h-[9.5rem]">
        <div className="grid grid-cols-1 gap-3 min-[560px]:grid-cols-2 min-[560px]:short:grid-cols-3 short:gap-2">
          {decks.map((deck) => (
            <button
              key={deck.id}
              type="button"
              onClick={() => onSelect(deck.name)}
              className="flex cursor-pointer items-center gap-3 rounded-xl bg-glass p-2.5 text-left transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none short:p-2"
            >
              <Image
                src="/pick-deck/card-back.png"
                alt=""
                width={52}
                height={72}
                className="h-16 w-11 shrink-0 rounded-md object-cover short:h-14 short:w-10"
              />
              <span>
                <span className="block text-[15px] font-bold text-white">
                  {deck.name}
                </span>
                <span className="mt-1 block text-[13px] text-muted">
                  20 Cards
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex justify-end short:mt-2">
        <button
          type="button"
          onClick={onCancel}
          className="cursor-pointer text-sm text-muted transition-colors hover:text-white"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
