import "./application/shared/axiosConfig";
import App from "./application/App";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { createRoot } from "react-dom/client";

const nonce = document.querySelector<HTMLMetaElement>(
  'meta[name="csp-nonce"]',
)?.content;

if (!nonce) {
  console.warn("CSP Nonce meta tag not found. MUI styles might be blocked.");
}

const isPrerendering =
  typeof window !== "undefined" &&
  Boolean(window.__PRERENDER_INJECTED?.isPrerendering);

const cache = createCache({
  key: "css",
  prepend: true,
  nonce: nonce,
  speedy: !isPrerendering,
});

const rootElement = document.getElementById("root");
if (rootElement) {
  const app = (
    <CacheProvider value={cache}>
      <App />
    </CacheProvider>
  );

  createRoot(rootElement).render(app);
} else {
  console.error("Failed to find the root element");
}
