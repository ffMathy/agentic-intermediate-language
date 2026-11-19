import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { specProjects } from "../../spec";
import { Section } from "../../parts/section";
import { SectionHeading } from "../../parts/section-heading";
import { SpecEditor } from "../../parts/spec-editor";
import { Stack } from "../../parts/stack";

/** "two projects can be browsed: this website and the Tic-Tac-Toe demo; this website is shown first" */
export function SpecBrowser() {
  const [projectKey, setProjectKey] = useState("site");
  const [filePath, setFilePath] = useState("home/sections/spec-browser.ail.md");

  useEffect(() => {
    const onHash = () => {
      const hash = window.location.hash;
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
      const target = specProjects.find((p) => p.key === key);
      if (!target || !target.files.some((f) => f.path === path)) {
        return;
      }
      setProjectKey(key);
      setFilePath(path);
      const section = document.getElementById("specs");
      if (section) {
        section.scrollIntoView();
      }
    };
    onHash();
    window.addEventListener("hashchange", onHash);
    return () => {
      window.removeEventListener("hashchange", onHash);
    };
  }, []);

  const project = specProjects.find((p) => p.key === projectKey) ?? specProjects[0]!;
  const file = project.files.find((f) => f.path === filePath);
  const text = file ? file.text : "";

  const rows: ReactNode[] = [];
  let previousFolder = "";
  for (const f of project.files) {
    const last = f.path.lastIndexOf("/");
    const folder = last >= 0 ? f.path.slice(0, last) : "";
    if (folder !== previousFolder && folder !== "") {
      const folderDepth = folder.split("/").length - 1 + 1;
      rows.push(
        <div
          key={"folder:" + folder}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--font-tiny)",
            color: "var(--color-code-muted)",
            padding: "var(--space-1) var(--space-3)",
            paddingLeft: `calc(var(--space-3) + ${12 * (folderDepth - 1)}px)`,
          }}
        >
          {folder + "/"}
        </div>,
      );
    }
    previousFolder = folder;
    const depth = f.path.split("/").length - 1;
    const picked = f.path === filePath;
    rows.push(
      <button
        key={f.path}
        type="button"
        aria-label={f.path}
        title={f.path}
        aria-pressed={picked}
        onClick={() => setFilePath(f.path)}
        style={{
          display: "block",
          width: "100%",
          textAlign: "left",
          fontFamily: "var(--font-mono)",
          fontSize: "var(--font-tiny)",
          color: "var(--color-code-text)",
          background: picked ? "var(--color-code-pick)" : "transparent",
          borderTop: "none",
          borderRight: "none",
          borderBottom: "none",
          borderLeft: picked ? "2px solid var(--color-accent)" : "2px solid transparent",
          padding: "var(--space-1) var(--space-3)",
          paddingLeft: `calc(var(--space-3) + ${12 * depth}px)`,
          cursor: "pointer",
        }}
      >
        {f.path.slice(last + 1)}
      </button>,
    );
  }

  const dotStyle = (color: string) => ({
    display: "block",
    width: "10px",
    height: "10px",
    borderRadius: "var(--radius-pill)",
    background: color,
  });

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
              <span style={dotStyle("var(--color-dot-red)")} />
              <span style={dotStyle("var(--color-dot-amber)")} />
              <span style={dotStyle("var(--color-dot-green)")} />
            </div>
            <div role="group" aria-label="Projects" style={{ display: "flex", gap: "var(--space-1)" }}>
              {specProjects.map((p) => {
                const shown = p.key === project.key;
                return (
                  <button
                    key={p.key}
                    type="button"
                    aria-pressed={shown}
                    onClick={() => {
                      if (p.key !== project.key) {
                        setProjectKey(p.key);
                        setFilePath(p.files[0] ? p.files[0].path : "");
                      }
                    }}
                    style={{
                      fontSize: "var(--font-small)",
                      fontWeight: 600,
                      padding: "var(--space-1) var(--space-3)",
                      borderRadius: "var(--radius-md)",
                      border: "none",
                      background: shown ? "var(--color-code-pick)" : "transparent",
                      color: shown ? "var(--color-code-text)" : "var(--color-code-muted)",
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
              <SpecEditor text={text} path={project.key + "/" + filePath} label={`Source of ${filePath}`} />
            </div>
          </div>
        </div>
      </Stack>
    </Section>
  );
}
