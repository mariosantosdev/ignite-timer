import { createContext, useContext, useEffect, useState } from "react";
import { differenceInSeconds } from "date-fns";

interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startedAt: Date;
  interrupedAt?: Date;
  finishedAt?: Date;
}

interface CycleContextData {
  cycles: Cycle[];
  activeCycle?: Cycle | null;
  minutes: string;
  seconds: string;
  handleCreateCycle: (cycle: Cycle) => void;
  handleInterrumptCycle: () => void;
  handleFinishCycle: () => void;
}

export const CyclesContext = createContext({} as CycleContextData);

interface CyclesProviderProps {
  children: React.ReactNode;
}

export function CyclesProvider({ children }: CyclesProviderProps) {
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [currentCycleId, setCurrentCycleId] = useState<string | null>(null);
  const [ammountSecondsPassed, setAmmountSecondsPassed] = useState(0);

  const activeCycle = cycles.find((cycle) => cycle.id === currentCycleId);

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0;
  const currentSeconts = activeCycle ? totalSeconds - ammountSecondsPassed : 0;

  const minutesAmount = Math.floor(currentSeconts / 60);
  const secondsAmount = currentSeconts % 60;

  const minutes = String(minutesAmount).padStart(2, "0");
  const seconds = String(secondsAmount).padStart(2, "0");

  useEffect(() => {
    let interval: number;
    if (activeCycle) {
      interval = setInterval(() => {
        const secondsDiff = differenceInSeconds(
          new Date(),
          activeCycle.startedAt
        );

        if (secondsDiff >= totalSeconds) {
          setCycles((prev) =>
            prev.map((cycle) => {
              if (cycle.id === currentCycleId) {
                return { ...cycle, interrupedAt: new Date() };
              } else {
                return cycle;
              }
            })
          );

          setAmmountSecondsPassed(totalSeconds);
          clearInterval(interval);
        } else {
          setAmmountSecondsPassed(secondsDiff);
        }
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [activeCycle, totalSeconds, currentCycleId]);

  useEffect(() => {
    if (activeCycle) {
      document.title = `${minutes}:${seconds} - Ignite Timer`;
    }
  }, [minutes, seconds, activeCycle]);

  const handleCreateCycle = (cycle: Cycle) => {
    setCycles((prev) => [...prev, cycle]);
    setCurrentCycleId(cycle.id);
    setAmmountSecondsPassed(0);
  };

  const handleInterrumptCycle = () => {
    setCycles((prev) =>
      prev.map((cycle) => {
        if (cycle.id === currentCycleId) {
          return { ...cycle, interrupedAt: new Date() };
        } else {
          return cycle;
        }
      })
    );

    setCurrentCycleId(null);
  };

  const handleFinishCycle = () => {
    setCycles((prev) =>
      prev.map((cycle) => {
        if (cycle.id === currentCycleId) {
          return { ...cycle, finishedAt: new Date() };
        } else {
          return cycle;
        }
      })
    );

    setCurrentCycleId(null);
  };

  return (
    <CyclesContext.Provider
      value={{
        cycles,
        activeCycle,
        minutes,
        seconds,
        handleCreateCycle,
        handleFinishCycle,
        handleInterrumptCycle,
      }}
    >
      {children}
    </CyclesContext.Provider>
  );
}

export const useCycles = () => useContext(CyclesContext);
