import type { MetaFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { useTranslation } from "react-i18next";

type IndexData = {
  resources: Array<{ name: string; url: string }>;
  demos: Array<{ name: string; to: string }>;
};

export let loader: LoaderFunction = async ({ request }) => {
  let data: IndexData = {
    resources: [
      {
        name: "Remix Docs",
        url: "https://remix.run/docs",
      },
      {
        name: "React Router Docs",
        url: "https://reactrouter.com/docs",
      },
      {
        name: "Remix Discord",
        url: "https://discord.gg/VBePs6d",
      },
    ],
    demos: [
      {
        to: "demos/actions",
        name: "Actions",
      },
      {
        to: "demos/about",
        name: "Nested Routes, CSS loading/unloading",
      },
      {
        to: "demos/params",
        name: "URL Params and Error Boundaries",
      },
    ],
  };

  // https://remix.run/api/remix#json
  return json(data);
};

// https://remix.run/api/conventions#meta
export let meta: MetaFunction = () => {
  return {
    title: "Remix Starter",
    description: "Welcome to remix!",
  };
};

// https://remix.run/guides/routing#index-routes
export default function Index() {
  let { t, i18n } = useTranslation();
  let data = useLoaderData<IndexData>();

  return (
    <div className="remix__page">
      <main>
        <h2>{t("greeting")} to Remix!</h2>
        <p>We're stoked that you're here. 🥳</p>
        <p>
          Feel free to take a look around the code to see how Remix does things,
          it might be a bit different than what you’re used to. When you're
          ready to dive deeper, we've got plenty of resources to get you
          up-and-running quickly.
        </p>
        <p>
          Check out all the demos in this starter, and then just delete the{" "}
          <code>app/routes/demos</code> and <code>app/styles/demos</code>{" "}
          folders when you're ready to turn this into your next project.
        </p>
      </main>
      <aside>
        <h2>Demos In This App</h2>
        <ul>
          {data.demos.map((demo) => (
            <li key={demo.to} className="remix__page__resource">
              <Link to={demo.to} prefetch="intent">
                {demo.name}
              </Link>
            </li>
          ))}
        </ul>
        <h2>Resources</h2>
        <ul>
          {data.resources.map((resource) => (
            <li key={resource.url} className="remix__page__resource">
              <a href={resource.url}>{resource.name}</a>
            </li>
          ))}
        </ul>
        <div>
          <Link
            key={"en"}
            style={{
              marginRight: 5,
              fontWeight: i18n.resolvedLanguage === "en" ? "bold" : "normal",
            }}
            to={`?lng=en`}
          >
            English {i18n.resolvedLanguage === "en" ? "🇬🇧" : ""}
          </Link>
          <Link
            key={"fr"}
            style={{
              marginRight: 5,
              fontWeight: i18n.resolvedLanguage === "fr" ? "bold" : "normal",
            }}
            to={`?lng=fr`}
          >
            French {i18n.resolvedLanguage === "fr" ? "🇫🇷" : ""}
          </Link>
          <Link
            key={"nl"}
            style={{
              marginRight: 5,
              fontWeight: i18n.resolvedLanguage === "nl" ? "bold" : "normal",
            }}
            to={`?lng=nl`}
          >
            Dutch {i18n.resolvedLanguage === "nl" ? "🇳🇱" : ""}
          </Link>
        </div>
      </aside>
    </div>
  );
}
