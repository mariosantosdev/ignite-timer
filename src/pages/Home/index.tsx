import { Play } from "phosphor-react";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  CountdownContainer,
  FormContainer,
  HomeContainer,
  MinutesAmountInput,
  Separator,
  StartCountdownButton,
  TaskInput,
} from "./styles";

type FormCountdown = {
  task: string;
  minutesAmount: number;
};

export function Home() {
  const { register, handleSubmit, watch } = useForm<FormCountdown>();

  const submitCountdown: SubmitHandler<FormCountdown> = () => {};

  const isDisabledSubmitButton = !watch("task") || !watch("minutesAmount");

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(submitCountdown)}>
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em:</label>
          <TaskInput
            type="text"
            id="task"
            placeholder="Nome do seu projeto"
            list="task-suggestions"
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
            {...register("minutesAmount", { valueAsNumber: true })}
          />

          <span>minutos.</span>
        </FormContainer>

        <CountdownContainer>
          <span>0</span>
          <span>0</span>
          <Separator>:</Separator>
          <span>0</span>
          <span>0</span>
        </CountdownContainer>

        <StartCountdownButton type="submit" disabled={isDisabledSubmitButton}>
          <Play size={24} />
          Começar
        </StartCountdownButton>
      </form>
    </HomeContainer>
  );
}
