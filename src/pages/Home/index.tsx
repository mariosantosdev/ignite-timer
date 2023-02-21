import { HandPalm, Play } from "phosphor-react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from "./styles";
import { NewCycleForm } from "./components/NewCycleForm";
import { Countdown } from "./components/Countdown";
import { SubmitHandler } from "react-hook-form";
import { useCycles } from "../../contexts/CycleContext";

const countdownValidationSchema = z.object({
  task: z.string().min(1, "O nome do projeto é obrigatório"),
  minutesAmount: z
    .number()
    .min(1, "O tempo mínimo é de 5 minutos")
    .max(60, "O tempo máximo é de 60 minutos")
    .int("O tempo deve ser um número inteiro"),
});

export type FormCountdown = z.infer<typeof countdownValidationSchema>;

export function Home() {
  const {
    activeCycle,
    minutes,
    seconds,
    handleInterrumptCycle,
    handleCreateCycle,
  } = useCycles();

  const newCycleForm = useForm<FormCountdown>({
    resolver: zodResolver(countdownValidationSchema),
    defaultValues: {
      task: "",
      minutesAmount: 0,
    },
  });
  const { handleSubmit, watch, reset } = newCycleForm;

  const submitCountdown: SubmitHandler<FormCountdown> = ({
    task,
    minutesAmount,
  }) => {
    const newCycle = {
      id: String(new Date().getTime()),
      task,
      minutesAmount,
      startedAt: new Date(),
    };

    handleCreateCycle(newCycle);
    reset();
  };

  const isDisabledSubmitButton = !watch("task");

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(submitCountdown)}>
        <FormProvider {...newCycleForm}>
          <NewCycleForm />
        </FormProvider>
        <Countdown minutes={minutes} seconds={seconds} />

        {activeCycle ? (
          <StopCountdownButton onClick={handleInterrumptCycle} type="button">
            <HandPalm size={24} />
            Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton type="submit" disabled={isDisabledSubmitButton}>
            <Play size={24} />
            Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  );
}
