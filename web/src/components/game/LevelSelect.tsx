"use client";

import type { ParsedLevel } from "@/lib/game/types";
import { MAX_LEVEL } from "@/lib/game/levels";

type LevelSelectProps = {
  unlockedLevel: number;
  onChoose: (level: ParsedLevel) => void;
  levels: ParsedLevel[];
};

export function LevelSelect({
  unlockedLevel,
  onChoose,
  levels,
}: LevelSelectProps) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-center font-[family-name:var(--font-geist-sans)] text-lg font-semibold tracking-tight text-white">
        Mission select
      </h2>
      <ul className="flex flex-col gap-2">
        {levels.map((lv) => {
          const locked = lv.id > unlockedLevel;
          return (
            <li key={lv.id}>
              <button
                type="button"
                disabled={locked}
                onClick={() => onChoose(lv)}
                className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-left transition hover:border-[var(--neon-cyan)]/40 hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <div>
                  <div className="font-mono text-xs text-zinc-500">
                    Sector {lv.id}/{MAX_LEVEL}
                  </div>
                  <div className="font-[family-name:var(--font-geist-sans)] text-base text-white">
                    {lv.name}
                  </div>
                  <div className="mt-1 text-xs text-zinc-600">
                    {lv.timeLimitSec
                      ? `Moves ${lv.movesBudget} · ${lv.timeLimitSec}s timer · hazards`
                      : `Moves ${lv.movesBudget} · tutorial grid`}
                  </div>
                </div>
                {locked ? (
                  <span className="text-xs font-medium uppercase tracking-wider text-zinc-600">
                    Locked
                  </span>
                ) : (
                  <span className="text-[var(--neon-cyan)]">▶</span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
