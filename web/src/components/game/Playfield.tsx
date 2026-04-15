"use client";

import { useCallback, useRef } from "react";
import type { Direction, GameState, ParsedLevel } from "@/lib/game/types";
import { cellKey } from "@/lib/game/types";

type PlayfieldProps = {
  level: ParsedLevel;
  state: GameState;
  onSwipe: (dir: Direction) => void;
};

const SWIPE_MIN_PX = 36;

function dirFromDelta(dx: number, dy: number): Direction | null {
  if (Math.hypot(dx, dy) < SWIPE_MIN_PX) {
    return null;
  }
  if (Math.abs(dx) > Math.abs(dy)) {
    return dx > 0 ? "right" : "left";
  }
  return dy > 0 ? "down" : "up";
}

export function Playfield({ level, state, onSwipe }: PlayfieldProps) {
  const start = useRef<{ x: number; y: number } | null>(null);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    start.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  }, []);

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!start.current) {
        return;
      }
      const dx = e.clientX - start.current.x;
      const dy = e.clientY - start.current.y;
      start.current = null;
      const dir = dirFromDelta(dx, dy);
      if (dir) {
        onSwipe(dir);
      }
    },
    [onSwipe],
  );

  const bumpClass = state.bump ? "animate-[shake_0.2s_ease-out]" : "";

  return (
    <div
      className={`relative mx-auto aspect-square w-full max-w-[min(100vw-2rem,420px)] select-none touch-pan-y ${bumpClass}`}
    >
      <div
        role="application"
        aria-label="Station grid — swipe to move"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          start.current = null;
        }}
        className="honeycomb-bg grid h-full w-full cursor-grab touch-none grid-cols-6 grid-rows-6 gap-[3px] rounded-xl border border-[var(--neon-cyan)]/25 bg-[#030508] p-2 active:cursor-grabbing"
      >
        {Array.from({ length: level.size * level.size }, (_, i) => {
          const row = Math.floor(i / level.size);
          const col = i % level.size;
          const k = cellKey(row, col);
          const isWall = level.walls.has(k);
          const isCrystal = level.crystals.has(k);
          const isHazard = level.hazards.has(k);
          const isDrone =
            state.drone.row === row && state.drone.col === col;
          const collected = state.collected.has(k);

          let cellInner = (
            <span className="block h-full w-full rounded-md bg-white/[0.02]" />
          );

          if (isWall) {
            cellInner = (
              <span className="block h-full w-full rounded-md bg-zinc-800/90 shadow-inner ring-1 ring-white/10" />
            );
          } else if (isCrystal && !collected) {
            cellInner = (
              <span className="relative flex h-full w-full items-center justify-center">
                <span className="h-[55%] w-[55%] rounded-sm bg-[var(--neon-lime)] shadow-[0_0_18px_rgba(180,255,0,0.7)] animate-[pulse_2s_ease-in-out_infinite]" />
              </span>
            );
          } else if (isCrystal && collected) {
            cellInner = (
              <span className="flex h-full w-full items-center justify-center opacity-25">
                <span className="h-[40%] w-[40%] rounded-sm bg-zinc-600" />
              </span>
            );
          } else if (isHazard) {
            cellInner = (
              <span className="flex h-full w-full items-center justify-center">
                <span className="text-[10px] font-bold text-rose-500/90">
                  ⚡
                </span>
              </span>
            );
          }

          return (
            <div
              key={k}
              className="relative min-h-0 min-w-0 overflow-hidden rounded-md"
            >
              {cellInner}
              {isDrone ? (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="h-[70%] w-[70%] rounded-full border-2 border-[var(--neon-magenta)] bg-[var(--neon-magenta)]/20 shadow-[0_0_22px_rgba(255,0,170,0.55)]" />
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
