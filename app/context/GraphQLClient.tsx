import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";

const httpLink = createHttpLink({
  uri: window.ENV.API_URL,
});

const GraphqlClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: httpLink,
});

export default GraphqlClient;
