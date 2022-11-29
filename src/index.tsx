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
import { systemModalVar } from "@cache/index";
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
  if (networkError) {
    systemModalVar({
      ...systemModalVar(),
      isVisible: true,
      description: (
        <>
          내부 서버 오류로 인해 요청하신
          <br />
          작업을 완료하지 못했습니다.
          <br />
          다시 한 번 시도 후
          <br />
          같은 문제가 발생할 경우
          <br />
          찹스틱스로 문의해주세요
          <br />
          <br />
          code: {networkError.message}
        </>
      ),
      confirmButtonVisibility: true,
      confirmButtonClickHandler: () => {
        systemModalVar({
          ...systemModalVar(),
          isVisible: false,
        });
      },
      cancelButtonVisibility: false,
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
