import { useFormContext } from "react-hook-form";
import { useCycles } from "../../../../contexts/CycleContext";
import { FormContainer, MinutesAmountInput, TaskInput } from "./styles";

export function NewCycleForm() {
  const { activeCycle } = useCycles();
  const { register } = useFormContext();

  return (
    <FormContainer>
      <label htmlFor="task">Vou trabalhar em:</label>
      <TaskInput
        type="text"
        id="task"
        placeholder="Nome do seu projeto"
        list="task-suggestions"
        disabled={Boolean(activeCycle)}
        {...register("task")}
      />

      <datalist id="task-suggestions">
        <option value="Projeto 1" />
        <option value="Projeto 2" />
        <option value="Projeto 3" />
      </datalist>

      <label htmlFor="minutesAmount">durante</label>
      <MinutesAmountInput
        type="number"
        id="minutesAmount"
        placeholder="00"
        step={5}
        min={1}
        max={60}
        disabled={Boolean(activeCycle)}
        {...register("minutesAmount", { valueAsNumber: true })}
      />

      <span>minutos.</span>
    </FormContainer>
  );
}
