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
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(
          locations
        )}, Path: ${JSON.stringify(path)}`
      )
    );

  if (networkError)
    console.log(`[Network error]: ${JSON.stringify(networkError)}`);
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
