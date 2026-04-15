"use client";

import {
  useCallback,
  useEffect,
  useReducer,
  useRef,
} from "react";
import type { Direction, GameState, ParsedLevel } from "@/lib/game/types";
import { initialState, applyMove, tickTimer } from "@/lib/game/engine";
import { recordLevelCleared } from "@/lib/game/progress";
import { Playfield } from "./Playfield";
import { GameHUD } from "./GameHUD";

type Action =
  | { type: "move"; dir: Direction }
  | { type: "tick" }
  | { type: "reset"; level: ParsedLevel }
  | { type: "clearBump" };

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "move":
      return applyMove(state, action.dir);
    case "tick":
      return tickTimer(state);
    case "reset":
      return initialState(action.level);
    case "clearBump":
      return { ...state, bump: false };
    default:
      return state;
  }
}

type GameScreenProps = {
  level: ParsedLevel;
  onBack: () => void;
};

export function GameScreen({ level, onBack }: GameScreenProps) {
  const [state, dispatch] = useReducer(reducer, level, initialState);
  const moveLock = useRef(false);
  const wonHandled = useRef(false);

  useEffect(() => {
    dispatch({ type: "reset", level });
    wonHandled.current = false;
  }, [level]);

  useEffect(() => {
    if (!state.bump) {
      return;
    }
    const t = window.setTimeout(() => dispatch({ type: "clearBump" }), 220);
    return () => window.clearTimeout(t);
  }, [state.bump]);

  useEffect(() => {
    if (state.status !== "playing" || state.timeLeftSec === null) {
      return;
    }
    const id = window.setInterval(() => dispatch({ type: "tick" }), 1000);
    return () => window.clearInterval(id);
  }, [state.status, state.timeLeftSec]);

  useEffect(() => {
    if (state.status === "won" && !wonHandled.current) {
      wonHandled.current = true;
      recordLevelCleared(level.id);
    }
  }, [state.status, level.id]);

  const onSwipe = useCallback(
    (dir: Direction) => {
      if (state.status !== "playing" || moveLock.current) {
        return;
      }
      moveLock.current = true;
      dispatch({ type: "move", dir });
      window.setTimeout(() => {
        moveLock.current = false;
      }, 180);
    },
    [state.status],
  );

  return (
    <div className="flex flex-col gap-3">
      <GameHUD
        levelName={level.name}
        state={state}
        onBack={onBack}
        onRetry={() => dispatch({ type: "reset", level })}
      />
      <Playfield level={level} state={state} onSwipe={onSwipe} />
    </div>
  );
}
