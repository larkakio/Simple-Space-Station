export type Direction = "up" | "down" | "left" | "right";

export type ParsedLevel = {
  id: number;
  name: string;
  size: number;
  walls: Set<string>;
  crystals: Set<string>;
  hazards: Set<string>;
  droneStart: { row: number; col: number };
  movesBudget: number;
  /** Level 2+: seconds to survive */
  timeLimitSec: number | null;
};

export type GameStatus = "playing" | "won" | "lost";

export type GameState = {
  level: ParsedLevel;
  drone: { row: number; col: number };
  collected: Set<string>;
  movesLeft: number;
  timeLeftSec: number | null;
  status: GameStatus;
  /** invalid move feedback */
  bump: boolean;
};

export function cellKey(row: number, col: number) {
  return `${row},${col}`;
}
