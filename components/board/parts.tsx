"use client";

import Image from "next/image";
import { motion } from "motion/react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const TOP_WASH = "bg-[linear-gradient(90deg,#140808,#3A1111)]";
export const BOTTOM_WASH = "bg-[linear-gradient(90deg,#113059,#081220)]";

export const MotionButton = motion.create(Button);

export function Slot({ label, className }: { label: string; className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center border bg-slot text-muted",
        className,
      )}
    >
      {label}
    </div>
  );
}

export function Pile({
  label,
  className,
  labelClassName,
}: {
  label: string;
  className?: string;
  labelClassName?: string;
}) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image
        src="/opening/card-back.png"
        alt=""
        width={92}
        height={129}
        className="h-full w-full"
      />
      <span
        className={cn(
          "absolute inset-x-0 text-center leading-none text-muted",
          labelClassName,
        )}
      >
        {label}
      </span>
    </div>
  );
}

export function DeckPile({
  count,
  className,
  badgeClassName,
  ref,
}: {
  count: number;
  className?: string;
  badgeClassName?: string;
  ref?: React.Ref<HTMLDivElement>;
}) {
  return (
    <div ref={ref} className={cn("relative", className)}>
      <span
        aria-hidden
        className="absolute inset-0 translate-x-[5%] translate-y-[6%] overflow-hidden rounded-[inherit]"
      >
        <Image
          src="/pick-deck/card-back.png"
          alt=""
          width={745}
          height={1040}
          className="h-full w-full object-cover"
        />
      </span>
      <span
        aria-hidden
        className="absolute inset-0 translate-x-[3.5%] translate-y-[4.5%] overflow-hidden rounded-[inherit]"
      >
        <Image
          src="/pick-deck/card-back.png"
          alt=""
          width={745}
          height={1040}
          className="h-full w-full object-cover"
        />
      </span>
      <span
        aria-hidden
        className="absolute inset-0 translate-x-[2%] translate-y-[3%] overflow-hidden rounded-[inherit]"
      >
        <Image
          src="/pick-deck/card-back.png"
          alt=""
          width={745}
          height={1040}
          className="h-full w-full object-cover"
        />
      </span>
      <span className="relative block h-full w-full overflow-hidden rounded-[inherit]">
        <Image
          src="/pick-deck/card-back.png"
          alt="Deck"
          width={745}
          height={1040}
          className="h-full w-full object-cover"
        />
      </span>
      <span
        className={cn(
          "absolute top-[3%] left-[7%] z-10 bg-black/90 font-bold text-white",
          badgeClassName,
        )}
      >
        {count}
      </span>
    </div>
  );
}

export function EnergyZone({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-full border-[#3a3a40] bg-[#141418]", className)} />
  );
}

export function PrizeRings({
  className,
  ringClassName,
}: {
  className?: string;
  ringClassName?: string;
}) {
  return (
    <div className={cn("flex", className)}>
      {Array.from({ length: 3 }, (_, ring) => (
        <span
          key={ring}
          className={cn("rounded-full border-muted", ringClassName)}
        />
      ))}
    </div>
  );
}

export function Fab({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Button
      variant="outline"
      size="icon"
      aria-label={label}
      className={cn("border-[#303030] bg-[#111] p-0 text-white", className)}
    >
      {children}
    </Button>
  );
}
