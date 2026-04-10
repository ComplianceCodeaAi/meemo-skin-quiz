import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { PostHogProvider } from "@posthog/react";

const options = {
  api_host: "https://us.i.posthog.com",
  defaults: "2026-01-30",
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <PostHogProvider
      apiKey="phc_CwrLrxgY5bUU5S63ngEFA83NoGhWJJTtbzDNGVbvRbaj"
      options={options}
    >
      <App />
    </PostHogProvider>
  </React.StrictMode>
);
