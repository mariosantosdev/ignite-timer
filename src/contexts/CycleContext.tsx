import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { differenceInSeconds } from "date-fns";
import superjson from "superjson";
import { Cycle, CyclesReducer } from "../reducers/cycles/reducer";
import {
  addCycleAction,
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
  const [cyclesState, dispatchCycles] = useReducer(
    CyclesReducer,
    { cycles: [], currentCycleId: null },
    (initialState) => {
      const storageStateAsJSON = localStorage.getItem(
        "@igniteTimer:cycles-state_1.0.0"
      );

      if (storageStateAsJSON) {
        return superjson.parse<typeof initialState>(storageStateAsJSON);
      } else {
        return initialState;
      }
    }
  );

  const { cycles, currentCycleId } = cyclesState;
  const activeCycle = cycles.find((cycle) => cycle.id === currentCycleId);

  const [ammountSecondsPassed, setAmmountSecondsPassed] = useState(() => {
    if (!activeCycle) return 0;
    return differenceInSeconds(new Date(), new Date(activeCycle.startedAt));
  });

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0;
  const currentSeconts = activeCycle ? totalSeconds - ammountSecondsPassed : 0;

  const minutesAmount = Math.floor(currentSeconts / 60);
  const secondsAmount = currentSeconts % 60;

  const minutes = String(minutesAmount).padStart(2, "0");
  const seconds = String(secondsAmount).padStart(2, "0");

  useEffect(() => {
    const stateJSON = superjson.stringify(cyclesState);

    localStorage.setItem("@igniteTimer:cycles-state_1.0.0", stateJSON);
  }, [cyclesState]);

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
