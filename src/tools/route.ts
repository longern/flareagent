import { Hono } from "hono";

import otherToolsRoute from "./other-tools";
import memoryRoute from "./memory";

import browserRoute from "./browser";
import dalle3Route from "./dalle-3";
import pythonRoute from "./python";
import searchRoute from "./search";

const app = new Hono();

const TOOL_LIST = [
  {
    id: "31ac14bb-b816-44de-b516-0ff49a22b629",
    definition_url: "tool://other-tools/openapi.yml",
  },
  {
    id: "ea802749-b7e7-4027-a01f-2761a54598c7",
    definition_url: "tool://memories/openapi.yml",
  },

  {
    id: "7eeb5eb8-bbcb-48e5-8f9b-e7b174c37cb0",
    definition_url: "tool://browser/openapi.yml",
  },
  {
    id: "bc9de670-35d2-420b-8e44-009fd236cfc9",
    definition_url: "tool://dalle-3/openapi.yml",
  },
  {
    id: "8d67c00d-b819-4117-b8e0-7c1c19b8f061",
    definition_url: "tool://python/openapi.yml",
  },
  {
    id: "a9a0ba3c-3eab-4978-a909-a19eddb9335d",
    definition_url: "tool://search/openapi.yml",
  },
];

app.get("/", () => {
  return Response.json({ tools: TOOL_LIST });
});

app.route("/other-tools", otherToolsRoute);

app.route("/memories", memoryRoute);

app.route("/browser", browserRoute);

app.route("/dalle-3", dalle3Route);

app.route("/python", pythonRoute);

app.route("/search", searchRoute);

export default app;
