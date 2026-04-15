import type { ParsedLevel } from "./types";
import { cellKey } from "./types";

/** 6×6 ASCII maps: # wall, D drone, C crystal, H hazard, . empty */
const LEVEL_1 = [
  "######",
  "#D...#",
  "#.##.#",
  "#..C.#",
  "#C..C#",
  "######",
] as const;

const LEVEL_2 = [
  "######",
  "#D...#",
  "#.##.#",
  "#H.C.#",
  "#C..C#",
  "######",
] as const;

function parseMap(
  id: number,
  name: string,
  rows: readonly string[],
  movesBudget: number,
  timeLimitSec: number | null,
): ParsedLevel {
  const walls = new Set<string>();
  const crystals = new Set<string>();
  const hazards = new Set<string>();
  let droneStart = { row: 0, col: 0 };

  rows.forEach((row, r) => {
    [...row].forEach((ch, c) => {
      const key = cellKey(r, c);
      switch (ch) {
        case "#":
          walls.add(key);
          break;
        case "C":
          crystals.add(key);
          break;
        case "H":
          hazards.add(key);
          break;
        case "D":
          droneStart = { row: r, col: c };
          break;
        case ".":
          break;
        default:
          break;
      }
    });
  });

  return {
    id,
    name,
    size: rows.length,
    walls,
    crystals,
    hazards,
    droneStart,
    movesBudget,
    timeLimitSec,
  };
}

export const LEVELS: ParsedLevel[] = [
  parseMap(1, "Solar Array", LEVEL_1, 22, null),
  parseMap(2, "Reactor Core", LEVEL_2, 18, 90),
];

export const MAX_LEVEL = LEVELS.length;
