import React from "react";
import ReactDOM from "react-dom/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
  from,
} from "@apollo/client";
import App from "./App";
import { systemModalVar } from "./cache";
import { AUTH_TOKEN_KEY } from "@constants/auth";

const httpLink = createHttpLink({
  uri: `${process.env.REACT_APP_SERVER_URI}/graphql`,
});

const authLink = setContext((_, { headers }) => {
  const token = sessionStorage.getItem(AUTH_TOKEN_KEY);

  return {
    // eslint-disable-next-line
    headers: {
      ...headers,
      "x-jwt": token ? token : "",
    },
  };
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  const {
    extensions: { code },
    message,
  } = graphQLErrors[0];

  if (graphQLErrors && networkError) {
    // Console
    console.log(`
  [에러코드]: ${code as string}
  [에러메세지]: ${message}
  `);

    // Modal
    systemModalVar({
      ...systemModalVar(),
      isVisible: true,
      description: (
        <>
          인터넷 서버 장애로 인해
          <br />
          해당 작업을 완료하지 못했습니다.
          <br />
          다시 시도해 주시길 바랍니다.
          <br />
          에러 코드: {code}
        </>
      ),
      confirmButtonVisibility: true,
      cancelButtonVisibility: false,

      confirmButtonClickHandler: () => {
        systemModalVar({
          ...systemModalVar(),
          isVisible: false,
        });
      },
    });
  }
});

const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ApolloProvider client={client}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ApolloProvider>
);
