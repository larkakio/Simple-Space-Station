import type { Direction, GameState, ParsedLevel } from "./types";
import { cellKey } from "./types";

export function initialState(level: ParsedLevel): GameState {
  return {
    level,
    drone: { ...level.droneStart },
    collected: new Set<string>(),
    movesLeft: level.movesBudget,
    timeLeftSec: level.timeLimitSec,
    status: "playing",
    bump: false,
  };
}

function step(dr: number, dc: number, dir: Direction) {
  switch (dir) {
    case "up":
      return { row: dr - 1, col: dc };
    case "down":
      return { row: dr + 1, col: dc };
    case "left":
      return { row: dr, col: dc - 1 };
    case "right":
      return { row: dr, col: dc + 1 };
    default:
      return { row: dr, col: dc };
  }
}

export function applyMove(prev: GameState, dir: Direction): GameState {
  if (prev.status !== "playing") {
    return prev;
  }

  const { level, drone, collected, movesLeft, timeLeftSec } = prev;
  const next = step(drone.row, drone.col, dir);
  const k = cellKey(next.row, next.col);

  if (
    next.row < 0 ||
    next.col < 0 ||
    next.row >= level.size ||
    next.col >= level.size ||
    level.walls.has(k)
  ) {
    return { ...prev, bump: true };
  }

  const hazard = level.hazards.has(k);
  const moveCost = hazard ? 2 : 1;

  if (movesLeft < moveCost) {
    return {
      ...prev,
      status: "lost",
      bump: false,
    };
  }

  let nextCollected = collected;
  if (level.crystals.has(k) && !collected.has(k)) {
    nextCollected = new Set(collected);
    nextCollected.add(k);
  }

  const nextMoves = movesLeft - moveCost;
  const crystalsDone =
    level.crystals.size > 0 &&
    [...level.crystals].every((c) => nextCollected.has(c));

  if (crystalsDone) {
    return {
      ...prev,
      drone: next,
      collected: nextCollected,
      movesLeft: nextMoves,
      status: "won",
      bump: false,
    };
  }

  if (nextMoves <= 0) {
    return {
      ...prev,
      drone: next,
      collected: nextCollected,
      movesLeft: 0,
      status: "lost",
      bump: false,
    };
  }

  return {
    ...prev,
    drone: next,
    collected: nextCollected,
    movesLeft: nextMoves,
    timeLeftSec,
    bump: false,
  };
}

export function tickTimer(prev: GameState): GameState {
  if (prev.status !== "playing" || prev.timeLeftSec === null) {
    return prev;
  }
  if (prev.timeLeftSec <= 1) {
    return { ...prev, timeLeftSec: 0, status: "lost" };
  }
  return { ...prev, timeLeftSec: prev.timeLeftSec - 1 };
}
