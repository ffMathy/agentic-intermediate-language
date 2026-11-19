// Preloaded into `bun test` by `ail` when it takes screenshots (never by
// projects themselves). After each test it records what the page showed at
// the end: the body's HTML and any styles added to the head at run time.
// Testing Library empties the body after each test, possibly before this
// file's afterEach runs, so the body is also saved just before its top-level
// elements, or their children, are removed. Bun does not expose test names here; `ail` pairs these
// records, in order, with the tests of the run's JUnit report.
import { afterEach, beforeEach } from "bun:test";
import { writeFileSync } from "node:fs";

const out = process.env.AIL_SHOTS_OUT;
const shots: { html: string; head: string }[] = [];

if (out) {
  // happy-dom rewrites some inline styles on the way in (`border: none`
  // becomes invalid longhands, `clamp()` is dropped), so keep each element's
  // styles exactly as the page set them, and use those in the screenshot.
  const raw = new WeakMap<Element, Map<string, string>>();
  const kebab = (k: string) => k.startsWith("--") ? k : k.replace(/^(Webkit|Moz|ms)(?=[A-Z])/, (v) => "-" + v.toLowerCase()).replace(/[A-Z]/g, (c) => "-" + c.toLowerCase()).replace(/^css-float$/, "float");
  let owner: { get: () => CSSStyleDeclaration } | null = null;
  for (let proto: object | null = HTMLElement.prototype; proto && !owner; proto = Object.getPrototypeOf(proto)) {
    const d = Object.getOwnPropertyDescriptor(proto, "style");
    if (d?.get) owner = { get: d.get as () => CSSStyleDeclaration };
  }
  const proxies = new WeakMap<Element, CSSStyleDeclaration>();
  if (owner) {
    const realGet = owner.get;
    Object.defineProperty(HTMLElement.prototype, "style", {
      configurable: true,
      get(this: HTMLElement) {
        const real = realGet.call(this);
        let px = proxies.get(this);
        if (px) return px;
        const el = this;
        const record = (k: string, v: unknown) => {
          const m = raw.get(el) ?? new Map<string, string>();
          raw.set(el, m);
          if (v === null || v === undefined || v === "") m.delete(k); else m.set(k, String(v));
        };
        px = new Proxy(real, {
          get(t, k) {
            const v = Reflect.get(t, k, t);
            if (k === "setProperty") return (name: string, value: string, prio?: string) => { record(name, value); return t.setProperty(name, value, prio ?? ""); };
            if (k === "removeProperty") return (name: string) => { record(name, ""); return t.removeProperty(name); };
            return typeof v === "function" ? v.bind(t) : v;
          },
          set(t, k, v) {
            if (typeof k === "string" && k !== "cssText") record(kebab(k), v);
            if (k === "cssText") raw.delete(el);
            return Reflect.set(t, k, v, t);
          },
        });
        proxies.set(this, px);
        return px;
      },
    });
  }
  /** The body's HTML, with each element's styles as the page set them. */
  const bodyHtml = (body: HTMLElement) => {
    const copy = body.cloneNode(true) as HTMLElement;
    const from = body.querySelectorAll("*"), to = copy.querySelectorAll("*");
    from.forEach((el, i) => {
      const m = raw.get(el);
      if (m?.size) to[i]!.setAttribute("style", [...m].map(([k, v]) => `${k}: ${v}`).join("; "));
    });
    return copy.innerHTML;
  };

  let lastFull: { html: string; head: string } | null = null;
  // Set once the test's screen starts being torn down: later saves would only
  // see what is left over (say, a link the test added outside the component).
  let frozen = false;
  const save = () => {
    const body = globalThis.document?.body;
    // Unmounting leaves empty containers behind: those are not a screen.
    if (frozen || !body || !body.innerHTML.replace(/<div><\/div>/g, "").trim()) return;
    const head = [...document.head.querySelectorAll("style")].map((s) => s.outerHTML).join("\n");
    lastFull = { html: bodyHtml(body), head };
  };
  const teardown = () => { save(); frozen = true; };

  // React roots: Testing Library's cleanup unmounts them. Save just before.
  try {
    const client = require(require.resolve("react-dom/client", { paths: [process.cwd()] }));
    const createRoot = client.createRoot;
    client.createRoot = (...args: unknown[]) => {
      const root = createRoot(...args);
      const unmount = root.unmount.bind(root);
      root.unmount = () => { teardown(); return unmount(); };
      return root;
    };
  } catch { /* not a React project: the DOM hooks below still apply */ }

  // Any other way of clearing the page: save before the body's top-level
  // elements, or their children, are removed.
  const removeChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function <T extends Node>(this: Node, child: T): T {
    if (this === document.body || this.parentNode === document.body) save();
    return removeChild.call(this, child) as T;
  };
  const remove = Element.prototype.remove;
  Element.prototype.remove = function (this: Element) {
    if (this.parentNode === document.body || this.parentNode?.parentNode === document.body) save();
    remove.call(this);
  };
  beforeEach(() => { lastFull = null; frozen = false; });
  afterEach(() => {
    save(); // when this runs before Testing Library's cleanup, the body is still all there
    shots.push(lastFull ?? { html: "", head: "" });
    writeFileSync(out, JSON.stringify(shots)); // bun test emits no exit event, so write as we go
  });
}
