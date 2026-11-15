"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Copy, Ellipsis, Leaf, Undo2 } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import {
  BOTTOM_WASH,
  DeckPile,
  EnergyZone,
  Fab,
  MotionButton,
  Pile,
  PrizeRings,
  Slot,
  TOP_WASH,
} from "@/components/board/parts";
import { cn } from "@/lib/utils";
import { CardActions } from "@/components/game/card-actions";
import { CARD_FRONTS, CARD_HP } from "@/components/game/card";
import { Hand } from "@/components/game/hand";
import { ShuffleLayer } from "@/components/game/shuffle-layer";
import {
  StatusPopup,
  type StatusId,
} from "@/components/game/status-popup";
import type {
  CardId,
  DepartingCard,
  Offsets,
} from "@/components/game/use-dealer";

const WIDE_CARD =
  "absolute h-[6.71875cqw] w-[4.7917cqw] rounded-[0.5208cqw] border-[0.0521cqw] border-[#2F2F35] text-[0.8854cqw]";
const WIDE_ACTIVE =
  "absolute flex h-[9.0625cqw] w-[6.5104cqw] items-center justify-center rounded-[0.625cqw] border-[0.0521cqw] bg-slot text-[0.8854cqw] text-muted";
const WIDE_PILE =
  "absolute h-[6.71875cqw] w-[4.7917cqw] rounded-[0.5208cqw]";
const WIDE_PILE_LABEL = "bottom-[0.3646cqw] text-[0.7292cqw]";

const BENCH_LEFT = ["left-[41.875cqw]", "left-[47.6042cqw]", "left-[53.3333cqw]"];

const DECK_ACTIONS = [
  { id: "draw", label: "Draw" },
  { id: "view", label: "View deck" },
  { id: "mulligan", label: "Mulligan" },
  { id: "odds", label: "Probabilities" },
] as const;

function DeckActions({
  open,
  align,
  disabled,
  onAction,
  onMouseEnter,
  onMouseLeave,
}: {
  open: boolean;
  align: "left" | "right";
  disabled: boolean;
  onAction: (action: "draw" | "view" | "mulligan" | "odds") => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={cn(
        "absolute top-0 z-30 flex w-[9rem] flex-col gap-1 rounded-lg border border-white/10 bg-black/75 p-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.5)] backdrop-blur-sm transition-opacity duration-150",
        align === "right" ? "left-[108%]" : "right-[108%]",
        open
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0",
      )}
    >
      {DECK_ACTIONS.map((entry) => (
        <button
          key={entry.id}
          type="button"
          disabled={disabled}
          onClick={() => onAction(entry.id)}
          className="rounded-md border border-white/10 bg-white/10 px-2 py-1.5 text-center text-[0.625rem] font-bold tracking-wide text-white uppercase transition-colors hover:bg-white/20 disabled:pointer-events-none disabled:opacity-40"
        >
          {entry.label}
        </button>
      ))}
    </div>
  );
}

function WideBar({
  tag,
  isTop,
  handCount,
}: {
  tag: string;
  isTop: boolean;
  handCount: number;
}) {
  return (
    <div
      className={cn(
        "relative flex h-[var(--bar)] w-full shrink-0 items-center",
        isTop ? TOP_WASH : BOTTOM_WASH,
      )}
    >
      <div
        className={cn(
          "absolute top-1/2 flex -translate-y-1/2 items-center",
          isTop ? "left-[61.7%]" : "left-[30.4%]",
        )}
      >
        {isTop ? (
          <PrizeRings
            className="gap-1.5"
            ringClassName="size-[1.125rem] border-2"
          />
        ) : null}
        <span
          className={cn(
            "font-two text-[0.9375rem] font-extrabold",
            isTop ? "ml-5 text-opponent" : "text-self",
          )}
        >
          {tag}
        </span>
        {isTop ? null : (
          <PrizeRings
            className="ml-7 gap-1.5"
            ringClassName="size-[1.125rem] border-2"
          />
        )}
      </div>

      <div
        className={cn(
          "absolute top-1/2 -translate-y-1/2",
          isTop ? "left-[36.2%]" : "left-[61.8%]",
        )}
      >
        <span className="flex items-center gap-1 rounded-full border border-white/30 bg-black/60 px-2.5  text-[0.6875rem] font-semibold text-white">
          <Copy className="size-2" />
          {handCount}
        </span>
      </div>
    </div>
  );
}

function WideStartButton({
  onStart,
  label,
  disabled,
}: {
  onStart: () => void;
  label: string;
  disabled?: boolean;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <span className="absolute left-[58.1771cqw] top-[27.9167cqw] box-border flex h-[1.71875cqw] w-[7.5cqw] items-stretch rounded-full bg-[linear-gradient(90deg,#7894ED,#3AE4EF)] p-[0.1042cqw] shadow-[0_0_0.2604cqw_rgba(58,228,239,0.35)]">
      <motion.span
        aria-hidden
        className="pointer-events-none absolute -inset-[0.15cqw] rounded-full bg-[linear-gradient(90deg,#7894ED,#3AE4EF)] blur-[0.25cqw]"
        animate={
          reduceMotion
            ? { opacity: 0.55 }
            : { opacity: [0.35, 0.85, 0.35], scale: [1, 1.06, 1] }
        }
        transition={
          reduceMotion
            ? undefined
            : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
        }
      />
      <MotionButton
        onClick={onStart}
        disabled={disabled}
        whileTap={reduceMotion || disabled ? undefined : { scale: 0.96 }}
        className="relative m-0 box-border block h-full min-h-0 w-full rounded-full bg-white px-0 py-0 text-[0.78125cqw] leading-none font-medium text-[#A7A7A7] hover:bg-white"
      >
        {label}
      </MotionButton>
    </span>
  );
}

function DeployedCard({
  card,
  onOpen,
  onPreview,
}: {
  card: { front: number; hp: number; maxHp: number; energy: number };
  onOpen: () => void;
  onPreview: (front: number | null) => void;
}) {
  const ratio = card.maxHp > 0 ? card.hp / card.maxHp : 0;

  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        onOpen();
      }}
      onMouseEnter={() => onPreview(card.front)}
      onMouseLeave={() => onPreview(null)}
      className="relative block h-full w-full cursor-pointer overflow-hidden rounded-[inherit]"
    >
      <Image
        src={CARD_FRONTS[card.front]}
        alt=""
        fill
        sizes="20vw"
        draggable={false}
        className="object-cover"
      />
      <span className="absolute inset-x-0 top-0 h-[0.16cqw] bg-black/50">
        <span
          className={cn(
            "block h-full transition-all duration-200",
            ratio > 0.5
              ? "bg-emerald-400"
              : ratio > 0.2
                ? "bg-amber-400"
                : "bg-red-500",
          )}
          style={{ width: `${ratio * 100}%` }}
        />
      </span>
      <span className="absolute top-[0.2cqw] right-[0.2cqw] rounded-full bg-black/80 px-[0.25cqw] py-[0.08cqw] text-[0.45cqw] font-bold text-white">
        {card.hp}
        {ratio < 1 ? ` · ${Math.round(ratio * 100)}%` : ""}
      </span>
      {card.energy > 0 ? (
        <span className="absolute bottom-[0.2cqw] left-[0.2cqw] flex gap-[0.08cqw]">
          {Array.from({ length: card.energy }, (_, index) => (
            <span
              key={index}
              className="grid size-[0.7cqw] place-items-center rounded-full bg-[#4CAF50] text-white"
            >
              <Leaf className="size-[0.45cqw]" />
            </span>
          ))}
        </span>
      ) : null}
    </button>
  );
}

function DiscardPile({
  cards,
  className,
  labelClassName,
}: {
  cards: number[];
  className?: string;
  labelClassName?: string;
}) {
  const top = cards[cards.length - 1];
  if (top === undefined) {
    return (
      <Pile label="Discard" className={className} labelClassName={labelClassName} />
    );
  }
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image
        src={CARD_FRONTS[top]}
        alt=""
        fill
        sizes="20vw"
        draggable={false}
        className="object-cover"
      />
      <span className="absolute bottom-[8%] left-1/2 flex -translate-x-1/2 items-center gap-[0.16cqw] rounded-full bg-black/90 px-[0.32cqw] py-[0.1cqw] text-[0.5cqw] font-bold text-white">
        <span className="grid size-[0.5cqw] place-items-center rounded-full bg-white">
          <span className="size-[0.22cqw] rounded-[0.04cqw] bg-black" />
        </span>
        {cards.length}
      </span>
    </div>
  );
}

function DepartingCardView({
  card,
  index,
}: {
  card: DepartingCard;
  index: number;
}) {
  return (
    <motion.div
      data-departing={card.id}
      className="pointer-events-none fixed z-40"
      style={{
        left: card.x,
        top: card.y,
        width: card.w,
        height: card.h,
      }}
      initial={{ x: 0, y: 0, rotate: card.rotate, scale: 1 }}
      animate={{ x: card.dx, y: card.dy, rotate: 0, scale: card.scale }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: "easeIn" }}
    >
      <Image
        src="/pick-deck/card-back.png"
        alt=""
        width={745}
        height={1040}
        draggable={false}
        className="h-full w-full rounded-md object-cover"
      />
    </motion.div>
  );
}

export function WideBoard({
  onStart,
  onReset,
  startLabel,
  statusLabel,
  startDisabled,
  deckCounts,
  hands,
  offsets,
  deckP1Ref,
  deckP2Ref,
  handP1Ref,
  handP2Ref,
  onDrawCard,
  onMulligan,
  onPlayCard,
  shuffleSide,
  departing,
  onFlipCoin,
  busy,
}: {
  onStart: () => void;
  onReset: () => void;
  startLabel: string;
  statusLabel: string;
  startDisabled?: boolean;
  deckCounts: Record<"p1" | "p2", number>;
  hands: Record<"p1" | "p2", CardId[]>;
  offsets: Offsets;
  deckP1Ref: React.RefObject<HTMLDivElement | null>;
  deckP2Ref: React.RefObject<HTMLDivElement | null>;
  handP1Ref: React.RefObject<HTMLDivElement | null>;
  handP2Ref: React.RefObject<HTMLDivElement | null>;
  onDrawCard: (side: "p1" | "p2") => void;
  onMulligan: (side: "p1" | "p2") => void;
  onPlayCard: (side: "p1" | "p2", id: CardId) => void;
  shuffleSide: "p1" | "p2" | null;
  departing: Record<"p1" | "p2", DepartingCard[]>;
  onFlipCoin: () => void;
  busy: boolean;
}) {
  const [previewFront, setPreviewFront] = useState<number | null>(null);
  const [deckPanel, setDeckPanel] = useState<{
    side: "p1" | "p2";
    mode: "view" | "odds";
  } | null>(null);
  const [openDeck, setOpenDeck] = useState<"p1" | "p2" | null>(null);
  const [shuffleBox, setShuffleBox] = useState<{
    x: number;
    y: number;
    w: number;
    h: number;
  } | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  type Deployed = { front: number; hp: number; maxHp: number; energy: number };
  const [deployed, setDeployed] = useState<{
    active: Deployed | null;
    bench: (Deployed | null)[];
  }>({ active: null, bench: [null, null, null] });
  const [discard, setDiscard] = useState<number[]>([]);
  const [stadium, setStadium] = useState<number | null>(null);
  const [stadiumConfirm, setStadiumConfirm] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [abilityConfirm, setAbilityConfirm] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [statuses, setStatuses] = useState<StatusId[]>([]);
  const [statusOpen, setStatusOpen] = useState(false);
  const [actions, setActions] = useState<{
    slot: "active" | number;
    x: number;
    y: number;
  } | null>(null);
  const [hit, setHit] = useState<{ value: number; key: number } | null>(null);
  const hitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [energyPointer, setEnergyPointer] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const energyDragging = useRef(false);

  const openActions = (slot: "active" | number) => {
    const panelWidth = Math.min(202, window.innerWidth * 0.86);
    const placement = confirmPlacement(
      slot === "active" ? 290 : 210,
      panelWidth,
    );
    setActions({ slot, x: placement.x, y: placement.y });
  };

  const confirmPlacement = (panelHeight: number, width = 280) => {
    const activeSlot = document.querySelector('[data-slot="p1-active"]');
    const benchSlot = document.querySelector('[data-slot="p1-bench-0"]');
    const box = activeSlot?.getBoundingClientRect();
    const benchBox = benchSlot?.getBoundingClientRect();
    const fallbackX = window.innerWidth / 2 - width / 2;
    const x = box
      ? Math.min(
        Math.max(box.x + box.width / 2 - width / 2, 8),
        window.innerWidth - width - 8,
      )
      : fallbackX;
    const benchCenter = benchBox
      ? benchBox.y + benchBox.height / 2
      : window.innerHeight * 0.72;
    const y = Math.min(
      Math.max(benchCenter - panelHeight / 2, 8),
      window.innerHeight - panelHeight - 8,
    );
    return { x, y };
  };

  const attack = (damage: number) => {
    setActions(null);
    if (damage <= 0) return;
    if (hitTimer.current) clearTimeout(hitTimer.current);
    setHit({ value: damage, key: Date.now() });
    hitTimer.current = setTimeout(() => setHit(null), 900);
  };

  const retreat = () => {
    setDeployed((current) => {
      const benchIndex = current.bench.findIndex((card) => card !== null);
      const nextActive = current.bench[benchIndex];
      if (!current.active || benchIndex === -1 || !nextActive) return current;
      return {
        active: nextActive,
        bench: current.bench.map((card, slot) =>
          slot === benchIndex ? current.active : card,
        ),
      };
    });
    setStatuses([]);
    setActions(null);
  };

  const activeConditions = statuses.filter((status) => status !== "shield");
  const hasShield = statuses.includes("shield");
  const [statusCursor, setStatusCursor] = useState(0);

  useEffect(() => {
    const count = statuses.filter((status) => status !== "shield").length;
    if (count < 2) return;
    const timer = window.setInterval(
      () => setStatusCursor((current) => current + 1),
      2000,
    );
    return () => window.clearInterval(timer);
  }, [statuses]);

  const shownCondition =
    activeConditions.length > 0
      ? activeConditions[statusCursor % activeConditions.length]
      : null;

  const toggleStatus = (status: StatusId) => {
    setStatuses((current) =>
      current.includes(status)
        ? current.filter((entry) => entry !== status)
        : [...current, status],
    );
  };

  const useStadium = () => {
    if (stadium === null) return;
    setDiscard((current) => [...current, stadium]);
    setStadium(null);
    setStadiumConfirm(null);
    onDrawCard("p1");
  };

  const placeCard = (slot: "active" | number, id: string, front: number) => {
    const maxHp = CARD_HP[front];
    const card = { front, hp: maxHp, maxHp, energy: 0 };
    if (slot === "active") {
      setDeployed((current) => ({ ...current, active: card }));
    } else {
      setDeployed((current) => ({
        ...current,
        bench: current.bench.map((existing, index) =>
          index === slot ? card : existing,
        ),
      }));
    }
    onPlayCard("p1", id);
  };

  const handleCardDragEnd = (
    index: number,
    id: string,
    point: { x: number; y: number },
  ) => {
    const target = document
      .elementFromPoint(point.x, point.y)
      ?.closest("[data-slot]");
    const slotName = target?.getAttribute("data-slot");
    if (!slotName) return;
    const front = index % CARD_FRONTS.length;
    if (slotName === "p1-stadium") {
      if (front === 1 && stadium === null) {
        setStadium(front);
        onPlayCard("p1", id);
      }
      return;
    }
    if (slotName === "p1-active") {
      if (!deployed.active) placeCard("active", id, front);
      return;
    }
    const benchMatch = /^p1-bench-(\d)$/.exec(slotName);
    if (!benchMatch) return;
    const slotIndex = Number(benchMatch[1]);
    if (!deployed.bench[slotIndex]) placeCard(slotIndex, id, front);
  };

  const startEnergyDrag = (event: React.PointerEvent) => {
    energyDragging.current = true;
    setEnergyPointer({ x: event.clientX, y: event.clientY });
  };

  useEffect(() => {
    const handleMove = (event: PointerEvent) => {
      if (!energyDragging.current) return;
      setEnergyPointer({ x: event.clientX, y: event.clientY });
    };
    const handleUp = (event: PointerEvent) => {
      if (!energyDragging.current) return;
      energyDragging.current = false;
      setEnergyPointer(null);
      const slot = document
        .elementFromPoint(event.clientX, event.clientY)
        ?.closest("[data-slot]")
        ?.getAttribute("data-slot");
      if (!slot) return;
      if (slot === "p1-active") {
        setDeployed((current) =>
          current.active
            ? {
              ...current,
              active: {
                ...current.active,
                energy: current.active.energy + 1,
              },
            }
            : current,
        );
        return;
      }
      const benchMatch = /^p1-bench-(\d)$/.exec(slot);
      if (!benchMatch) return;
      const index = Number(benchMatch[1]);
      setDeployed((current) => ({
        ...current,
        bench: current.bench.map((card, slotIndex) =>
          slotIndex === index && card
            ? { ...card, energy: card.energy + 1 }
            : card,
        ),
      }));
    };
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };
  }, []);

  useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
      if (hitTimer.current) clearTimeout(hitTimer.current);
    },
    [],
  );

  useEffect(() => {
    if (!shuffleSide) return;
    const deck = (shuffleSide === "p1" ? deckP1Ref : deckP2Ref).current;
    if (!deck) return;
    const frame = requestAnimationFrame(() => {
      const box = deck.getBoundingClientRect();
      setShuffleBox({ x: box.x, y: box.y, w: box.width, h: box.height });
    });
    return () => cancelAnimationFrame(frame);
  }, [shuffleSide, deckP1Ref, deckP2Ref]);

  const openDeckMenu = (side: "p1" | "p2") => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenDeck(side);
  };

  const scheduleCloseDeck = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenDeck(null), 150);
  };

  const runDeckAction = (
    side: "p1" | "p2",
    action: "draw" | "view" | "mulligan" | "odds",
  ) => {
    if (action === "draw") {
      onDrawCard(side);
      return;
    }
    if (action === "mulligan") {
      setOpenDeck(null);
      onMulligan(side);
      return;
    }
    setOpenDeck(null);
    setDeckPanel({ side, mode: action === "view" ? "view" : "odds" });
  };

  return (
    <div className="relative flex h-full w-full flex-col">
      <WideBar isTop tag="Player 2" handCount={hands.p2.length} />
      <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden">
        <div
          data-stage
          className="@container relative aspect-[1920/1116] w-[calc((100dvh-2*var(--bar))*2.2275)] shrink-0"
        >
          <EnergyZone className="absolute left-[34.8438cqw] top-[10.3542cqw] size-[2.3958cqw] border-[0.0521cqw]" />
          <Pile
            label="Discard"
            className={cn(WIDE_PILE, "left-[32.4479cqw] top-[13.2188cqw]")}
            labelClassName={WIDE_PILE_LABEL}
          />
          <div
            className="absolute left-[32.4479cqw] top-[20.4063cqw] h-[6.71875cqw] w-[4.7917cqw]"
            onMouseEnter={() => openDeckMenu("p2")}
            onMouseLeave={scheduleCloseDeck}
          >
            <div
              className={cn(
                "relative h-full w-full transition-opacity",
                shuffleSide === "p2" && "opacity-0",
              )}
            >
              <DeckPile
                ref={deckP2Ref}
                count={deckCounts.p2}
                className="h-full w-full rounded-[0.5208cqw]"
                badgeClassName="rounded-[0.15cqw] px-[0.3cqw] py-[0.1cqw] text-[0.55cqw]"
              />
            </div>
            <DeckActions
              open={openDeck === "p2"}
              align="left"
              disabled={busy}
              onAction={(action) => runDeckAction("p2", action)}
              onMouseEnter={() => openDeckMenu("p2")}
              onMouseLeave={scheduleCloseDeck}
            />
          </div>
          <Slot
            label="Stadium"
            className={cn(WIDE_CARD, "left-[62.7604cqw] top-[20.1459cqw]")}
          />
          {BENCH_LEFT.map((left) => (
            <Slot
              key={left}
              label="Bench"
              className={cn(WIDE_CARD, left, "top-[10.4167cqw]")}
            />
          ))}
          <div
            className={cn(
              WIDE_ACTIVE,
              "left-[46.7708cqw] top-[18.0729cqw] border-opponent/65",
            )}
          >
            Active
            {hit ? (
              <motion.span
                key={hit.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="pointer-events-none absolute inset-x-0 top-[22%] text-center text-[1.5cqw] font-black text-opponent"
              >
                -{hit.value}
              </motion.span>
            ) : null}
          </div>

          <div className="absolute left-0 top-[28.75cqw] h-[0.0521cqw] w-full bg-[linear-gradient(90deg,#000,#2F5FA7_50%,#000)]" />
          <span className="absolute left-[44.7917cqw] top-[27.9167cqw] flex h-[1.71875cqw] w-[11.71875cqw] items-center justify-center rounded-full bg-white text-[0.78125cqw] font-semibold text-[#111]">
            {statusLabel}
          </span>
          <WideStartButton
            onStart={onStart}
            label={startLabel}
            disabled={startDisabled}
          />

          <div
            data-slot="p1-stadium"
            className={cn(
              WIDE_CARD,
              "left-[32.4479cqw] top-[30.0104cqw] flex items-center justify-center overflow-hidden p-0",
            )}
          >
            {stadium === null ? (
              "Stadium"
            ) : (
              <button
                type="button"
                onClick={() =>
                  setStadiumConfirm(
                    confirmPlacement(110, Math.min(280, window.innerWidth * 0.78)),
                  )
                }
                onMouseEnter={() => setPreviewFront(stadium)}
                onMouseLeave={() => setPreviewFront(null)}
                className="relative block h-full w-full cursor-pointer overflow-hidden rounded-[inherit]"
              >
                <Image
                  src={CARD_FRONTS[stadium]}
                  alt=""
                  fill
                  sizes="20vw"
                  draggable={false}
                  className="object-cover"
                />
              </button>
            )}
          </div>
          <Fab
            label="Flip coin"
            onClick={onFlipCoin}
            className="absolute left-[33.75cqw] top-[41.25cqw] size-[2.2917cqw] rounded-[0.625cqw] [&_svg]:size-[0.7292cqw]"
          >
            <Ellipsis />
          </Fab>
          <Fab
            label="Restart"
            onClick={onReset}
            className="absolute left-[33.75cqw] top-[43.9583cqw] size-[2.2917cqw] rounded-[0.625cqw] [&_svg]:size-[0.7292cqw]"
          >
            <Undo2 />
          </Fab>

          <div
            data-slot="p1-active"
            className={cn(
              WIDE_ACTIVE,
              "left-[46.7708cqw] top-[30.3646cqw] border-self/50 p-0",
            )}
          >
            {deployed.active ? (
              <>
                {shownCondition ? (
                  <span className="pointer-events-none absolute top-[0.5cqw] -left-[0.45cqw] z-20">
                    <motion.span
                      key={shownCondition}
                      initial={{ opacity: 0.15 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                    >
                      <Image
                        src={`/status/${shownCondition}.png`}
                        alt=""
                        width={105}
                        height={105}
                        className="size-[1.3cqw] drop-shadow-[0_0.05cqw_0.1cqw_rgba(0,0,0,0.6)]"
                      />
                    </motion.span>
                  </span>
                ) : null}
                {hasShield ? (
                  <span className="pointer-events-none absolute top-1/2 -right-[0.45cqw] z-20 -translate-y-1/2">
                    <Image
                      src="/status/shield.png"
                      alt=""
                      width={105}
                      height={105}
                      className="size-[1.3cqw] drop-shadow-[0_0.05cqw_0.1cqw_rgba(0,0,0,0.6)]"
                    />
                  </span>
                ) : null}
                <DeployedCard
                  card={deployed.active}
                  onOpen={() => openActions("active")}
                  onPreview={setPreviewFront}
                />
              </>
            ) : (
              "Active"
            )}
          </div>

          {BENCH_LEFT.map((left, slot) => (
            <div
              key={left}
              data-slot={`p1-bench-${slot}`}
              className={cn(
                WIDE_CARD,
                left,
                "top-[40.3646cqw] flex items-center justify-center overflow-hidden p-0",
              )}
            >
              {deployed.bench[slot] ? (
                <DeployedCard
                  card={deployed.bench[slot]!}
                  onOpen={() => openActions(slot)}
                  onPreview={setPreviewFront}
                />
              ) : (
                "Bench"
              )}
            </div>
          ))}

          <div
            className="absolute left-[62.7604cqw] top-[30.375cqw] h-[6.71875cqw] w-[4.7917cqw]"
            onMouseEnter={() => openDeckMenu("p1")}
            onMouseLeave={scheduleCloseDeck}
          >
            <div
              className={cn(
                "relative h-full w-full transition-opacity",
                shuffleSide === "p1" && "opacity-0",
              )}
            >
              <DeckPile
                ref={deckP1Ref}
                count={deckCounts.p1}
                className="h-full w-full rounded-[0.5208cqw]"
                badgeClassName="rounded-[0.15cqw] px-[0.3cqw] py-[0.1cqw] text-[0.55cqw]"
              />
            </div>
            <DeckActions
              open={openDeck === "p1"}
              align="right"
              disabled={busy}
              onAction={(action) => runDeckAction("p1", action)}
              onMouseEnter={() => openDeckMenu("p1")}
              onMouseLeave={scheduleCloseDeck}
            />
          </div>
          <DiscardPile
            cards={discard}
            className={cn(WIDE_PILE, "left-[62.7604cqw] top-[37.8229cqw]")}
            labelClassName={WIDE_PILE_LABEL}
          />
          <button
            type="button"
            data-energy-zone="p1"
            onPointerDown={startEnergyDrag}
            className="absolute left-[62.7604cqw] top-[45.3229cqw] grid size-[2.3958cqw] cursor-grab place-items-center rounded-full border-[0.0521cqw] border-[#3a3a40] bg-[#141418] text-[#7ED957]"
          >
            <Leaf className="size-[1.2cqw]" />
            <span className="absolute -top-[0.4cqw] -right-[0.4cqw] grid size-[0.9cqw] place-items-center rounded-full bg-[#4CAF50] text-[0.6cqw] leading-none font-bold text-white">
              +
            </span>
          </button>
        </div>
      </div>
      <WideBar tag="Player 1" isTop={false} handCount={hands.p1.length} />
      <Hand
        side="p2"
        cards={hands.p2}
        offsets={offsets}
        handRef={handP2Ref}
        className="top-[0.5dvh]"
      />
      <Hand
        side="p1"
        cards={hands.p1}
        offsets={offsets}
        handRef={handP1Ref}
        className="bottom-[1dvh]"
        onHoverCard={(index) =>
          setPreviewFront(index === null ? null : index % CARD_FRONTS.length)
        }
        onCardDragEnd={handleCardDragEnd}
      />
      {departing.p1.map((card, index) => (
        <DepartingCardView key={card.id} card={card} index={index} />
      ))}
      {departing.p2.map((card, index) => (
        <DepartingCardView key={card.id} card={card} index={index} />
      ))}
      <AnimatePresence>
        {previewFront !== null ? (
          <div
            key="hand-preview"
            className="pointer-events-none absolute top-1/2 left-[14.9%] z-20 w-[min(17.5vw,30dvh)] -translate-x-1/2 -translate-y-1/2"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              <Image
                src={CARD_FRONTS[previewFront]}
                alt=""
                width={400}
                height={560}
                className="h-auto w-full rounded-xl shadow-[0_1vw_2.5vw_rgba(0,0,0,0.65)] ring-1 ring-white/10"
              />
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      {shuffleSide && shuffleBox ? (
        <ShuffleLayer
          x={shuffleBox.x}
          y={shuffleBox.y}
          width={shuffleBox.w}
          height={shuffleBox.h}
          dir={shuffleSide === "p1" ? "up" : "down"}
        />
      ) : null}

      {energyPointer ? (
        <div
          className="pointer-events-none fixed z-50 grid size-5 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#4CAF50] text-white shadow-[0_0_12px_rgba(76,175,80,0.8)]"
          style={{ left: energyPointer.x, top: energyPointer.y }}
        >
          <Leaf className="size-3" />
        </div>
      ) : null}

      <AnimatePresence>
        {deckPanel ? (
          <motion.div
            className="absolute inset-0 z-40 grid place-items-center bg-black/50 p-6 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setDeckPanel(null)}
          >
            <motion.div
              className="w-full max-w-sm rounded-2xl border border-white/15 bg-[#0B0B0E]/95 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              onClick={(event) => event.stopPropagation()}
            >
              <h2 className="text-center text-lg font-bold text-white">
                Player {deckPanel.side === "p1" ? "1" : "2"} deck
              </h2>
              {deckPanel.mode === "view" ? (
                <>
                  <p className="mt-1 text-center text-xs text-muted">
                    {deckCounts[deckPanel.side]} cards remaining
                  </p>
                  <div className="mt-4 grid max-h-[50dvh] grid-cols-5 gap-2 overflow-y-auto">
                    {Array.from(
                      { length: deckCounts[deckPanel.side] },
                      (_, card) => (
                        <Image
                          key={card}
                          src="/pick-deck/card-back.png"
                          alt=""
                          width={48}
                          height={67}
                          className="h-auto w-full rounded"
                        />
                      ),
                    )}
                  </div>
                </>
              ) : (
                <div className="mt-4 space-y-3 text-sm text-white/85">
                  <div className="flex items-center justify-between">
                    <span className="text-muted">Cards remaining</span>
                    <span className="font-bold text-white">
                      {deckCounts[deckPanel.side]}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted">Cards in hand</span>
                    <span className="font-bold text-white">
                      {hands[deckPanel.side].length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted">
                      Next draw is one specific card
                    </span>
                    <span className="font-bold text-white">
                      {deckCounts[deckPanel.side] > 0
                        ? `${(100 / deckCounts[deckPanel.side]).toFixed(1)}%`
                        : "-"}
                    </span>
                  </div>
                </div>
              )}
              <button
                type="button"
                onClick={() => setDeckPanel(null)}
                className="mt-5 w-full rounded-full border border-white/15 bg-white/10 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/20"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {actions ? (
        <CardActions
          x={actions.x}
          y={actions.y}
          active={actions.slot === "active"}
          statusCount={statuses.length}
          hasBench={deployed.bench.some((card) => card !== null)}
          onClose={() => setActions(null)}
          onAbility={() => {
            setActions(null);
            setAbilityConfirm(
              confirmPlacement(140, Math.min(280, window.innerWidth * 0.78)),
            );
          }}
          onMove={attack}
          onRetreat={retreat}
          onStatus={() => {
            setActions(null);
            setStatusOpen(true);
          }}
        />
      ) : null}

      {statusOpen ? (
        <StatusPopup
          selected={statuses}
          onToggle={toggleStatus}
          onClose={() => setStatusOpen(false)}
        />
      ) : null}

      {abilityConfirm ? (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setAbilityConfirm(null)}
        >
          <div
            className="absolute w-[min(17.5rem,78vw)] rounded-2xl border border-white/70 bg-[#0B0B0D]/95 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
            style={{ left: abilityConfirm.x, top: abilityConfirm.y }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <p className="text-[0.72rem] font-medium tracking-[0.16em] text-white/85">
                NAME
              </p>
              <button
                type="button"
                aria-label="Close ability"
                onClick={() => setAbilityConfirm(null)}
                className="grid size-5 place-items-center rounded-md border border-white/60 text-[0.65rem] text-white/80 transition-colors hover:bg-white/10"
              >
                x
              </button>
            </div>
            <div className="mt-3 flex items-center gap-2 rounded-full border border-[#B23B3B]/70 bg-[#2A0D10] px-2 py-1">
              <span className="rounded-full bg-[#521418] px-2.5 py-[0.15rem] text-[0.55rem] font-bold tracking-wide text-[#FF6B6B] uppercase">
                Ability
              </span>
              <span className="truncate text-[0.72rem] text-white/90">
                Name of ability
              </span>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setAbilityConfirm(null)}
                className="rounded-full bg-white px-5 py-1.5 text-xs font-semibold text-black transition-transform active:scale-95"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {stadiumConfirm && stadium !== null ? (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setStadiumConfirm(null)}
        >
          <div
            className="absolute w-[min(17.5rem,78vw)] rounded-2xl border border-white/70 bg-[#0B0B0D]/95 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
            style={{ left: stadiumConfirm.x, top: stadiumConfirm.y }}
            onClick={(event) => event.stopPropagation()}
          >
            <p className="text-[0.72rem] font-medium tracking-[0.16em] text-white/85">
              NAME
            </p>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={useStadium}
                className="rounded-full bg-white px-5 py-1.5 text-xs font-semibold text-black transition-transform active:scale-95"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
