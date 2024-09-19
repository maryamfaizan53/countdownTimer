"use client";
import { useState, useRef, useEffect, ChangeEvent } from "react";

export default function Countdown() {
  const [duration, setDuration] = useState<number | string>(""); 
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const timeRef = useRef<NodeJS.Timeout | null>(null);

  const handleSetDuration = (): void => {
    if (typeof duration === "number" && duration > 0) {
      setTimeLeft(duration);
      setIsActive(true);
      setIsPaused(false);
      if (timeRef.current) {
        clearInterval(timeRef.current);
      }
    }
  };

  const handleStart = (): void => {
    if (timeLeft > 0) {
      setIsActive(true);
      setIsPaused(false);
    }
  };

  const handlePause = (): void => {
    if (isActive) {
      setIsActive(false);
      setIsPaused(true);
      if (timeRef.current) {
        clearInterval(timeRef.current);
      }
    }
  };

  const handleReset = (): void => {
    setIsActive(false);
    setIsPaused(false);
    setTimeLeft(typeof duration === "number" ? duration : 0);
    if (timeRef.current) {
      clearInterval(timeRef.current);
    }
  };

  useEffect(() => {
    if (isActive && !isPaused) {
      timeRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timeRef.current!);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => {
      if (timeRef.current) {
        clearInterval(timeRef.current);
      }
    };
  }, [isActive, isPaused]);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const handleDurationChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = Number(e.target.value);
    if (value > 0) {
      setDuration(value);
    } else {
      setDuration(""); // Reset to empty for invalid input
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200 text-center">Countdown Timer</h1>

        <div className="flex items-center mb-6">
          <input
            type="number"
            id="duration"
            placeholder="Enter Duration in Seconds"
            value={typeof duration === "number" ? duration : ""} // Fix here
            onChange={handleDurationChange}
            className="flex-1 mr-4 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
          />
          <button onClick={handleSetDuration} variant="outline" className="text-gray-800 dark:text-gray-200">
            Set
          </button>
        </div>

        <div className="text-6xl font-bold text-gray-200 mb-8 text-center">{formatTime(timeLeft)}</div>

        <div className="flex justify-center gap-4">
          <button onClick={handleStart} variant="outline" className="text-gray-800 dark:text-gray-200">
            {isPaused ? "Resume" : "Start"}
          </button>
          <button onClick={handlePause} variant="outline" className="text-gray-800 dark:text-gray-200">
            Pause
          </button>
          <button onClick={handleReset} variant="outline" className="text-gray-800 dark:text-gray-200">
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
