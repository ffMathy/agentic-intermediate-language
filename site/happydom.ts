import { GlobalRegistrator } from "@happy-dom/global-registrator";

// Tests never load external scripts. Components that fetch code at runtime
// (the Monaco editor loads from a CDN) show their fallback instead.
GlobalRegistrator.register({
  settings: { disableJavaScriptFileLoading: true, disableCSSFileLoading: true, disableIframePageLoading: true },
});
