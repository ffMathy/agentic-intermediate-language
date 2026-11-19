import { GlobalRegistrator } from "@happy-dom/global-registrator";

// Default settings: happy-dom's "disable…Loading" settings throw on load
// instead of skipping it, which would fail any test that renders an iframe or
// a script tag.
GlobalRegistrator.register();

// Tests never fetch Monaco from its CDN: its loader is stubbed to stay
// pending forever, so the editor shows its plain fallback, exactly as it does
// in a browser that cannot load it.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const loader = require("@monaco-editor/loader");
(loader.default ?? loader).init = () => Object.assign(new Promise(() => {}), { cancel() {} });
