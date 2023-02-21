import { CycleActionTypes } from "./actions";

export interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startedAt: Date;
  interrupedAt?: Date;
  finishedAt?: Date;
}

type CycleState = {
  cycles: Cycle[];
  currentCycleId: string | null;
};

export const CyclesReducer = (state: CycleState, action: any) => {
  switch (action.type) {
    case CycleActionTypes["CREATE_CYCLE"]:
      return {
        ...state,
        cycles: [...state.cycles, action.payload],
        currentCycleId: action.payload.id,
      };

    case CycleActionTypes["INTERRUPT_CYCLE"]:
      return {
        ...state,
        cycles: state.cycles.map((cycle) => {
          if (cycle.id === action.payload) {
            return { ...cycle, interrupedAt: new Date() };
          } else {
            return cycle;
          }
        }),
        currentCycleId: null,
      };

    case CycleActionTypes["FINISH_CYCLE"]:
      return {
        ...state,
        cycles: state.cycles.map((cycle) => {
          if (cycle.id === action.payload) {
            return { ...cycle, finishedAt: new Date() };
          } else {
            return cycle;
          }
        }),
        currentCycleId: null,
      };

    case CycleActionTypes["SET_CURRENT_CYCLE_ID"]:
      return {
        ...state,
        currentCycleId: action.payload,
      };

    default:
      return state;
  }
};
