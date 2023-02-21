import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { differenceInSeconds } from "date-fns";
import { Cycle, CyclesReducer } from "../reducers/cycles/reducer";
import {
  addCycleAction,
  CycleActionTypes,
  finishCycleAction,
  interruptCycleAction,
} from "../reducers/cycles/actions";

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
  const [cyclesState, dispatchCycles] = useReducer(CyclesReducer, {
    cycles: [],
    currentCycleId: null,
  });

  const { cycles, currentCycleId } = cyclesState;
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
          setAmmountSecondsPassed(totalSeconds);
          handleFinishCycle();
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
    } else {
      document.title = `Ignite Timer`;
    }
  }, [minutes, seconds, activeCycle]);

  const handleCreateCycle = (cycle: Cycle) => {
    dispatchCycles(addCycleAction(cycle));
    setAmmountSecondsPassed(0);
  };

  const handleInterrumptCycle = () => {
    dispatchCycles(interruptCycleAction(currentCycleId));
  };

  const handleFinishCycle = () => {
    dispatchCycles(finishCycleAction(currentCycleId));
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
