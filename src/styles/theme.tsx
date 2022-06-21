export interface PaletteType {
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
}

const palette: PaletteType = {
  white: "#fff",
  black: "#000",
  grey900: "#192033",
  grey700: "#414A5B",
  grey500: "#BBC0C6",
  grey400: "#DFE2E6",
  grey300: "#ECEEEF",
  grey100: "#F4F7F9",
  red900: "#EA2715",
  red500: "#FFA59C",
};

const shadow = {
  boxShadow: "7px 10px 8px rgba(0, 0, 0, 0.1)",
};

const theme = {
  palette,
  shadow,
};

export default theme;
