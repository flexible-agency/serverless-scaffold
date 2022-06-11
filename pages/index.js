import React, { useState } from "react";
import { v4 as uuid } from "uuid";
import { ArrowDownCircle, ArrowUpCircle, Trash } from "react-feather";

import { Checkboxes, TextInput, TriggerEditor } from "../components/inputs";
import { createTriggerPreview } from "../utils/createTriggerPreview";
import { exportZip } from "../utils/exportZip";
import Head from "next/head";

const defaultFunc = (first = false) => ({
  id: uuid(),
  name: first ? "hello-world" : "",
  triggers: first
    ? [
        {
          type: "httpGet",
          path: "/hello-world",
        },
      ]
    : [],
  collapsed: false,
});

export default function Home() {
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [cert, setCert] = useState("");
  const [sentryDsn, setSentryDsn] = useState("");
  const [extensions, setExtensions] = useState(["jest", "webpack"]);
  const [functions, setFunctions] = useState(() => [defaultFunc(true)]);

  const submit = () => {
    if (!name) {
      alert("Enter a project name.");
      return;
    }

    return exportZip({
      extensions,
      functions,
      name,
      domain,
      cert,
      sentryDsn,
    });
  };

  const addFunction = () => {
    setFunctions([
      ...functions.map((func) => {
        func.collapsed = true;
        return func;
      }),
      defaultFunc(),
    ]);
  };

  const updateFunction = (id, key, val) => {
    setFunctions(
      functions.map((func) => {
        if (key === "collapsed" && !val && func.id !== id) {
          func[key] = true;
        }
        if (func.id === id) {
          func[key] = val;
        }
        return func;
      })
    );
  };

  const removeFunction = (id) => {
    setFunctions(functions.filter((func) => func.id !== id));
  };

  return (
    <div>
      <Head>
        <title>Serverless Scaffold</title>
      </Head>

      <div className="max-w-xl mx-auto py-12">
        <h1 className="text-5xl font-bold mb-6">Serverless Scaffold</h1>
        <p className="prose prose-lg">
          This little tool will create a zip file as a starting point for your
          next Serverless Node.js project.
        </p>

        <h3 className="text-xl font-bold mt-12 border-b border-gray-200 pb-1 mb-6">
          Project basics
        </h3>
        <TextInput
          title="Project name"
          value={name}
          onChange={setName}
          pattern="[\w-]{2,36}"
        />

        <Checkboxes
          title="Extensions"
          value={extensions}
          onChange={setExtensions}
          options={[
            {
              id: "jest",
              title: "Unit tests – Jest",
            },
            {
              id: "webpack",
              title: "Webpack – serverless-webpack-plugin",
              disabled: extensions.includes("serverless-esbuild"),
            },
            {
              id: "dynamodb",
              title: "Database storage – DynamoDB table",
            },
            {
              id: "cognito",
              title: "Authentication – Cognito user pool",
            },
            {
              id: "serverless-esbuild",
              title: "ESbuild – serverless-esbuild",
              disabled: extensions.includes("webpack"),
            },
            {
              id: "serverless-domain-manager",
              title: "Custom domain – serverless-domain-manager",
            },
            {
              id: "sentry",
              title: "Sentry – @sentry/serverless",
            },
            {
              id: "serverless-prune-plugin",
              title: "Prune old versions – serverless-prune-plugin",
            },
            {
              id: "serverless-dotenv-plugin",
              title: "Load .env into serverless – serverless-dotenv-plugin",
            },
          ]}
        />

        {extensions.includes("serverless-domain-manager") && (
          <>
            <TextInput
              title="Domain name for your API"
              value={domain}
              onChange={setDomain}
              placeholder="api.myapp.com"
            />
            <TextInput
              title="Certificate name (needs to exist in us-east-1)"
              value={cert}
              onChange={setCert}
              placeholder="*.myapp.com"
            />
          </>
        )}
        {extensions.includes("sentry") && (
          <>
            <TextInput
              title="Sentry DSN"
              value={sentryDsn}
              onChange={setSentryDsn}
              placeholder="https://xxx@xxx.ingest.sentry.io/xxx"
            />
          </>
        )}

        <h3 className="text-xl font-bold mt-12 border-b border-gray-200 pb-1 mb-6">
          Functions
        </h3>
        <div className="functions">
          {functions.map((func) => (
            <div key={func.id} className="bg-gray-100 rounded-md p-6 mb-2">
              <h4 className="flex items-center justify-between font-semibold">
                <span
                  aria-hidden="true"
                  onClick={() =>
                    updateFunction(func.id, "collapsed", !func.collapsed)
                  }
                >
                  {func.name || "Untitled function"}
                </span>
                {func.collapsed ? (
                  <span>
                    <ArrowDownCircle
                      onClick={() =>
                        updateFunction(func.id, "collapsed", !func.collapsed)
                      }
                      color="#777"
                      size={18}
                    />
                  </span>
                ) : (
                  <span className="flex gap-2">
                    <Trash
                      aria-hidden="true"
                      onClick={() => removeFunction(func.id)}
                      color="#f92672"
                      size={18}
                    />
                    <ArrowUpCircle
                      aria-hidden="true"
                      onClick={() =>
                        updateFunction(func.id, "collapsed", !func.collapsed)
                      }
                      color="#333"
                      size={18}
                    />
                  </span>
                )}
              </h4>
              {func.collapsed ? (
                <div
                  className="summary"
                  aria-hidden="true"
                  onClick={() =>
                    updateFunction(func.id, "collapsed", !func.collapsed)
                  }
                >
                  {createTriggerPreview(func.triggers)}
                </div>
              ) : (
                <>
                  <TextInput
                    title="Function name"
                    value={func.name}
                    onChange={(v) => updateFunction(func.id, "name", v)}
                    pattern="[\w\/-]{2,36}"
                  />
                  <TriggerEditor
                    name={func.name}
                    value={func.triggers}
                    onChange={(v) => updateFunction(func.id, "triggers", v)}
                  />
                </>
              )}
            </div>
          ))}
        </div>
        <button
          className="inline-flex items-center mt-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          onClick={addFunction}
        >
          Add function
        </button>

        <h3 className="text-xl font-bold mt-12 border-b border-gray-200 pb-1 mb-6">
          Export
        </h3>
        <button
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={submit}
        >
          Export scaffolding
        </button>
      </div>
    </div>
  );
}
