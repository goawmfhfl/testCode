import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    palette: {
      white: string;
      black: string;
      grey900: string;
      grey700: string;
      grey500: string;
      grey400: string;
      grey300: string;
      grey100: string;
      red900: string;
      red500: string;
    };
    shadow: {
      boxShadow: string;
    };
  }
}
