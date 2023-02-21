import { Play } from "phosphor-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  CountdownContainer,
  FormContainer,
  HomeContainer,
  MinutesAmountInput,
  Separator,
  StartCountdownButton,
  TaskInput,
} from "./styles";

const countdownValidationSchema = z.object({
  task: z.string().min(1, "O nome do projeto é obrigatório"),
  minutesAmount: z
    .number()
    .min(5, "O tempo mínimo é de 5 minutos")
    .max(60, "O tempo máximo é de 60 minutos")
    .int("O tempo deve ser um número inteiro"),
});

type FormCountdown = z.infer<typeof countdownValidationSchema>;

export function Home() {
  const { register, handleSubmit, watch } = useForm<FormCountdown>({
    resolver: zodResolver(countdownValidationSchema),
  });

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
            min={5}
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
