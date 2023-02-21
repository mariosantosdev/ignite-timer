import { Cycle } from "./reducer";

export enum CycleActionTypes {
  CREATE_CYCLE = "CREATE_CYCLE",
  INTERRUPT_CYCLE = "INTERRUPT_CYCLE",
  FINISH_CYCLE = "FINISH_CYCLE",
  SET_CURRENT_CYCLE_ID = "SET_CURRENT_CYCLE_ID",
}

export function addCycleAction(cycle: Cycle) {
  return { type: CycleActionTypes["CREATE_CYCLE"], payload: cycle };
}

export function interruptCycleAction(cycleId: string) {
  return { type: CycleActionTypes["INTERRUPT_CYCLE"], payload: cycleId };
}

export function finishCycleAction(cycleId: string) {
  return { type: CycleActionTypes["FINISH_CYCLE"], payload: cycleId };
}
