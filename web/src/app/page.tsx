"use client";

import { startTransition, useEffect, useState } from "react";
import { WalletBar } from "@/components/wallet/WalletBar";
import { CheckInPanel } from "@/components/check-in/CheckInPanel";
import { LevelSelect } from "@/components/game/LevelSelect";
import { GameScreen } from "@/components/game/GameScreen";
import { LEVELS } from "@/lib/game/levels";
import type { ParsedLevel } from "@/lib/game/types";
import { loadProgress, defaultProgress, PROGRESS_KEY } from "@/lib/game/progress";

export default function Home() {
  const [unlockedLevel, setUnlockedLevel] = useState(
    defaultProgress().unlockedLevel,
  );
  const [hydrated, setHydrated] = useState(false);
  const [view, setView] = useState<"menu" | "play">("menu");
  const [activeLevel, setActiveLevel] = useState<ParsedLevel | null>(null);

  useEffect(() => {
    startTransition(() => {
      setUnlockedLevel(loadProgress().unlockedLevel);
      setHydrated(true);
    });
  }, []);

  function handleChooseLevel(level: ParsedLevel) {
    setActiveLevel(level);
    setView("play");
  }

  function handleBackToMenu() {
    setView("menu");
    setActiveLevel(null);
    if (typeof window !== "undefined") {
      setUnlockedLevel(loadProgress().unlockedLevel);
    }
  }

  function handleResetProgress() {
    if (typeof window === "undefined") {
      return;
    }
    window.localStorage.removeItem(PROGRESS_KEY);
    setUnlockedLevel(1);
    setView("menu");
    setActiveLevel(null);
  }

  return (
    <div className="relative flex min-h-dvh flex-col bg-[#030508] text-zinc-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,0,170,0.08),_transparent_50%)]" />
      <WalletBar />
      <main className="relative z-10 mx-auto flex w-full max-w-lg flex-1 flex-col gap-4 px-3 pb-8 pt-4">
        <header className="text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[var(--neon-cyan)]/80">
            Base // orbital ops
          </p>
          <h1 className="mt-1 font-[family-name:var(--font-geist-sans)] text-2xl font-bold tracking-tight text-[#f4f8fc] drop-shadow-[0_0_24px_rgba(0,255,209,0.35)]">
            Simple Space Station
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-zinc-500">
            Swipe the grid to pilot the repair drone. Collect every energy
            fragment before you run out of moves.
          </p>
        </header>

        {!hydrated ? (
          <p className="text-center text-sm text-zinc-600">Loading…</p>
        ) : view === "menu" ? (
          <LevelSelect
            unlockedLevel={unlockedLevel}
            levels={LEVELS}
            onChoose={handleChooseLevel}
          />
        ) : activeLevel ? (
          <GameScreen level={activeLevel} onBack={handleBackToMenu} />
        ) : null}

        <CheckInPanel />

        <footer className="mt-auto border-t border-white/5 pt-4 text-center">
          <button
            type="button"
            onClick={handleResetProgress}
            className="text-[11px] text-zinc-600 underline decoration-zinc-700 underline-offset-2 hover:text-zinc-400"
          >
            Reset mission progress (local)
          </button>
        </footer>
      </main>
    </div>
  );
}
