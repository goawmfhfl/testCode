import { createGlobalStyle } from "styled-components";
import { reset } from "styled-reset";

const GlobalStyles = createGlobalStyle`
    ${reset}

    * {
      box-sizing: border-box;
    }
    html, body {
      min-height:100%;
      margin: 0;
      padding: 0;
    }

    #root {
      min-height:100vh;
    }

    .App {
      position:relative;
      min-height:100vh;
      display:flex;
      flex-direction:column;
      height: auto;
    }

    ::-webkit-scrollbar {
      display: none;
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

    a, button {
        cursor: pointer;
    }

    @font-face {
      font-family: "SpoqaHanSansNeo";
      font-weight: 600;
      src: url("@fonts/SpoqaHanSansNeo/Bold.woff2");
    }
    @font-face {
      font-family: "SpoqaHanSansNeo";
      font-weight: 300;
      src: url("@fonts/SpoqaHanSansNeo/Light.woff2");
    }
    @font-face {
      font-family: "SpoqaHanSansNeo";
      font-weight: 500;
      src: url("@fonts/SpoqaHanSansNeo/Medium.woff2");
    }
    @font-face {
      font-family: "SpoqaHanSansNeo";
      font-weight: 400;
      src: url("@fonts/SpoqaHanSansNeo/Regular.woff2");
    }
    @font-face {
      font-family: "SpoqaHanSansNeo";
      font-weight: 200;
      src: url("@fonts/SpoqaHanSansNeo/Thin.woff2");
    }

`;
export default GlobalStyles;
