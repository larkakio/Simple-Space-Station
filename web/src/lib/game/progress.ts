import { MAX_LEVEL } from "./levels";

export const PROGRESS_KEY = "sss-progress-v1";

export type ProgressData = {
  unlockedLevel: number;
};

export function defaultProgress(): ProgressData {
  return { unlockedLevel: 1 };
}

export function loadProgress(): ProgressData {
  if (typeof window === "undefined") {
    return defaultProgress();
  }
  try {
    const raw = window.localStorage.getItem(PROGRESS_KEY);
    if (!raw) {
      return defaultProgress();
    }
    const p = JSON.parse(raw) as Partial<ProgressData>;
    const u = Math.max(1, Math.min(MAX_LEVEL, Number(p.unlockedLevel) || 1));
    return { unlockedLevel: u };
  } catch {
    return defaultProgress();
  }
}

export function saveProgress(data: ProgressData) {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(data));
}

/** After beating `levelId`, unlock the next level number when applicable. */
export function recordLevelCleared(levelId: number) {
  const p = loadProgress();
  const nextUnlocked = Math.min(MAX_LEVEL, levelId + 1);
  saveProgress({ unlockedLevel: Math.max(p.unlockedLevel, nextUnlocked) });
}
