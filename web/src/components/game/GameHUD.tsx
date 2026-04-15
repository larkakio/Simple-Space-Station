"use client";

import type { GameState } from "@/lib/game/types";

type GameHUDProps = {
  levelName: string;
  state: GameState;
  onBack: () => void;
  onRetry: () => void;
};

export function GameHUD({ levelName, state, onBack, onRetry }: GameHUDProps) {
  const crystalsTotal = state.level.crystals.size;
  const crystalsCollected = [...state.level.crystals].filter((k) =>
    state.collected.has(k),
  ).length;

  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-black/30 p-3">
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg border border-white/10 px-2 py-1 text-xs text-zinc-400 hover:border-white/25 hover:text-white"
        >
          Levels
        </button>
        <h2 className="text-center font-[family-name:var(--font-geist-sans)] text-sm font-semibold tracking-wide text-white">
          {levelName}
        </h2>
        <button
          type="button"
          onClick={onRetry}
          className="rounded-lg border border-[var(--neon-cyan)]/30 px-2 py-1 text-xs text-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)]/10"
        >
          Retry
        </button>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center font-mono text-xs text-zinc-400">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-zinc-600">
            Moves
          </div>
          <div className="text-lg tabular-nums text-[var(--neon-magenta)]">
            {state.movesLeft}
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-zinc-600">
            Data
          </div>
          <div className="text-lg tabular-nums text-[var(--neon-lime)]">
            {crystalsCollected}/{crystalsTotal}
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-zinc-600">
            Timer
          </div>
          <div className="text-lg tabular-nums text-[var(--neon-cyan)]">
            {state.timeLeftSec === null ? "—" : `${state.timeLeftSec}s`}
          </div>
        </div>
      </div>
      {state.status === "won" ? (
        <p className="text-center text-sm font-medium text-[var(--neon-lime)]">
          Sector stabilized — dock to the next ring.
        </p>
      ) : null}
      {state.status === "lost" ? (
        <p className="text-center text-sm text-rose-400/90">
          Link broken — retry before the station drifts.
        </p>
      ) : null}
      <p className="text-center text-[11px] leading-snug text-zinc-600">
        Swipe on the grid to move the repair drone. Hazards cost extra moves.
      </p>
    </div>
  );
}
