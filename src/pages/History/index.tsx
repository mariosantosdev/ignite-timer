import { useCycles } from "../../contexts/CycleContext";
import { HistoryContainer, HistoryList, Status } from "./style";
import { formatDistanceToNow } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

export function History() {
  const { cycles } = useCycles();
  return (
    <HistoryContainer>
      <h1>Meu histórico</h1>

      <HistoryList>
        <table>
          <thead>
            <tr>
              <th>Tarefa</th>
              <th>Duração</th>
              <th>Inicio</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {cycles.map((cycle) => (
              <tr key={cycle.id}>
                <td>{cycle.task}</td>
                <td>{cycle.minutesAmount}</td>
                <td>
                  {formatDistanceToNow(cycle.startedAt, {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </td>
                <td>
                  {cycle.finishedAt ? (
                    <Status statusColor="green">Concluido</Status>
                  ) : cycle.interrupedAt ? (
                    <Status statusColor="red">Interrompido</Status>
                  ) : !cycle.finishedAt && !cycle.interrupedAt ? (
                    <Status statusColor="yellow">Em andamento</Status>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </HistoryList>
    </HistoryContainer>
  );
}
