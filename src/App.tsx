import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { CyclesProvider } from "./contexts/CycleContext";
import { Router } from "./Router";
import { GlobalStyle } from "./styles/global";
import { defaultTheme } from "./styles/themes/default";

export function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={defaultTheme}>
        <CyclesProvider>
          <Router />
        </CyclesProvider>

        <GlobalStyle />
      </ThemeProvider>
    </BrowserRouter>
  );
}
