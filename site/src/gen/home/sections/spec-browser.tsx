import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { specProjects } from "../../spec";
import { Section } from "../../parts/section";
import { SectionHeading } from "../../parts/section-heading";
import { SpecEditor } from "../../parts/spec-editor";
import { Stack } from "../../parts/stack";

const languageHref =
  "https://github.com/ffMathy/agentic-intermediate-language/blob/main/docs/language.md";

function slashCount(path: string): number {
  return path.split("/").length - 1;
}

function folderOf(path: string): string {
  const index = path.lastIndexOf("/");
  return index < 0 ? "" : path.slice(0, index);
}

function nameOf(path: string): string {
  return path.slice(path.lastIndexOf("/") + 1);
}

/** two projects can be browsed: the Tic-Tac-Toe demo and this website; the demo is shown first */
export function SpecBrowser() {
  const [project, setProject] = useState<string>("tictactoe");
  const [file, setFile] = useState<string>("tictactoe.ail.md");

  useEffect(() => {
    const open = (hash: string): void => {
      if (!hash.startsWith("#spec/")) {
        return;
      }
      const rest = hash.slice("#spec/".length);
      const index = rest.indexOf("/");
      if (index < 0) {
        return;
      }
      const key = rest.slice(0, index);
      const path = rest.slice(index + 1);
      const entry = specProjects.find((p) => p.key === key);
      if (entry === undefined || !entry.files.some((f) => f.path === path)) {
        return;
      }
      setProject(key);
      setFile(path);
      const element = document.getElementById("specs");
      if (element !== null) {
        element.scrollIntoView();
      }
    };
    const onHashChange = (): void => {
      open(window.location.hash);
    };
    const onClick = (event: MouseEvent): void => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }
      const anchor = target.closest("a");
      if (anchor === null) {
        return;
      }
      const href = anchor.getAttribute("href");
      if (href !== null && href.startsWith("#spec/")) {
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

  const shown = specProjects.find((p) => p.key === project) ?? specProjects[0];
  const picked = shown.files.find((f) => f.path === file);

  const rows: ReactNode[] = [];
  let previousFolder = "";
  shown.files.forEach((f, index) => {
    const folder = folderOf(f.path);
    if (folder !== previousFolder && folder !== "") {
      rows.push(
        <div
          key={`folder-${index}`}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--font-tiny)",
            color: "var(--color-code-muted)",
            padding: "var(--space-1) var(--space-3)",
            paddingLeft: `calc(var(--space-3) + ${12 * slashCount(folder)}px)`,
          }}
        >
          {`${folder}/`}
        </div>,
      );
    }
    previousFolder = folder;
    const isPicked = f.path === file;
    rows.push(
      <button
        key={`file-${index}`}
        type="button"
        aria-label={f.path}
        title={f.path}
        aria-pressed={isPicked}
        onClick={() => setFile(f.path)}
        style={{
          display: "block",
          width: "100%",
          textAlign: "left",
          fontFamily: "var(--font-mono)",
          fontSize: "var(--font-tiny)",
          color: "var(--color-code-text)",
          background: isPicked ? "var(--color-code-pick)" : "transparent",
          borderTop: "none",
          borderRight: "none",
          borderBottom: "none",
          borderLeft: isPicked
            ? "2px solid var(--color-accent)"
            : "2px solid transparent",
          padding: "var(--space-1) var(--space-3)",
          paddingLeft: `calc(var(--space-3) + ${12 * slashCount(f.path)}px)`,
          cursor: "pointer",
        }}
      >
        {nameOf(f.path)}
      </button>,
    );
  });

  return (
    <Section id="specs" tone="raised">
      <Stack dir="v" gap="space.6" align="stretch">
        <SectionHeading
          eyebrow="Dogfooding"
          text="Browse the specs"
          lead="Read both example specs the way you read code: the Tic-Tac-Toe demo, and this website itself, which is written in AIL and compiled by ail build too. The files come straight from the specs at build time, so they are always current."
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
              padding: "var(--space-2) var(--space-3)",
              background: "var(--color-code-bar)",
              borderBottom: "1px solid var(--color-code-border)",
            }}
          >
            <div aria-hidden="true" style={{ display: "flex", gap: "6px" }}>
              {["var(--color-dot-red)", "var(--color-dot-amber)", "var(--color-dot-green)"].map(
                (color) => (
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
                ),
              )}
            </div>
            <div
              role="group"
              aria-label="Projects"
              style={{ display: "flex", gap: "var(--space-1)" }}
            >
              {specProjects.map((p) => {
                const isShown = p.key === shown.key;
                return (
                  <button
                    key={p.key}
                    type="button"
                    aria-pressed={isShown}
                    onClick={() => {
                      if (p.key !== shown.key) {
                        setProject(p.key);
                        setFile(p.files[0]?.path ?? "");
                      }
                    }}
                    style={{
                      fontSize: "var(--font-small)",
                      fontWeight: 600,
                      padding: "var(--space-1) var(--space-3)",
                      borderRadius: "var(--radius-md)",
                      border: "none",
                      background: isShown ? "var(--color-code-pick)" : "transparent",
                      color: isShown ? "var(--color-code-text)" : "var(--color-code-muted)",
                      cursor: "pointer",
                    }}
                  >
                    {p.name}
                  </button>
                );
              })}
            </div>
            <p
              style={{
                margin: "0 0 0 auto",
                fontFamily: "var(--font-mono)",
                fontSize: "var(--font-tiny)",
                color: "var(--color-code-muted)",
              }}
            >
              {`${shown.nodeCount} nodes in ${shown.files.length} files`}
            </p>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            <nav
              aria-label="Spec files"
              style={{
                flex: "1 1 220px",
                maxHeight: "clamp(200px, 40vw, 560px)",
                overflowY: "auto",
                background: "var(--color-code-side)",
                padding: "var(--space-2) 0",
                boxSizing: "border-box",
              }}
            >
              {rows}
            </nav>
            <div style={{ flex: "999 1 420px", minWidth: 0, height: "560px" }}>
              <SpecEditor
                text={picked?.text ?? ""}
                path={`${shown.key}/${file}`}
                label={`Source of ${file}`}
              />
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
            href={languageHref}
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
