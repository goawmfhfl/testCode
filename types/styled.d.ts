import styled from "styled-components/macro";

declare module "styled-components" {
  export interface DefaultTheme {
    palette: {
      white: string;
      black: string;
      grey900: string;
      grey700: string;
      grey600: string;
      grey500: string;
      grey400: string;
      grey300: string;
      grey100: string;
      red900: string;
      red500: string;
      blue100: string;
      yellow100: string;
    };
    shadow: {
      boxShadow: string;
    };
    typo: {
      korean: {
        title: {
          large: {
            basic: string;
            emphasized: string;
          };
          primary: {
            basic: string;
            emphasized: string;
          };
          secondary: {
            basic: string;
            emphasized: string;
          };
          tertiary: {
            basic: string;
            emphasized: string;
          };
        };
        headline: {
          basic: string;
          emphasized: string;
        };
        subHeadline: {
          basic: string;
          emphasized: string;
        };
        body: {
          primary: {
            basic: string;
            emphasized: string;
          };
          secondary: {
            basic: string;
            emphasized: string;
          };
        };
        caption: {
          primary: {
            basic: string;
            emphasized: string;
          };
        };
      };
      english: {
        title: {
          tertiary: string;
        };
      };
    };
  }

  export const createGlobalStyle;
}
