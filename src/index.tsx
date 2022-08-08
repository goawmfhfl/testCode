import React from "react";
import ReactDOM from "react-dom/client";
import { setContext } from "@apollo/client/link/context";

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import App from "./App";

const httpLink = createHttpLink({
  uri: `${process.env.REACT_APP_SERVER_URI}/graphql`,
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem("authToken");
  console.log("authToken from localStorage", token);

  // return the headers to the context so httpLink can read them
  return {
    // eslint-disable-next-line
    headers: {
      ...headers,
      "x-jwt": token ? token : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
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
