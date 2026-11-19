import { Fragment, useEffect, useState } from "react";
import { specProjects } from "../../spec";
import { Section } from "../../parts/section";
import { SectionHeading } from "../../parts/section-heading";
import { SpecEditor } from "../../parts/spec-editor";
import { Stack } from "../../parts/stack";

const folderOf = (path: string): string => {
  const index = path.lastIndexOf("/");
  return index >= 0 ? path.slice(0, index) : "";
};

const slashes = (path: string): number => path.split("/").length - 1;

/** "Reading real specs is the fastest way to learn AIL, so both example specs can be browsed the way developers read code." */
export function SpecBrowser() {
  const [shown, setShown] = useState<string>("site");
  const [picked, setPicked] = useState<string>("home/sections/spec-browser.ail.md");

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
      const project = specProjects.find((p) => p.key === key);
      if (!project || !project.files.some((f) => f.path === path)) {
        return;
      }
      setShown(key);
      setPicked(path);
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

  const project = specProjects.find((p) => p.key === shown) ?? specProjects[0];
  const files = project.files;
  const pickedFile = files.find((f) => f.path === picked);

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
              {["red", "amber", "green"].map((dot) => (
                <span
                  key={dot}
                  style={{
                    display: "block",
                    width: "10px",
                    height: "10px",
                    borderRadius: "var(--radius-pill)",
                    background: `var(--color-dot-${dot})`,
                  }}
                />
              ))}
            </div>
            <div role="group" aria-label="Projects" style={{ display: "flex", gap: "var(--space-1)" }}>
              {specProjects.map((p) => {
                const isShown = p.key === project.key;
                return (
                  <button
                    key={p.key}
                    type="button"
                    aria-pressed={isShown}
                    onClick={() => {
                      if (p.key !== project.key) {
                        setShown(p.key);
                        setPicked(p.files[0]?.path ?? "");
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
              {`${project.nodeCount} nodes in ${files.length} files`}
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
              {files.map((file, index) => {
                const folder = folderOf(file.path);
                const previous = index > 0 ? folderOf(files[index - 1].path) : "";
                const showFolder = folder !== "" && (index === 0 || folder !== previous);
                const isPicked = file.path === picked;
                const name = file.path.slice(file.path.lastIndexOf("/") + 1);
                return (
                  <Fragment key={file.path}>
                    {showFolder && (
                      <div
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "var(--font-tiny)",
                          color: "var(--color-code-muted)",
                          padding: "var(--space-1) var(--space-3)",
                          paddingLeft: `calc(var(--space-3) + ${12 * slashes(folder)}px)`,
                        }}
                      >
                        {`${folder}/`}
                      </div>
                    )}
                    <button
                      type="button"
                      aria-label={file.path}
                      title={file.path}
                      aria-pressed={isPicked}
                      onClick={() => setPicked(file.path)}
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
                        paddingLeft: `calc(var(--space-3) + ${12 * slashes(file.path)}px)`,
                        cursor: "pointer",
                      }}
                    >
                      {name}
                    </button>
                  </Fragment>
                );
              })}
            </nav>
            <div style={{ flex: "999 1 420px", minWidth: 0, height: "560px" }}>
              <SpecEditor
                text={pickedFile?.text ?? ""}
                path={`${project.key}/${picked}`}
                label={`Source of ${picked}`}
              />
            </div>
          </div>
        </div>
      </Stack>
    </Section>
  );
}
