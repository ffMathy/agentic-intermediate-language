// The encapsulated slice of the spec one compile step sees.
//
// Included: the target, the design tokens, the glossary, the `why` chain of
// ancestors, the node itself, and the contract (`what` + `binds`) of every
// node it `uses`. Excluded: everything else, in particular any other node's
// `how` or code. Encapsulation is enforced by construction.
import { dirname, relative } from "node:path";
import { specText, type AilNode } from "./parse.ts";
import { ancestors, isExisting, modulePath, specModulePath, type Project } from "./project.ts";
import { checkHeader, checkPath, derivedCheckFile, foreignChecks, loadPrompt, needsDerivedCheck } from "./verify.ts";
import { oracleHash } from "./hash.ts";

function importSpecifier(fromPath: string, toPath: string): string {
  let rel = relative(dirname(fromPath), toPath).replace(/\.tsx?$/, "").replace(/(^|\/)index$/, "$1").replace(/\/$/, "");
  if (!rel.startsWith(".")) rel = "./" + rel;
  return rel;
}

const fence = (body: string, lang = "ail") => "```" + lang + "\n" + body.trimEnd() + "\n```";

/** A dependency as its dependants see it: `what` and `binds`, never `how`. */
export function whatOnly(n: AilNode): string {
  const header = n.raw[0]!;
  const visible = n.sections.filter((s) => s.key === "what" || s.key === "binds");
  return [header, ...(visible.length ? visible.flatMap((s) => s.raw) : ["  ; (no public contract)"])].join("\n");
}

/** Where a derived check imports from: its paths differ from the module's, since it lives elsewhere. */
export function checkImports(p: Project, n: AilNode, check: string): string {
  const foreign = foreignChecks(p, n);
  if (foreign) return `Write it in the target's language and test framework (see the target's \`tests\`); it is run with \`${foreign.run}\`, so it must build and run there.`;
  const mp = modulePath(p, n), sm = specModulePath(p);
  return [
    mp ? `From ${check}, import the module under test from "${importSpecifier(check, mp)}".` : "",
    sm ? `Import spec files, if needed, from "${importSpecifier(check, sm)}" (not the module's own path to it).` : "",
  ].filter(Boolean).join(" ");
}

export function buildContext(p: Project, n: AilNode): string {
  const out: string[] = [];
  const path = modulePath(p, n);
  out.push(`# AIL compile context: ${n.name}`);
  out.push(`kind: ${n.kind} · level: ${n.level ?? "?"}${n.tags.length ? " · tags: " + n.tags.map((t) => "@" + t).join(" ") : ""}`);
  out.push(`output file: ${path ?? "(none — this node's kind has no path in the target)"}`);

  if (p.target) {
    const t = p.target;
    out.push(`\n## Target (the project's conventions — normative)`);
    out.push(t.order.map((k) => `- ${k}: ${t.settings[k]}`).join("\n"));
  }
  if (Object.keys(p.tokens).length) {
    out.push(`\n## Design tokens`);
    out.push(Object.entries(p.tokens).map(([k, v]) => (v ? `${k}=${v}` : k)).join("  "));
    const css = p.target?.settings["tokens-css"];
    if (css) out.push(`They are CSS variables defined in ${css}: token a.b.c → var(--a-b-c).`);
  }
  const sm = specModulePath(p);
  if (sm && path) {
    out.push(`\n## Spec files, as data`);
    out.push(`"${importSpecifier(path, sm)}" exports specProjects: one entry per project ({ key, name, nodeCount, files, shots }), where files is every spec file ({ path, text }), paths relative to that project's spec folder, in explorer order (within each folder, its own files first, then its subfolders, each by name), and shots is the project's committed proof screenshots ({ node, test, path, src }: the node, the name of the test whose final screen it shows, the image's path relative to that project's spec folder (beside its node's spec file, in its folder's shots/), and an image URL for an img src), empty unless the project includes them. Import it only if this node's spec shows spec files or screenshots.`);
  }
  if (p.glossary.length) {
    out.push(`\n## Glossary`);
    out.push(p.glossary.map((t) => `- ${t.term}: ${t.plain} — formally ${t.formal}`).join("\n"));
  }

  const anc = ancestors(p, n.name);
  if (anc.length) {
    out.push(`\n## Why chain (root first; for intent and tie-breaking only)`);
    out.push(anc.map((a) => `- ${a.name}: ${a.why?.text ?? "(no why)"}`).join("\n"));
  }

  out.push(`\n## The node to implement`);
  out.push(fence(specText(n)));

  const deps = n.uses.map((u) => p.nodes.get(u)).filter(Boolean) as AilNode[];
  if (deps.length) {
    out.push(`\n## Dependencies (contract only — their implementation is hidden on purpose)`);
    out.push(`They are compiled before you, at exactly the import specifiers shown. Use their names and props as written; never re-create them.`);
    for (const d of deps) {
      const dp = modulePath(p, d);
      const where = isExisting(d) ? " — existing code, written by hand: use it as its contract says; never re-create it"
        : dp && path ? ` — built at ${dp}, ${foreignChecks(p) ? "and reached the way the target's conventions say" : `so import from "${importSpecifier(path, dp)}"`}` : "";
      out.push(`\n### ${d.name}${where}`);
      out.push(fence(whatOnly(d)));
    }
  }
  if (needsDerivedCheck(n, p)) {
    const { file, pinned } = derivedCheckFile(p, n);
    if (!file || pinned !== oracleHash(p, n).slice(0, 16)) {
      const rel = checkPath(p, n);
      out.push(`\n## Derived check needed`);
      out.push(`This node's ${foreignChecks(p) ? "examples / " : ""}scenarios / verify items have no current derived check. Write ${rel} as well, and submit it together with the module. ${checkImports(p, n, rel)} It starts with the line:\n${checkHeader(p, n)}\n\n${loadPrompt("derive-checks")}`);
    }
  }

  return out.join("\n") + "\n";
}

export { importSpecifier };
