import type { EntryContext } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import { renderToString } from "react-dom/server";
import ApolloContext, { initApollo } from "./context/apollo";
import { ApolloProvider } from "@apollo/client";
import { getDataFromTree } from "@apollo/client/react/ssr";
import { createInstance } from "i18next";
import Backend from "i18next-fs-backend";
import { resolve } from "node:path";
import { I18nextProvider, initReactI18next } from "react-i18next";
import i18next from "./i18next.server";
import i18n from "./i18n";

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  const client = initApollo();

  // First, we create a new instance of i18next so every request will have a
  // completely unique instance and not share any state
  let instance = createInstance();

  // Then we could detect locale from the request
  let lng = await i18next.getLocale(request);
  // And here we detect what namespaces the routes about to render want to use
  let ns = i18next.getRouteNamespaces(remixContext);

  await instance
    .use(initReactI18next) // Tell our instance to use react-i18next
    .use(Backend) // Setup our backend
    .init({
      ...i18n, // spread the configuration
      lng, // The locale we detected above
      ns, // The namespaces the routes about to render wants to use
      backend: {
        loadPath: resolve("./public/locales/{{lng}}/{{ns}}.json"),
      },
    });

  const App = (
    <ApolloProvider client={client}>
      <I18nextProvider i18n={instance}>
        <RemixServer context={remixContext} url={request.url} />
      </I18nextProvider>
    </ApolloProvider>
  );

  return getDataFromTree(App).then(() => {
    const initialState = client.extract();

    const markup = renderToString(
      <ApolloContext.Provider value={initialState}>
        {App}
      </ApolloContext.Provider>
    );

    responseHeaders.set("Content-Type", "text/html");

    return new Response("<!DOCTYPE html>" + markup, {
      status: responseStatusCode,
      headers: responseHeaders,
    });
  });
}