"use client";

import { CARD_FRONTS, Card, type CardSide } from "@/components/game/card";
import { cn } from "@/lib/utils";
import type { Offsets } from "@/components/game/use-dealer";

export function Hand({
  side,
  cards,
  offsets,
  handRef,
  className,
}: {
  side: CardSide;
  cards: string[];
  offsets: Offsets;
  handRef?: React.Ref<HTMLDivElement>;
  className?: string;
}) {
  return (
    <div
      ref={handRef}
      data-hand={side}
      className={cn(
        "pointer-events-none absolute left-1/2 z-10 -translate-x-1/2",
        className,
      )}
    >
      <div className="flex items-center justify-center [&>*+*]:-ml-[min(1.9vw,3.4dvh)]">
        {cards.map((id, index) => (
          <Card
            key={id}
            index={index}
            total={cards.length}
            side={side}
            offset={offsets[id] ?? { x: 0, y: 0 }}
            frontSrc={CARD_FRONTS[index % CARD_FRONTS.length]}
          />
        ))}
      </div>
    </div>
  );
}
