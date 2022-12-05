import { getTime } from "date-fns";
import { useState, useRef } from "react";

const useTimer = (timeLeftAsSecond: number) => {
  const endAtRef = useRef<number>(null);

  const [timeLeft, setTimeLeft] = useState((timeLeftAsSecond - 1) * 1000);
  const [isOver, setIsOver] = useState(false);

  const reset = (stopConditionCallback: () => boolean) => {
    setIsOver(false);
    endAtRef.current = getTime(new Date()) + timeLeftAsSecond * 1000;

    const interval = setInterval(() => {
      if (stopConditionCallback()) {
        clearInterval(interval);

        return;
      }

      const timeLeft = endAtRef.current - getTime(new Date());

      if (timeLeft < 0) {
        clearInterval(interval);
        setIsOver(true);

        return;
      }

      setTimeLeft(timeLeft);
    }, 1000);
  };

  return {
    timeLeft,
    isOver,
    reset,
  };
};

export default useTimer;
