import { HistoryContainer, HistoryList, Status } from "./style";

export function History() {
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
            <tr>
              <td>Projeto 1</td>
              <td>25 minutos</td>
              <td>Ontem</td>
              <td>
                <Status statusColor="yellow">Em Andamento</Status>
              </td>
            </tr>
            <tr>
              <td>Projeto 2</td>
              <td>7 minutos</td>
              <td>Há cerca de 15 dias</td>
              <td>
                <Status statusColor="red">Interrompido</Status>
              </td>
            </tr>
            <tr>
              <td>Projeto 3</td>
              <td>45 minutos</td>
              <td>Há cerca de 2 meses</td>
              <td>
                <Status>Completo</Status>
              </td>
            </tr>
          </tbody>
        </table>
      </HistoryList>
    </HistoryContainer>
  );
}
