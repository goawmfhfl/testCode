import { ThemeProvider } from "styled-components/macro";
import GlobalStyles from "@styles/GlobalStyles";
import theme from "@styles/theme";

import { MockedProvider } from "@apollo/client/testing";

export const parameters = {
  layout: "fullscreen",
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  apolloClient: {
    MockedProvider,
  },
};

export const decorators = [
  (Story) => (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Story />
    </ThemeProvider>
  ),
];
