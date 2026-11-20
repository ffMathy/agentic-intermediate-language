import { useEffect, useState } from "react";
import { specProjects } from "../../spec";
import { Section } from "../../parts/section";
import { SectionHeading } from "../../parts/section-heading";
import { SpecEditor } from "../../parts/spec-editor";
import { Stack } from "../../parts/stack";

const projectOrder = ["tictactoe", "site"];
const projects = projectOrder.flatMap((key) =>
  specProjects.filter((entry) => entry.key === key),
);

function folderOf(path: string): string {
  const index = path.lastIndexOf("/");
  return index < 0 ? "" : path.slice(0, index);
}

function nameOf(path: string): string {
  return path.slice(path.lastIndexOf("/") + 1);
}

function slashes(path: string): number {
  return path.split("/").length - 1;
}

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
      const index = rest.indexOf("/");
      if (index < 0) {
        return;
      }
      const key = rest.slice(0, index);
      const path = rest.slice(index + 1);
      const target = projects.find((entry) => entry.key === key);
      if (!target || !target.files.some((entry) => entry.path === path)) {
        return;
      }
      setProject(key);
      setFile(path);
      document.getElementById("specs")?.scrollIntoView();
    };
    const onHashChange = () => {
      open(location.hash);
    };
    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }
      const anchor = target.closest("a");
      const href = anchor?.getAttribute("href");
      if (href && href.startsWith("#spec/")) {
        open(href);
      }
    };
    open(location.hash);
    window.addEventListener("hashchange", onHashChange);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("hashchange", onHashChange);
      document.removeEventListener("click", onClick);
    };
  }, []);

  const shown = projects.find((entry) => entry.key === project);
  const files = shown ? shown.files : [];
  const nodeCount = shown ? shown.nodeCount : 0;
  const picked = files.find((entry) => entry.path === file);

  const rows: React.ReactNode[] = [];
  let previous = "";
  for (const entry of files) {
    const folder = folderOf(entry.path);
    if (folder !== previous && folder !== "") {
      const depth = slashes(folder) + 1;
      rows.push(
        <div
          key={`folder:${folder}:${entry.path}`}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--font-tiny)",
            color: "var(--color-code-muted)",
            padding: `var(--space-1) var(--space-3) var(--space-1) calc(var(--space-3) + ${12 * (depth - 1)}px)`,
          }}
        >
          {`${folder}/`}
        </div>,
      );
    }
    previous = folder;
    const isPicked = entry.path === file;
    const depth = slashes(entry.path);
    rows.push(
      <button
        key={`file:${entry.path}`}
        type="button"
        aria-label={entry.path}
        title={entry.path}
        aria-pressed={isPicked}
        onClick={() => setFile(entry.path)}
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
          padding: `var(--space-1) var(--space-3) var(--space-1) calc(var(--space-3) + ${12 * depth}px)`,
          cursor: "pointer",
        }}
      >
        {nameOf(entry.path)}
      </button>,
    );
  }

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
              <span
                style={{
                  display: "block",
                  width: "10px",
                  height: "10px",
                  borderRadius: "var(--radius-pill)",
                  background: "var(--color-dot-red)",
                }}
              />
              <span
                style={{
                  display: "block",
                  width: "10px",
                  height: "10px",
                  borderRadius: "var(--radius-pill)",
                  background: "var(--color-dot-amber)",
                }}
              />
              <span
                style={{
                  display: "block",
                  width: "10px",
                  height: "10px",
                  borderRadius: "var(--radius-pill)",
                  background: "var(--color-dot-green)",
                }}
              />
            </div>
            <div
              role="group"
              aria-label="Projects"
              style={{ display: "flex", gap: "var(--space-1)" }}
            >
              {projects.map((entry) => {
                const isShown = entry.key === project;
                return (
                  <button
                    key={entry.key}
                    type="button"
                    aria-pressed={isShown}
                    onClick={() => {
                      setProject(entry.key);
                      setFile(entry.files[0]?.path ?? "");
                    }}
                    style={{
                      fontSize: "var(--font-small)",
                      fontWeight: 600,
                      padding: "var(--space-1) var(--space-3)",
                      borderRadius: "var(--radius-md)",
                      border: "none",
                      background: isShown
                        ? "var(--color-code-pick)"
                        : "transparent",
                      color: isShown
                        ? "var(--color-code-text)"
                        : "var(--color-code-muted)",
                      cursor: "pointer",
                    }}
                  >
                    {entry.name}
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
              {`${nodeCount} nodes in ${files.length} files`}
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
                text={picked ? picked.text : ""}
                path={`${project}/${file}`}
                label={`Source of ${file}`}
              />
            </div>
          </div>
        </div>
      </Stack>
    </Section>
  );
}
