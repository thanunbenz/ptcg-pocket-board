"use client";

import Image from "next/image";
import { Ellipsis, Undo2 } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const CARD =
  "absolute flex h-[6.71875cqw] w-[4.7917cqw] items-center justify-center rounded-[0.5208cqw] border-[0.0521cqw] border-[#262626] bg-slot text-[0.8854cqw] text-muted";

const ACTIVE =
  "absolute flex h-[9.0625cqw] w-[6.5104cqw] items-center justify-center rounded-[0.625cqw] border-[0.0521cqw] bg-slot text-[0.8854cqw] text-muted";

const BENCH_LEFT = ["left-[41.875cqw]", "left-[47.6042cqw]", "left-[53.3333cqw]"];

const MotionButton = motion.create(Button);

function Slot({ label, className }: { label: string; className?: string }) {
  return <div className={cn(CARD, className)}>{label}</div>;
}

function Pile({ label, className }: { label: string; className?: string }) {
  return (
    <div
      className={cn(
        "absolute h-[6.71875cqw] w-[4.7917cqw] overflow-hidden rounded-[0.5208cqw]",
        className,
      )}
    >
      <Image
        src="/opening/card-back.png"
        alt=""
        width={92}
        height={129}
        className="h-full w-full"
      />
      <span className="absolute inset-x-0 bottom-[0.3646cqw] text-center text-[0.7292cqw] leading-none text-muted">
        {label}
      </span>
    </div>
  );
}

function EnergyZone({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "absolute size-[2.2917cqw] rounded-full border-[0.0521cqw] border-[#333] bg-[#0A0A0A]",
        className,
      )}
    />
  );
}

function PrizeRings({ className }: { className?: string }) {
  return (
    <div className={cn("flex gap-[0.3125cqw]", className)}>
      {Array.from({ length: 3 }, (_, ring) => (
        <span
          key={ring}
          className="size-[0.9375cqw] rounded-full border-[0.1042cqw] border-muted"
        />
      ))}
    </div>
  );
}

function BoardBar({ tag, isTop }: { tag: string; isTop: boolean }) {
  const wash = isTop
    ? "top-0 bg-[linear-gradient(90deg,#140808,#3A1111)]"
    : "bottom-0 bg-[linear-gradient(90deg,#113059,#081220)]";

  return (
    <div className={cn("absolute inset-x-0 h-[2.1875cqw]", wash)}>
      <div
        className={cn(
          "absolute top-1/2 flex -translate-y-1/2 items-center",
          isTop ? "left-[58.6979cqw]" : "left-[34.0104cqw]",
        )}
      >
        {isTop ? <PrizeRings /> : null}
        <span
          className={cn(
            "text-[0.78125cqw] font-bold",
            isTop ? "ml-[1.0417cqw] text-opponent" : "text-self",
          )}
        >
          {tag}
        </span>
        {isTop ? null : <PrizeRings className="ml-[1.5104cqw]" />}
      </div>
    </div>
  );
}

function StartButton() {
  const reduceMotion = useReducedMotion();

  return (
    <span className="absolute left-[58.1771cqw] top-[27.9167cqw] box-border flex h-[1.71875cqw] w-[7.5cqw] items-stretch rounded-full bg-[linear-gradient(90deg,#7894ED,#3AE4EF)] p-[0.1042cqw] shadow-[0_0_0.2604cqw_rgba(58,228,239,0.35)]">
      <MotionButton
        whileTap={reduceMotion ? undefined : { scale: 0.96 }}
        className="m-0 box-border block h-full min-h-0 w-full rounded-full bg-white px-0 py-0 text-[0.78125cqw] leading-none font-medium text-[#A7A7A7] hover:bg-white"
      >
        Start
      </MotionButton>
    </span>
  );
}

function Fab({
  label,
  className,
  children,
}: {
  label: string;
  className: string;
  children: React.ReactNode;
}) {
  return (
    <Button
      variant="outline"
      size="icon"
      aria-label={label}
      className={cn(
        "absolute size-[2.2917cqw] rounded-[0.625cqw] border-[#303030] bg-[#111] p-0 text-white [&_svg]:size-[0.7292cqw]",
        className,
      )}
    >
      {children}
    </Button>
  );
}

export function OpeningBoard() {
  return (
    <div className="grid h-dvh place-items-center overflow-hidden bg-background">
      <div
        data-stage
        className="@container relative aspect-[1920/1116] w-[min(100vw,calc(100dvh*1.72043))] overflow-hidden bg-background"
      >
        <BoardBar isTop tag="Player 2" />

        <EnergyZone className="left-[33.6458cqw] top-[9.6875cqw]" />
        <Pile label="Discard" className="left-[32.5cqw] top-[12.5521cqw]" />
        <Pile label="Deck" className="left-[32.5cqw] top-[19.7396cqw]" />
        <Slot label="Stadium" className="left-[62.7604cqw] top-[19.4792cqw]" />
        {BENCH_LEFT.map((left) => (
          <Slot key={left} label="Bench" className={cn(left, "top-[10.4167cqw]")} />
        ))}
        <div
          className={cn(
            ACTIVE,
            "left-[46.7708cqw] top-[18.0729cqw] border-opponent/65",
          )}
        >
          Active
        </div>

        <div className="absolute left-0 top-[28.75cqw] h-[0.0521cqw] w-full bg-[linear-gradient(90deg,#000,#2F5FA7_50%,#000)]" />
        <StartButton />

        <Slot label="Stadium" className="left-[32.5cqw] top-[31.71875cqw]" />
        <Fab label="More options" className="left-[33.75cqw] top-[41.25cqw]">
          <Ellipsis />
        </Fab>
        <Fab label="Undo" className="left-[33.75cqw] top-[43.9583cqw]">
          <Undo2 />
        </Fab>

        <div
          className={cn(
            ACTIVE,
            "left-[46.7708cqw] top-[30.3646cqw] border-self/50",
          )}
        >
          Active
        </div>

        {BENCH_LEFT.map((left) => (
          <Slot key={left} label="Bench" className={cn(left, "top-[40.3646cqw]")} />
        ))}

        <Pile label="Deck" className="left-[62.7604cqw] top-[32.0833cqw]" />
        <Pile label="Discard" className="left-[62.7604cqw] top-[39.53125cqw]" />
        <div className="absolute left-[64.21875cqw] top-[47.03125cqw] size-[2.3958cqw] rounded-full border-[0.0521cqw] border-[#333] bg-[#0A0A0A]" />

        <BoardBar tag="Player 1" isTop={false} />
      </div>
    </div>
  );
}
