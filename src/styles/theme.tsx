import { DefaultTheme } from "styled-components";

const palette = {
  white: "#fff",
  black: "#000",
  grey900: "#192033",
  grey700: "#414A5B",
  grey600: "#898C8E",
  grey500: "#BBC0C6",
  grey400: "#DFE2E6",
  grey300: "#ECEEEF",
  grey100: "#F4F7F9",
  red900: "#EA2715",
  red500: "#FFA59C",
  blue100: "#EFF9FF",
  yellow100: "#FFFCEF",
};

const shadow = {
  boxShadow: "7px 10px 8px rgba(0, 0, 0, 0.1)",
};

const typo = {
  korean: {
    title: {
      large: {
        basic: `
          font-family: Spoqa Han Sans Neo;
          font-size: 25px;
          font-weight: 500;
          line-height: 24px;
          letter-spacing: -0.015em;
          text-align: left;
        `,
        emphasized: `
          font-family: Spoqa Han Sans Neo;
          font-size: 25px;
          font-weight: 700;
          line-height: 24px;
          letter-spacing: -0.015em;
          text-align: left;
        `,
      },
      primary: {
        basic: `
          font-family: Spoqa Han Sans Neo;
          font-size: 18px;
          font-weight: 500;
          line-height: 24px;
          letter-spacing: -0.015em;
          text-align: left;
      `,
        emphasized: `
          font-family: Spoqa Han Sans Neo;
          font-size: 18px;
          font-weight: 700;
          line-height: 24px;
          letter-spacing: -0.015em;
          text-align: left;
      `,
      },
      secondary: {
        basic: `
          font-family: Spoqa Han Sans Neo;
          font-size: 16px;
          font-weight: 400;
          line-height: 18px;
          letter-spacing: -0.015em;
          text-align: left;
      `,
        emphasized: `
          font-family: Spoqa Han Sans Neo;
          font-size: 16px;
          font-weight: 500;
          line-height: 20px;
          letter-spacing: -0.015em;
          text-align: left;
      `,
      },
      tertiary: {
        basic: `
          font-family: Spoqa Han Sans Neo;
          font-size: 15px;
          font-weight: 400;
          line-height: 20px;
          letter-spacing: -0.015em;
          text-align: left;
      `,
        emphasized: `
          font-family: Spoqa Han Sans Neo;
          font-size: 15px;
          font-weight: 500;
          line-height: 20px;
          letter-spacing: -0.015em;
          text-align: left;
      `,
      },
    },
    headline: {
      basic: `
        font-family: Spoqa Han Sans Neo;
        font-size: 14px;
        font-weight: 500;
        line-height: 18px;
        letter-spacing: 0.10000000149011612px;
        text-align: left;
    `,
      emphasized: `
        font-family: Spoqa Han Sans Neo;
        font-size: 14px;
        font-weight: 700;
        line-height: 16px;
        letter-spacing: 0.10000000149011612px;
        text-align: left;
    `,
    },
    subHeadline: {
      basic: `
        font-family: Spoqa Han Sans Neo;
        font-size: 13px;
        font-weight: 400;
        line-height: 18px;
        letter-spacing: 0.10000000149011612px;
        text-align: left;
      `,
      emphasized: `
        font-family: Spoqa Han Sans Neo;
        font-size: 13px;
        font-weight: 500;
        line-height: 18px;
        letter-spacing: 0.10000000149011612px;
        text-align: left;
      `,
    },
    body: {
      primary: {
        basic: `
          font-family: Spoqa Han Sans Neo;
          font-size: 12px;
          font-weight: 500;
          line-height: 14px;
          letter-spacing: 0.10000000149011612px;
          text-align: left;
      `,
        emphasized: `
          font-family: Spoqa Han Sans Neo;
          font-size: 12px;
          font-weight: 700;
          line-height: 14px;
          letter-spacing: 0.10000000149011612px;
          text-align: left;
      `,
      },
      secondary: {
        basic: `
          font-family: Spoqa Han Sans Neo;
          font-size: 12px;
          font-weight: 300;
          line-height: 18px;
          letter-spacing: 0.10000000149011612px;
          text-align: left;
      `,
        emphasized: `
          font-family: Spoqa Han Sans Neo;
          font-size: 12px;
          font-weight: 500;
          line-height: 16px;
          letter-spacing: 0.10000000149011612px;
          text-align: left;
      `,
      },
    },
    caption: {
      primary: {
        basic: `
          font-family: Spoqa Han Sans Neo;
          font-size: 10px;
          font-weight: 300;
          line-height: 14px;
          letter-spacing: 0.10000000149011612px;
          text-align: left;
      `,
        emphasized: `
          font-family: Spoqa Han Sans Neo;
          font-size: 10px;
          font-weight: 500;
          line-height: 14px;
          letter-spacing: 0.10000000149011612px;
          text-align: left;
      `,
      },
    },
  },
  english: {
    title: {
      tertiary: `
        font-family: Helvetica;
        font-size: 20px;
        font-weight: 700;
        line-height: 20px;
        letter-spacing: -0.015em;
        text-align: left;
      `,
    },
  },
};

const theme: DefaultTheme = {
  palette,
  shadow,
  typo,
};

export default theme;
