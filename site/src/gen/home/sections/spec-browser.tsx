import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { specProjects } from "../../spec";
import { Section } from "../../parts/section";
import { SectionHeading } from "../../parts/section-heading";
import { SpecEditor } from "../../parts/spec-editor";
import { Stack } from "../../parts/stack";

/** Reading real specs is the fastest way to learn AIL, so both example specs can be browsed the way developers read code. */
export function SpecBrowser() {
  const [shownKey, setShownKey] = useState<string>("site");
  const [pickedPath, setPickedPath] = useState<string>("home/sections/spec-browser.ail.md");

  useEffect(() => {
    const open = (hash: string): void => {
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
      const project = specProjects.find((p) => p.key === key);
      if (!project || !project.files.some((f) => f.path === path)) {
        return;
      }
      setShownKey(key);
      setPickedPath(path);
      document.getElementById("specs")?.scrollIntoView();
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
      const href = anchor ? anchor.getAttribute("href") : null;
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

  const shown = specProjects.find((p) => p.key === shownKey) ?? specProjects[0];
  const pickedFile = shown.files.find((f) => f.path === pickedPath);

  const rows: ReactNode[] = [];
  let previousFolder = "";
  for (const file of shown.files) {
    const lastSlash = file.path.lastIndexOf("/");
    const folder = lastSlash < 0 ? "" : file.path.slice(0, lastSlash);
    const name = lastSlash < 0 ? file.path : file.path.slice(lastSlash + 1);
    if (folder !== previousFolder && folder !== "") {
      const folderDepth = folder.split("/").length - 1 + 1;
      rows.push(
        <div
          key={`folder:${folder}`}
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
    const depth = file.path.split("/").length - 1;
    const isPicked = file.path === pickedPath;
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
          border: "none",
          borderLeft: isPicked ? "2px solid var(--color-accent)" : "2px solid transparent",
          padding: "var(--space-1) var(--space-3)",
          paddingLeft: `calc(var(--space-3) + ${12 * depth}px)`,
          cursor: "pointer",
        }}
      >
        {name}
      </button>,
    );
  }

  return (
    <Section id="specs" tone="raised">
      <Stack dir="v" gap="space.6" align="stretch">
        <SectionHeading
          eyebrow="Dogfooding"
          text="Browse the specs"
          lead="Read both example specs the way you read code: this website, written in AIL and compiled by ail build, and the Tic-Tac-Toe demo. The files come straight from the specs at build time, so they are always current."
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
              <div style={{ width: "10px", height: "10px", borderRadius: "var(--radius-pill)", background: "var(--color-dot-red)" }} />
              <div style={{ width: "10px", height: "10px", borderRadius: "var(--radius-pill)", background: "var(--color-dot-amber)" }} />
              <div style={{ width: "10px", height: "10px", borderRadius: "var(--radius-pill)", background: "var(--color-dot-green)" }} />
            </div>
            <div role="group" aria-label="Projects" style={{ display: "flex", gap: "var(--space-1)" }}>
              {specProjects.map((project) => {
                const isShown = project.key === shown.key;
                return (
                  <button
                    key={project.key}
                    type="button"
                    aria-pressed={isShown}
                    onClick={() => {
                      if (project.key !== shown.key) {
                        setShownKey(project.key);
                        setPickedPath(project.files[0]?.path ?? "");
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
                    {project.name}
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
                text={pickedFile ? pickedFile.text : ""}
                path={`${shown.key}/${pickedPath}`}
                label={`Source of ${pickedPath}`}
              />
            </div>
          </div>
        </div>
      </Stack>
    </Section>
  );
}
