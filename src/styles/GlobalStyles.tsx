import { createGlobalStyle, css } from "styled-components/macro";
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
      overflow: hidden;
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

    input {
      cursor: text;
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
      src: url("/fonts/SpoqaHanSansNeo/Bold.woff2") format("woff2");
    }
    @font-face {
      font-family: "Spoqa Han Sans Neo";
      font-weight: 500;
      src: url("/fonts/SpoqaHanSansNeo/Medium.woff2") format("woff2");
    }
    @font-face {
      font-family: "Spoqa Han Sans Neo";
      font-weight: 400;
      src: url("/fonts/SpoqaHanSansNeo/Regular.woff2") format("woff2");
    }
    @font-face {
      font-family: "Spoqa Han Sans Neo";
      font-weight: 300;
      src: url("/fonts/SpoqaHanSansNeo/Light.woff2") format("woff2");
    }
    @font-face {
      font-family: "Spoqa Han Sans Neo";
      font-weight: 200;
      src: url("/fonts/SpoqaHanSansNeo/Thin.woff2") format("woff2");
    }

    .react-datepicker-wrapper,
    .react-datepicker__input-container,
    .date-picker {
      max-width: 112px;
    }

    .date-picker {
      border: ${({ theme }) => `1px solid ${theme.palette.grey500}`};
      padding: 9px 8px;
      ${({ theme }) => theme.typo.korean.body.primary.basic};

      &:disabled {
        background-color: ${({ theme }) => theme.palette.grey100};
        color: ${({ theme }) => theme.palette.grey500};
        pointer-events: none;
      }
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
