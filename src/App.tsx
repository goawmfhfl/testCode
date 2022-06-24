import { ThemeProvider } from "styled-components";

import Login from "./pages/Login";
import GlobalStyles from "./styles/GlobalStyles";
import theme from "./styles/theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <div className="App">
        <Login />
      </div>
    </ThemeProvider>
  );
}

export default App;
