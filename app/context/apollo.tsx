import { createContext } from "react";
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const isBrowser = typeof window !== "undefined";

const initialState = isBrowser ? window.__INITIAL_STATE__ : {};

const environment = isBrowser ? window.ENV.API_URL : process?.env.API_URL;

const authLink = setContext((_, { headers }) => {
  const localToken = localStorage.getItem("bearer");
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const browserToken = urlParams.get("token");
  const token = browserToken ? browserToken : localToken;
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token.replace(/"/g, "")}` : "",
    },
  };
});

const httpLink = createHttpLink({
  uri: environment,
});

export function initApollo(ssrMode = true) {
  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache().restore(initialState),
    ssrMode,
  });
}

export default createContext(initialState);
