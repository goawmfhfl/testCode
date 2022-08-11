import { createGlobalStyle, css } from "styled-components";
import { reset } from "styled-reset";

const GlobalStyles = createGlobalStyle<{ isModalVisible: boolean }>`
    ${reset}

    * {
      box-sizing: border-box;
    }

    html, body {
      margin: 0;
      padding: 0;
    }

    body {
      overflow: ${({ isModalVisible }) => (isModalVisible ? "hidden" : "")};;
    }

    #root {
      min-height:100vh;
    }

    html {
      -webkit-text-size-adjust: none;
      -ms-overflow-style: none;
      scrollbar-width: none;
    }

    a {
      color: inherit;
      text-decoration: none;
    }

    button,
    input,
    select,
    textarea {
      background-color: transparent;
      border: 0;
      padding: 0;
      cursor: pointer;

      &:focus {
          outline: none;
          box-shadow: none;
      }
    }

    input[type="radio"] {
      margin: 0;
      margin-left: 8px;
      margin-right: 8px;
    }

    // Remove downside arrow of select input
    select {
      /* for Firefox */
      -moz-appearance: none;
      /* for Chrome */
      -webkit-appearance: none;
    }

    /* For IE10 */
    select::-ms-expand {
      display: none;
    }

    a, button {
        cursor: pointer;
    }

    @font-face {
      font-family: "Spoqa Han Sans Neo";
      font-weight: 600;
      src: url("@fonts/SpoqaHanSansNeo/Bold.woff2");
    }
    @font-face {
      font-family: "Spoqa Han Sans Neo";
      font-weight: 500;
      src: url("@fonts/SpoqaHanSansNeo/Medium.woff2");
    }
    @font-face {
      font-family: "Spoqa Han Sans Neo";
      font-weight: 400;
      src: url("@fonts/SpoqaHanSansNeo/Regular.woff2");
    }
    @font-face {
      font-family: "Spoqa Han Sans Neo";
      font-weight: 300;
      src: url("@fonts/SpoqaHanSansNeo/Light.woff2");
    }
    @font-face {
      font-family: "Spoqa Han Sans Neo";
      font-weight: 200;
      src: url("@fonts/SpoqaHanSansNeo/Thin.woff2");
    }
`;

export const tableScrollbarStyles = css`
  &::-webkit-scrollbar {
    width: 14px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: none;
    background-color: ${({ theme: { palette } }) => palette.grey500};
  }

  &::-webkit-scrollbar-track {
    border-radius: none;
    -webkit-box-shadow: inset 0 0 2px
      ${({ theme: { palette } }) => palette.grey300};
  }
`;

export default GlobalStyles;
