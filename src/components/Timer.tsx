import React, { useEffect, useRef, useState } from "react";
import { Player } from "../models/player";
import { Colors } from "../models/colors";

interface TimerProps {
  currentPlayer: Player | null;
  restart: () => void;
}

export default function Timer({ currentPlayer, restart }: TimerProps) {
  const [blackTime, setBlackTime] = useState(300);
  const [whiteTime, setWhiteTime] = useState(300);
  const timer = useRef<null | ReturnType<typeof setInterval>>(null);

  useEffect(() => {
    startTimer();
  }, [currentPlayer]);

  function startTimer() {
    if (timer.current) clearInterval(timer.current);

    const callback =
      currentPlayer?.color === Colors.WHITE
        ? decrementWhiteTimer
        : decrementBlackTimer;

    timer.current = setInterval(callback, 1000);
  }

  function decrementBlackTimer() {
    setBlackTime((prev) => prev - 1);
  }

  function decrementWhiteTimer() {
    setWhiteTime((prev) => prev - 1);
  }

  function handleRestart() {
    setWhiteTime(300);
    setBlackTime(300);
    restart();
  }

  return (
    <div className="p-4 bg-gray-900 text-white rounded-xl w-64 flex flex-col gap-4 shadow-xl">
      <button
        onClick={handleRestart}
        className="bg-red-500 hover:bg-red-600 py-2 rounded-lg font-semibold"
      >
        Restart Game
      </button>

      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-bold">
          🖤 Чёрные: <span className="font-mono">{blackTime}s</span>
        </h2>
        <h2 className="text-xl font-bold">
          🤍 Белые: <span className="font-mono">{whiteTime}s</span>
        </h2>
      </div>
    </div>
  );
}
