import { useEffect, useState } from "react";
import { specProjects } from "../../../spec";
import { Section } from "../../../parts/section/section";
import { SectionHeading } from "../../../parts/section-heading/section-heading";
import { SpecEditor } from "../../../parts/spec-editor/spec-editor";
import { SpecShot } from "../../../parts/spec-shot/spec-shot";
import { Stack } from "../../../parts/stack/stack";
import { SpecTree } from "./spec-tree/spec-tree";

/** Reading real specs is the fastest way to learn AIL, so both example specs can be browsed the way developers read code. */
export function SpecBrowser() {
  const [project, setProject] = useState<string>("tictactoe");
  const [file, setFile] = useState<string>("tictactoe.ail.md");

  useEffect(() => {
    const open = (hash: string) => {
      if (!hash.startsWith("#spec/")) {
        return;
      }
      const rest = hash.slice("#spec/".length);
      const slash = rest.indexOf("/");
      if (slash < 0) {
        return;
      }
      const key = rest.slice(0, slash);
      const path = rest.slice(slash + 1);
      const target = specProjects.find((entry) => entry.key === key);
      if (!target) {
        return;
      }
      const known =
        target.files.some((entry) => entry.path === path) ||
        target.shots.some((entry) => entry.path === path);
      if (!known) {
        return;
      }
      setProject(key);
      setFile(path);
      document.getElementById("specs")?.scrollIntoView();
    };
    const onHashChange = () => {
      open(window.location.hash);
    };
    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }
      const href = target.closest("a")?.getAttribute("href");
      if (href && href.startsWith("#spec/")) {
        open(href);
      }
    };
    open(window.location.hash);
    window.addEventListener("hashchange", onHashChange);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("hashchange", onHashChange);
      document.removeEventListener("click", onClick);
    };
  }, []);

  const shown = specProjects.find((entry) => entry.key === project);
  const files = shown ? shown.files : [];
  const shots = shown ? shown.shots : [];
  const pickedFile = files.find((entry) => entry.path === file);
  const pickedShot = pickedFile ? undefined : shots.find((entry) => entry.path === file);

  const pickProject = (key: string) => {
    if (key === project) {
      return;
    }
    const next = specProjects.find((entry) => entry.key === key);
    if (!next) {
      return;
    }
    setProject(key);
    setFile(next.files[0]?.path ?? "");
  };

  return (
    <Section id="specs" tone="raised">
      <Stack dir="v" gap="space.6" align="stretch">
        <SectionHeading
          eyebrow="Dogfooding"
          text="Browse the specs"
          lead="Read both example specs the way you read code: the Tic-Tac-Toe demo, and this website itself, which is written in AIL and compiled by ail build too. Every screenshot that proves a part of the spec sits in a shots/ folder beside it. The files come straight from the repository at build time, so they are always current."
        />
        <div
          style={{
            borderRadius: "var(--radius-lg)",
            overflow: "hidden",
            border: "1px solid var(--color-code-border)",
            background: "var(--color-code)",
            boxShadow: "0 12px 32px rgba(15, 23, 42, 0.18)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "var(--space-3)",
              padding: "var(--space-1) var(--space-3)",
              background: "var(--color-code-bar)",
              borderBottom: "1px solid var(--color-code-border)",
            }}
          >
            <div aria-hidden="true" style={{ display: "flex", gap: "6px" }}>
              {["var(--color-dot-red)", "var(--color-dot-amber)", "var(--color-dot-green)"].map((color) => (
                <span
                  key={color}
                  style={{
                    display: "block",
                    width: "10px",
                    height: "10px",
                    borderRadius: "var(--radius-pill)",
                    background: color,
                  }}
                />
              ))}
            </div>
            <div role="group" aria-label="Projects" style={{ display: "flex", gap: "var(--space-1)" }}>
              {specProjects.map((entry) => {
                const isShown = entry.key === project;
                return (
                  <button
                    key={entry.key}
                    type="button"
                    aria-pressed={isShown}
                    onClick={() => pickProject(entry.key)}
                    style={{
                      fontSize: "var(--font-small)",
                      fontWeight: 600,
                      minHeight: "44px",
                      padding: "var(--space-1) var(--space-3)",
                      borderRadius: "var(--radius-md)",
                      border: "none",
                      background: isShown ? "var(--color-code-pick)" : "transparent",
                      color: isShown ? "var(--color-code-text)" : "var(--color-code-muted)",
                      cursor: "pointer",
                    }}
                  >
                    {entry.name}
                  </button>
                );
              })}
            </div>
            <p
              className="ail-wide"
              style={{
                margin: "0 0 0 auto",
                fontFamily: "var(--font-mono)",
                fontSize: "var(--font-tiny)",
                color: "var(--color-code-muted)",
              }}
            >
              {`${shown ? shown.nodeCount : 0} nodes in ${files.length} files, ${shots.length} screenshots`}
            </p>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            <SpecTree
              files={files.map((entry) => entry.path)}
              shots={shots.map((entry) => entry.path)}
              picked={file}
              onPick={(path: string) => setFile(path)}
            />
            <div
              style={{
                flex: "999 1 420px",
                minWidth: 0,
                maxWidth: "100%",
                overflow: "hidden",
                height: "clamp(380px, 120vw, 560px)",
              }}
            >
              {pickedFile ? (
                <SpecEditor
                  text={pickedFile.text}
                  path={`${project}/${pickedFile.path}`}
                  label={`Source of ${pickedFile.path}`}
                />
              ) : pickedShot ? (
                <SpecShot
                  node={pickedShot.node}
                  test={pickedShot.test}
                  path={pickedShot.path}
                  src={pickedShot.src}
                />
              ) : null}
            </div>
          </div>
        </div>
        <p
          style={{
            margin: 0,
            fontSize: "var(--font-body)",
            lineHeight: 1.6,
            color: "var(--color-text-muted)",
            maxWidth: "var(--width-prose)",
          }}
        >
          {"Every section, the notation for types and values, and the rules ail build enforces are in "}
          <a
            href="https://github.com/ffMathy/agentic-intermediate-language/blob/main/docs/language.md"
            style={{
              color: "var(--color-accent)",
              fontWeight: 600,
              textDecoration: "underline",
            }}
          >
            the language definition
          </a>
          {". A spec never uses a programming language's syntax: each compiler translates it into its target's own conventions."}
        </p>
      </Stack>
    </Section>
  );
}
