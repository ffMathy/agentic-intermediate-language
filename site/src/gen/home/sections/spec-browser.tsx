import { useEffect, useState } from "react";
import { specProjects } from "../../spec";
import { Section } from "../../parts/section";
import { SectionHeading } from "../../parts/section-heading";
import { SpecEditor } from "../../parts/spec-editor";
import { Stack } from "../../parts/stack";

function folderOf(path: string): string {
  const index = path.lastIndexOf("/");
  return index < 0 ? "" : path.slice(0, index);
}

function slashCount(path: string): number {
  return path.split("/").length - 1;
}

/** "two projects can be browsed: the Tic-Tac-Toe demo and this website; the demo is shown first" */
export function SpecBrowser() {
  const [shownKey, setShownKey] = useState("tictactoe");
  const [pickedPath, setPickedPath] = useState("tictactoe.ail.md");

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
      const project = specProjects.find((entry) => entry.key === key);
      if (!project || !project.files.some((file) => file.path === path)) {
        return;
      }
      setShownKey(key);
      setPickedPath(path);
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
      const anchor = target.closest("a");
      const href = anchor?.getAttribute("href");
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

  const project =
    specProjects.find((entry) => entry.key === shownKey) ?? specProjects[0];
  const pickedFile = project.files.find((file) => file.path === pickedPath);

  const rows: React.ReactNode[] = [];
  let previousFolder = "";
  for (const file of project.files) {
    const folder = folderOf(file.path);
    if (folder !== previousFolder && folder !== "") {
      const folderDepth = slashCount(folder) + 1;
      rows.push(
        <div
          key={`${file.path}:folder`}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--font-tiny)",
            color: "var(--color-code-muted)",
            padding: "var(--space-1) var(--space-3)",
            paddingLeft: `calc(var(--space-3) + ${12 * (folderDepth - 1)}px)`,
          }}
        >
          {`${folder}/`}
        </div>,
      );
    }
    previousFolder = folder;
    const isPicked = file.path === pickedPath;
    const depth = slashCount(file.path);
    rows.push(
      <button
        key={file.path}
        type="button"
        aria-label={file.path}
        title={file.path}
        aria-pressed={isPicked}
        onClick={() => setPickedPath(file.path)}
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
          borderLeft: `2px solid ${isPicked ? "var(--color-accent)" : "transparent"}`,
          padding: "var(--space-1) var(--space-3)",
          paddingLeft: `calc(var(--space-3) + ${12 * depth}px)`,
          cursor: "pointer",
        }}
      >
        {file.path.slice(file.path.lastIndexOf("/") + 1)}
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
              {["red", "amber", "green"].map((dot) => (
                <div
                  key={dot}
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "var(--radius-pill)",
                    background: `var(--color-dot-${dot})`,
                  }}
                />
              ))}
            </div>
            <div
              role="group"
              aria-label="Projects"
              style={{ display: "flex", gap: "var(--space-1)" }}
            >
              {specProjects.map((entry) => {
                const isShown = entry.key === project.key;
                return (
                  <button
                    key={entry.key}
                    type="button"
                    aria-pressed={isShown}
                    onClick={() => {
                      if (entry.key !== project.key) {
                        setShownKey(entry.key);
                        setPickedPath(entry.files[0]?.path ?? "");
                      }
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
              {`${project.nodeCount} nodes in ${project.files.length} files`}
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
                text={pickedFile?.text ?? ""}
                path={`${project.key}/${pickedPath}`}
                label={`Source of ${pickedPath}`}
              />
            </div>
          </div>
        </div>
      </Stack>
    </Section>
  );
}
