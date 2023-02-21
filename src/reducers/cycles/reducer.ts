import { produce } from "immer";

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
      return produce(state, (draft) => {
        draft.cycles.push(action.payload);
        draft.currentCycleId = action.payload.id;
      });

    case CycleActionTypes["INTERRUPT_CYCLE"]:
      return produce(state, (draft) => {
        const currentCycleIndex = draft.cycles.findIndex(
          (cycle) => cycle.id === action.payload
        );
        if (currentCycleIndex < 0) return;

        draft.cycles[currentCycleIndex].interrupedAt = new Date();
        draft.currentCycleId = null;
      });

    case CycleActionTypes["FINISH_CYCLE"]:
      return produce(state, (draft) => {
        const currentCycleIndex = draft.cycles.findIndex(
          (cycle) => cycle.id === action.payload
        );
        if (currentCycleIndex < 0) return;

        draft.cycles[currentCycleIndex].finishedAt = new Date();
        draft.currentCycleId = null;
      });

    case CycleActionTypes["SET_CURRENT_CYCLE_ID"]:
      return {
        ...state,
        currentCycleId: action.payload,
      };

    default:
      return state;
  }
};
